import { supabase } from './supabase';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  cover_url?: string;
  page_count?: number;
  published_date?: string;
  genre?: string;
  created_at: string;
  updated_at: string;
}

export interface UserBook {
  id: string;
  user_id: string;
  book_id: string;
  status: 'want_to_read' | 'currently_reading' | 'read';
  progress: number;
  rating?: number;
  review?: string;
  started_at?: string;
  finished_at?: string;
  created_at: string;
  updated_at: string;
  book?: Book;
}

export interface ReadingSession {
  id: string;
  user_id: string;
  book_id: string;
  pages_read: number;
  session_duration: number;
  session_date: string;
  created_at: string;
}

export class BookService {
  // Search for books
  static async searchBooks(query: string): Promise<{ data: Book[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
        .limit(20);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Add a new book to the database
  static async addBook(bookData: Omit<Book, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Book | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert(bookData)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get user's books
  static async getUserBooks(userId: string, status?: string): Promise<{ data: UserBook[] | null; error: any }> {
    try {
      let query = supabase
        .from('user_books')
        .select(`
          *,
          book:books(*)
        `)
        .eq('user_id', userId);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Add book to user's collection
  static async addBookToUser(userId: string, bookId: string, status: 'want_to_read' | 'currently_reading' | 'read' = 'want_to_read'): Promise<{ data: UserBook | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_books')
        .insert({
          user_id: userId,
          book_id: bookId,
          status,
        })
        .select(`
          *,
          book:books(*)
        `)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Update user book status
  static async updateUserBook(userBookId: string, updates: Partial<UserBook>): Promise<{ data: UserBook | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_books')
        .update(updates)
        .eq('id', userBookId)
        .select(`
          *,
          book:books(*)
        `)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Remove book from user's collection
  static async removeBookFromUser(userBookId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('user_books')
        .delete()
        .eq('id', userBookId);

      return { error };
    } catch (error) {
      return { error };
    }
  }

  // Add reading session
  static async addReadingSession(userId: string, bookId: string, pagesRead: number, sessionDuration: number): Promise<{ data: ReadingSession | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('reading_sessions')
        .insert({
          user_id: userId,
          book_id: bookId,
          pages_read: pagesRead,
          session_duration: sessionDuration,
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get user's reading sessions
  static async getUserReadingSessions(userId: string, bookId?: string): Promise<{ data: ReadingSession[] | null; error: any }> {
    try {
      let query = supabase
        .from('reading_sessions')
        .select('*')
        .eq('user_id', userId);

      if (bookId) {
        query = query.eq('book_id', bookId);
      }

      const { data, error } = await query.order('session_date', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get book by ID
  static async getBookById(bookId: string): Promise<{ data: Book | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get user's reading statistics
  static async getUserReadingStats(userId: string): Promise<{ data: any; error: any }> {
    try {
      // Get total books read
      const { data: booksRead, error: booksError } = await supabase
        .from('user_books')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'read');

      if (booksError) throw booksError;

      // Get total pages read
      const { data: pagesRead, error: pagesError } = await supabase
        .from('reading_sessions')
        .select('pages_read')
        .eq('user_id', userId);

      if (pagesError) throw pagesError;

      // Get total reading time
      const { data: readingTime, error: timeError } = await supabase
        .from('reading_sessions')
        .select('session_duration')
        .eq('user_id', userId);

      if (timeError) throw timeError;

      const stats = {
        totalBooksRead: booksRead?.length || 0,
        totalPagesRead: pagesRead?.reduce((sum, session) => sum + session.pages_read, 0) || 0,
        totalReadingTime: readingTime?.reduce((sum, session) => sum + session.session_duration, 0) || 0,
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get currently reading books
  static async getCurrentlyReadingBooks(userId: string): Promise<{ data: UserBook[] | null; error: any }> {
    return this.getUserBooks(userId, 'currently_reading');
  }

  // Get want to read books
  static async getWantToReadBooks(userId: string): Promise<{ data: UserBook[] | null; error: any }> {
    return this.getUserBooks(userId, 'want_to_read');
  }

  // Get read books
  static async getReadBooks(userId: string): Promise<{ data: UserBook[] | null; error: any }> {
    return this.getUserBooks(userId, 'read');
  }
}
