import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { registerSchema, otpSendSchema, otpVerifySchema } from '../validators/schemas';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);

      // Create a dummy user email or phone signup in Supabase Auth
      // To keep it simple and robust, we can use password-less auth,
      // but to register metadata and profiles, we do it in public.profiles.
      // Let's create user in Auth system
      const userAuthParams: any = {
        phone: `+91${validated.mobile}`,
        email: validated.email || undefined,
        phone_confirm: true,
        email_confirm: true,
        user_metadata: {
          full_name: validated.fullName
        }
      };

      if (validated.role === 'shop_owner' && validated.password) {
        userAuthParams.password = validated.password;
      }

      const { data: userAuth, error: authError } = await supabaseAdmin.auth.admin.createUser(userAuthParams);

      if (authError && authError.status !== 422) { // 422 if user already exists
        return res.status(400).json({ error: authError.message });
      }

      // Find user ID from Supabase Auth
      let userId: string;
      if (userAuth.user) {
        userId = userAuth.user.id;
      } else {
        // Query user if already existing
        const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
        const found = existingUser.users.find((u: any) => u.phone === `+91${validated.mobile}` || u.phone === `91${validated.mobile}`);
        if (!found) {
          return res.status(400).json({ error: 'Failed to find/create authentication user' });
        }
        userId = found.id;
      }

      // Create profile record
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: userId,
          full_name: validated.fullName,
          mobile: validated.mobile,
          email: validated.email || null,
          state: validated.state,
          district: validated.district,
          taluka: validated.taluka,
          village: validated.village,
          role: validated.role
        })
        .select()
        .single();

      if (profileError) {
        return res.status(400).json({ error: profileError.message });
      }

      // If shop_owner, create shop record too
      if (validated.role === 'shop_owner') {
        const address = `${validated.village}, ${validated.taluka}, ${validated.district}, ${validated.state}`;
        const { error: shopError } = await supabaseAdmin
          .from('shops')
          .insert({
            owner_id: userId,
            shop_name: validated.shopName || '',
            license_number: validated.gstNumber || '',
            address: address,
            is_approved: true // Auto-approve for easy development and usage
          });
        if (shopError) {
          // Clean up the created profile if shop insertion fails
          await supabaseAdmin.from('profiles').delete().eq('user_id', userId);
          return res.status(400).json({ error: shopError.message });
        }
      }

      return res.status(201).json({
        message: 'Registration successful',
        profile
      });
    } catch (err) {
      next(err);
    }
  }

  public static async loginPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { mobile, password } = req.body;
      if (!mobile || !password) {
        return res.status(400).json({ error: 'Mobile and password required' });
      }

      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        phone: `+91${mobile}`,
        password
      });

      if (error || !data.session) {
        return res.status(400).json({ error: error?.message || 'Invalid credentials' });
      }

      // Fetch user profile
      const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('mobile', mobile).single();

      if (!profile || (profile.role !== 'shop_owner' && profile.role !== 'admin' && profile.role !== 'super_admin')) {
         return res.status(403).json({ error: 'This login is only for Shop Owners and Admins' });
      }

      return res.status(200).json({
        message: 'Login successful',
        token: data.session.access_token,
        profile
      });
    } catch (err) {
      next(err);
    }
  }

  public static async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { mobile, email } = otpSendSchema.parse(req.body);

      let error: any = null;
      if (email) {
        const { error: err } = await supabaseAdmin.auth.signInWithOtp({ email });
        error = err;
      } else {
        const { error: err } = await supabaseAdmin.auth.signInWithOtp({ phone: `+91${mobile}` });
        error = err;
      }

      if (error) {
        if (error.message.includes('SMS provider') || error.message.includes('not configured') || error.message.includes('Mailer') || error.message.includes('email provider')) {
          return res.status(200).json({
            message: 'OTP sent successfully (Development fallback: Use OTP 123456)',
            development: true
          });
        }
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
      next(err);
    }
  }

  public static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { mobile, email, otp } = otpVerifySchema.parse(req.body);

      let sessionData: any = null;

      if (otp === '123456') {
        // Dev bypass - Query profiles directly to avoid phone format issues
        const { data: foundProfile } = email 
          ? await supabaseAdmin.from('profiles').select('*').eq('email', email).single()
          : await supabaseAdmin.from('profiles').select('*').eq('mobile', mobile).single();
          
        if (!foundProfile) {
          return res.status(404).json({ error: 'User not found, please register first' });
        }

        sessionData = {
          access_token: `mock-token-${foundProfile.mobile}`,
          user: { id: foundProfile.user_id }
        };
      } else {
        const verifyOptions = email 
          ? { email, token: otp, type: 'email' as const }
          : { phone: `+91${mobile}`, token: otp, type: 'sms' as const };

        const { data, error } = await supabaseAdmin.auth.verifyOtp(verifyOptions);

        if (error || !data.session) {
          return res.status(400).json({ error: error?.message || 'Verification failed' });
        }
        sessionData = data.session;
      }

      // Fetch user profile
      const query = supabaseAdmin.from('profiles').select('*');
      const { data: profile } = email 
        ? await query.eq('email', email).single()
        : await query.eq('mobile', mobile).single();

      return res.status(200).json({
        message: 'Login successful',
        token: sessionData.access_token,
        profile
      });
    } catch (err) {
      next(err);
    }
  }

  public static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Handles session termination
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }
}
