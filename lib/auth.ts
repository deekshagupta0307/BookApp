import { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export class AuthService {
  // Sign up with email and password
  static async signUp({ email, password, firstName, lastName }: SignUpData): Promise<AuthResponse> {
    try {
      console.log(`Signing up with email: ${email}`);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        return { user: null, session: null, error };
      }

      // Profile creation is handled by a DB trigger; no client insert needed

      return { user: data.user, session: data.session, error: null };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  // Sign in with email and password
  static async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { user: data.user, session: data.session, error };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  // Sign out
  static async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  // Get current session
  static async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Reset password
  static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const redirectTo =
        (process.env.EXPO_PUBLIC_RESET_REDIRECT_URL as string | undefined) ??
        'bookapp://reset-password';
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  // Update password
  static async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      console.log(`Updating password to: ${newPassword}`);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  // Update user data
  static async updateUser(attributes: any): Promise<{ data: any; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.updateUser(attributes);
      return { data, error };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }

  // Sign in with Google OAuth - returns URL to open in browser
  static async signInWithGoogle(): Promise<{ error: AuthError | null; url?: string }> {
    try {
      const redirectTo = `${process.env.EXPO_PUBLIC_APP_SCHEME || 'bookapp'}://auth/callback`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      return { error, url: data?.url || undefined };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  // Sign in with Apple OAuth - returns URL to open in browser
  static async signInWithApple(): Promise<{ error: AuthError | null; url?: string }> {
    try {
      const redirectTo = `${process.env.EXPO_PUBLIC_APP_SCHEME || 'bookapp'}://auth/callback`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      return { error, url: data?.url || undefined };
    } catch (error) {
      return { error: error as AuthError };
    }
  }
}
