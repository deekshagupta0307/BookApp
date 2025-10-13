import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
// You'll get these from your Supabase dashboard
const supabaseUrl = 'https://zantaojwzfcjmmqvjywx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphbnRhb2p3emZjam1tcXZqeXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MTc2NTQsImV4cCI6MjA3NTQ5MzY1NH0.t0Q0jg_Sy8LOvBrKcTOWBSyjFxO-93oTlagoqaQKL_8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable automatic session refresh
    autoRefreshToken: true,
    // Persist session in AsyncStorage
    persistSession: true,
    // Detect session from URL (for OAuth flows)
    detectSessionInUrl: false,
  },
});

// Database types (you'll generate these later with Supabase CLI)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      books: {
        Row: {
          id: string;
          title: string;
          author: string;
          isbn?: string;
          cover_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          author: string;
          isbn?: string;
          cover_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          author?: string;
          isbn?: string;
          cover_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_books: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          status: 'want_to_read' | 'currently_reading' | 'read';
          progress: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          status: 'want_to_read' | 'currently_reading' | 'read';
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
          status?: 'want_to_read' | 'currently_reading' | 'read';
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
