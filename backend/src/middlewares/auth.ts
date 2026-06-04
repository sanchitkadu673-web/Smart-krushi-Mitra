import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role: 'farmer' | 'admin';
  };
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token format' });
  }

  const token = authHeader.split(' ')[1];

  try {
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

export function requireRole(role: 'farmer' | 'admin') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: `Forbidden: Access restricted to ${role}` });
    }

    next();
  };
}
