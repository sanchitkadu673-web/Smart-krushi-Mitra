import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role: 'farmer' | 'admin' | 'super_admin' | 'shop_owner' | 'expert';
  };
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Handle dev/mock tokens (issued when Supabase phone auth is disabled)
    if (token.startsWith('dev-token-') || token.startsWith('mock-token-')) {
      let profile: any = null;

      if (token.startsWith('dev-token-')) {
        const userId = token.replace('dev-token-', '');
        const { data } = await supabaseAdmin
          .from('profiles')
          .select('user_id, role')
          .eq('user_id', userId)
          .single();
        profile = data;
      } else {
        // mock-token-{mobile}
        const mobile = token.replace('mock-token-', '');
        const { data } = await supabaseAdmin
          .from('profiles')
          .select('user_id, role')
          .eq('mobile', mobile)
          .single();
        profile = data;
      }

      if (!profile) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      req.user = {
        id: profile.user_id,
        role: profile.role
      };

      return next();
    }

    // Verify session token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Retrieve local user profile to check roles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({ error: 'Profile not found or registered' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: profile.role
    };

    next();
  } catch (err) {
    return res.status(500).json({ error: 'Internal Authentication Error' });
  }
}

export function requireRole(roles: string | string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: Access restricted to ${allowedRoles.join(', ')}` });
    }

    next();
  };
}
