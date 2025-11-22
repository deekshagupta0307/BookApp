import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { AuthService } from "../../lib/auth";

interface UserState {
  user: User | null;
  session: Session | null;
  firstName: string;
  lastName: string;
  email: string;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setUserData: (firstName: string, lastName: string, email: string) => void;
  setLoading: (loading: boolean) => void;
  
  // Auth methods
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string; url?: string }>;
  signInWithApple: () => Promise<{ success: boolean; error?: string; url?: string }>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

 export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  session: null,
  firstName: "",
  lastName: "",
  email: "",
  isLoading: false,
  isAuthenticated: false,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    email: user?.email || "",
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
  }),

  setSession: (session) => set({ session }),

  setUserData: (firstName, lastName, email) => set({ firstName, lastName, email }),

  setLoading: (isLoading) => set({ isLoading }),

  signUp: async (email, password, firstName, lastName) => {
    set({ isLoading: true });
    
    try {
      const { user, session, error } = await AuthService.signUp({
        email,
        password,
        firstName,
        lastName,
      });

      if (error) {
        set({ isLoading: false });
        return { success: false, error: error.message };
      }

      set({ 
        user, 
        session, 
        isAuthenticated: !!user,
        firstName,
        lastName,
        email,
        isLoading: false 
      });

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      };
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true });
    
    try {
      const { user, session, error } = await AuthService.signIn({ email, password });

      if (error) {
        set({ isLoading: false });
        return { success: false, error: error.message };
      }

      set({ 
        user, 
        session, 
        isAuthenticated: !!user,
        email: user?.email || "",
        firstName: user?.user_metadata?.first_name || "",
        lastName: user?.user_metadata?.last_name || "",
        isLoading: false 
      });

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      };
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true });
    
    try {
      const { error, url } = await AuthService.signInWithGoogle();
      
      if (error) {
        set({ isLoading: false });
        return { success: false, error: error.message, url };
      }

      set({ isLoading: false });
      return { success: true, url };
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      };
    }
  },

  signInWithApple: async () => {
    set({ isLoading: true });
    
    try {
      const { error, url } = await AuthService.signInWithApple();
      
      if (error) {
        set({ isLoading: false });
        return { success: false, error: error.message, url };
      }

      set({ isLoading: false });
      return { success: true, url };
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      };
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    
    try {
      await AuthService.signOut();
      set({ 
        user: null, 
        session: null, 
        isAuthenticated: false,
        firstName: "",
        lastName: "",
        email: "",
        isLoading: false 
      });
    } catch (error) {
      console.error("Error signing out:", error);
      set({ isLoading: false });
    }
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    
    try {
      const session = await AuthService.getCurrentSession();
      const user = await AuthService.getCurrentUser();
      
      set({ 
        user, 
        session, 
        isAuthenticated: !!user,
        email: user?.email || "",
        firstName: user?.user_metadata?.first_name || "",
        lastName: user?.user_metadata?.last_name || "",
        isLoading: false 
      });

      // Listen for auth state changes
      AuthService.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          set({ 
            user: null, 
            session: null, 
            isAuthenticated: false,
            firstName: "",
            lastName: "",
            email: "",
          });
        } else if (event === 'SIGNED_IN' && session) {
          set({ 
            user: session.user, 
            session, 
            isAuthenticated: true,
            email: session.user.email || "",
            firstName: session.user.user_metadata?.first_name || "",
            lastName: session.user.user_metadata?.last_name || "",
          });
        }
      });
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ isLoading: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true });
    
    try {
      const { error } = await AuthService.resetPassword(email);

      if (error) {
        set({ isLoading: false });
        return { success: false, error: error.message };
      }

      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      };
    }
  },

  updatePassword: async (newPassword) => {
    set({ isLoading: true });
    
    try {
      const { error } = await AuthService.updatePassword(newPassword);

      if (error) {
        set({ isLoading: false });
        return { success: false, error: error.message };
      }

      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      };
    }
  },
}));