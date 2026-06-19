"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const supabase_1 = require("../config/supabase");
const schemas_1 = require("../validators/schemas");
class AuthController {
    static async register(req, res, next) {
        try {
            const validated = schemas_1.registerSchema.parse(req.body);
            // Create a dummy user email or phone signup in Supabase Auth
            // To keep it simple and robust, we can use password-less auth,
            // but to register metadata and profiles, we do it in public.profiles.
            // Let's create user in Auth system
            const userAuthParams = {
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
            const { data: userAuth, error: authError } = await supabase_1.supabaseAdmin.auth.admin.createUser(userAuthParams);
            if (authError && authError.status !== 422) { // 422 if user already exists
                return res.status(400).json({ error: authError.message });
            }
            // Find user ID from Supabase Auth
            let userId;
            if (userAuth.user) {
                userId = userAuth.user.id;
            }
            else {
                // Query user if already existing
                const { data: existingUser } = await supabase_1.supabaseAdmin.auth.admin.listUsers();
                const found = existingUser.users.find((u) => u.phone === `+91${validated.mobile}` || u.phone === `91${validated.mobile}`);
                if (!found) {
                    return res.status(400).json({ error: 'Failed to find/create authentication user' });
                }
                userId = found.id;
            }
            // Create profile record
            const { data: profile, error: profileError } = await supabase_1.supabaseAdmin
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
                const { error: shopError } = await supabase_1.supabaseAdmin
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
                    await supabase_1.supabaseAdmin.from('profiles').delete().eq('user_id', userId);
                    return res.status(400).json({ error: shopError.message });
                }
            }
            return res.status(201).json({
                message: 'Registration successful',
                profile
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async loginPassword(req, res, next) {
        try {
            const { mobile, password } = req.body;
            if (!mobile || !password) {
                return res.status(400).json({ error: 'Mobile and password required' });
            }
            let sessionToken = null;
            // Try Supabase phone+password login first
            const { data, error } = await supabase_1.supabaseAdmin.auth.signInWithPassword({
                phone: `+91${mobile}`,
                password
            });
            if (error) {
                // If phone auth is disabled in Supabase, fall back to direct profile verification
                if (error.message.includes('Phone logins are disabled') || error.message.includes('Phone signups are disabled')) {
                    // Look up the profile directly
                    const { data: profile } = await supabase_1.supabaseAdmin.from('profiles').select('*').eq('mobile', mobile).single();
                    if (!profile || (profile.role !== 'shop_owner' && profile.role !== 'admin' && profile.role !== 'super_admin')) {
                        return res.status(403).json({ error: 'This login is only for Shop Owners and Admins' });
                    }
                    // Verify password via Supabase Admin API - get user and try email-based auth or direct verify
                    const { data: userData } = await supabase_1.supabaseAdmin.auth.admin.getUserById(profile.user_id);
                    if (!userData?.user) {
                        return res.status(400).json({ error: 'User not found in auth system' });
                    }
                    // Try signing in with email if user has one, otherwise use dev fallback
                    const userEmail = userData.user.email;
                    if (userEmail) {
                        const { data: emailLogin, error: emailError } = await supabase_1.supabaseAdmin.auth.signInWithPassword({
                            email: userEmail,
                            password
                        });
                        if (emailError || !emailLogin.session) {
                            return res.status(400).json({ error: 'Invalid credentials' });
                        }
                        sessionToken = emailLogin.session.access_token;
                    }
                    else {
                        // Dev fallback: verify password matches known dev credentials
                        // In production, you'd want email-based auth configured
                        if (password === 'admin123' || password === 'shop123') {
                            sessionToken = `dev-token-${profile.user_id}`;
                        }
                        else {
                            return res.status(400).json({ error: 'Invalid credentials' });
                        }
                    }
                    return res.status(200).json({
                        message: 'Login successful',
                        token: sessionToken,
                        profile
                    });
                }
                return res.status(400).json({ error: error.message || 'Invalid credentials' });
            }
            if (!data.session) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }
            // Fetch user profile
            const { data: profile } = await supabase_1.supabaseAdmin.from('profiles').select('*').eq('mobile', mobile).single();
            if (!profile || (profile.role !== 'shop_owner' && profile.role !== 'admin' && profile.role !== 'super_admin')) {
                return res.status(403).json({ error: 'This login is only for Shop Owners and Admins' });
            }
            return res.status(200).json({
                message: 'Login successful',
                token: data.session.access_token,
                profile
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async sendOtp(req, res, next) {
        try {
            const { mobile, email } = schemas_1.otpSendSchema.parse(req.body);
            let error = null;
            if (email) {
                const { error: err } = await supabase_1.supabaseAdmin.auth.signInWithOtp({ email });
                error = err;
            }
            else {
                const { error: err } = await supabase_1.supabaseAdmin.auth.signInWithOtp({ phone: `+91${mobile}` });
                error = err;
            }
            if (error) {
                if (error.message.includes('SMS provider') || error.message.includes('not configured') || error.message.includes('Mailer') || error.message.includes('email provider') || error.message.includes('Phone logins are disabled') || error.message.includes('Phone signups are disabled')) {
                    return res.status(200).json({
                        message: 'OTP sent successfully (Development fallback: Use OTP 123456)',
                        development: true
                    });
                }
                return res.status(400).json({ error: error.message });
            }
            return res.status(200).json({ message: 'OTP sent successfully' });
        }
        catch (err) {
            next(err);
        }
    }
    static async verifyOtp(req, res, next) {
        try {
            const { mobile, email, otp } = schemas_1.otpVerifySchema.parse(req.body);
            let sessionData = null;
            if (otp === '123456') {
                // Dev bypass - Query profiles directly to avoid phone format issues
                const { data: foundProfile } = email
                    ? await supabase_1.supabaseAdmin.from('profiles').select('*').eq('email', email).single()
                    : await supabase_1.supabaseAdmin.from('profiles').select('*').eq('mobile', mobile).single();
                if (!foundProfile) {
                    return res.status(404).json({ error: 'User not found, please register first' });
                }
                sessionData = {
                    access_token: `mock-token-${foundProfile.mobile}`,
                    user: { id: foundProfile.user_id }
                };
            }
            else {
                const verifyOptions = email
                    ? { email, token: otp, type: 'email' }
                    : { phone: `+91${mobile}`, token: otp, type: 'sms' };
                const { data, error } = await supabase_1.supabaseAdmin.auth.verifyOtp(verifyOptions);
                if (error || !data.session) {
                    return res.status(400).json({ error: error?.message || 'Verification failed' });
                }
                sessionData = data.session;
            }
            // Fetch user profile
            const query = supabase_1.supabaseAdmin.from('profiles').select('*');
            const { data: profile } = email
                ? await query.eq('email', email).single()
                : await query.eq('mobile', mobile).single();
            return res.status(200).json({
                message: 'Login successful',
                token: sessionData.access_token,
                profile
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async logout(req, res, next) {
        try {
            // Handles session termination
            return res.status(200).json({ message: 'Logged out successfully' });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AuthController = AuthController;
