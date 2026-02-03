import { ReadingPlan, ReadingPlanService } from './reading-plans';
import { supabase } from './supabase';

export const BookStatus = {
  WANT_TO_READ: 'want_to_read',
  CURRENTLY_READING: 'currently_reading',
  READ: 'read',
} as const;

export type BookStatusType = typeof BookStatus[keyof typeof BookStatus];

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
  status: BookStatusType;
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

export interface CategorizedBooks {
  wantToRead: UserBook[];
  currentlyReading: UserBook[];
  read: UserBook[];
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
      console.log("Adding book to Supabase:", bookData);
      const { data, error } = await supabase
        .from('books')
        .insert(bookData)
        .select()
        .single();

      if (error) {
        console.error("Supabase error adding book:", error);
        return { data: null, error };
      }

      console.log("Book added successfully:", data);
      return { data, error: null };
    } catch (error) {
      console.error("Exception adding book:", error);
      return { data: null, error };
    }
  }

  // Get user's books
  static async getUserBooks(userId: string, status?: BookStatusType): Promise<{ data: UserBook[] | null; error: any }> {
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
  static async addBookToUser(userId: string, bookId: string, status: BookStatusType = BookStatus.WANT_TO_READ): Promise<{ data: UserBook | null; error: any }> {
    try {
      console.log("Linking book to user:", { userId, bookId, status });
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

      if (error) {
        console.error("Supabase error linking book to user:", error);
        return { data: null, error };
      }

      console.log("Book linked to user successfully:", data);
      return { data, error: null };
    } catch (error) {
      console.error("Exception linking book to user:", error);
      return { data: null, error };
    }
  }

  // Update user book status
  static async updateUserBook(userBookId: string, updates: Partial<UserBook>): Promise<{ data: UserBook | null; error: any }> {
    try {
      // Get the current user book to calculate pages read difference
      const { data: currentBook, error: fetchError } = await supabase
        .from('user_books')
        .select(`
          *,
          book:books(*)
        `)
        .eq('id', userBookId)
        .single();

      if (fetchError || !currentBook) {
        return { data: null, error: fetchError };
      }

      // Update the user book
      const { data, error } = await supabase
        .from('user_books')
        .update(updates)
        .eq('id', userBookId)
        .select(`
          *,
          book:books(*)
        `)
        .single();

      if (error) {
        return { data: null, error };
      }

      // Track reading session if progress changed and increased
      if (updates.progress !== undefined && updates.progress !== null && data) {
        const oldProgress = currentBook.progress || 0;
        const newProgress = updates.progress;
        
        // Only track if progress increased
        if (newProgress > oldProgress && data.book?.page_count) {
          // Calculate pages read: progress is 0-100, so convert to actual pages
          const oldPages = Math.round((oldProgress / 100) * data.book.page_count);
          const newPages = Math.round((newProgress / 100) * data.book.page_count);
          const pagesRead = newPages - oldPages;

          if (pagesRead > 0) {
            // Add reading session for today
            await this.addReadingSession(
              data.user_id,
              data.book_id,
              pagesRead,
              0 // Duration not tracked in this update flow
            );
          }
        }
      }

      return { data, error: null };
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
  static async addReadingSession(userId: string, bookId: string, pagesRead: number, sessionDuration: number = 0, sessionDate?: string): Promise<{ data: ReadingSession | null; error: any }> {
    try {
      // Use provided date or default to today
      const dateToUse = sessionDate || new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('reading_sessions')
        .insert({
          user_id: userId,
          book_id: bookId,
          pages_read: pagesRead,
          session_duration: sessionDuration,
          session_date: dateToUse,
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sync reading sessions with reading plan for today
  // This creates a reading session if the user has read pages according to their plan
  static async syncReadingSessionForToday(userId: string, bookId: string, userBook: UserBook): Promise<{ error: any }> {
    try {
      // Get the reading plan for this book
      const { data: plan } = await ReadingPlanService.getActivePlanForBook(userId, bookId);
      if (!plan) {
        return { error: null }; // No plan, nothing to sync
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];

      // Check if a reading session already exists for today
      const { data: existingSessions } = await supabase
        .from('reading_sessions')
        .select('id, pages_read')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .eq('session_date', todayStr);
      
      const existingSession = existingSessions && existingSessions.length > 0 ? existingSessions[0] : null;

      // Calculate expected pages for today based on plan
      let expectedPagesToday = 0;
      const startDate = userBook.started_at
        ? new Date(userBook.started_at)
        : new Date(plan.created_at);
      startDate.setHours(0, 0, 0, 0);

      if (plan.plan_type === 'everyday' && plan.pages_per_day) {
        // For everyday plans, check if today is after start date
        if (today >= startDate) {
          expectedPagesToday = plan.pages_per_day;
        }
      } else if (plan.plan_type === 'weekly' && plan.weekly_schedule) {
        // For weekly plans, get pages for today's day of week
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const todayName = dayNames[today.getDay()];
        expectedPagesToday = plan.weekly_schedule[todayName] || 0;
      }

      // If we have expected pages and no session exists, or if existing session has fewer pages
      if (expectedPagesToday > 0) {
        if (!existingSession) {
          // Create a new reading session for today
          await this.addReadingSession(userId, bookId, expectedPagesToday, 0, todayStr);
        } else if (existingSession.pages_read < expectedPagesToday) {
          // Update existing session if it has fewer pages than expected
          await supabase
            .from('reading_sessions')
            .update({ pages_read: expectedPagesToday })
            .eq('id', existingSession.id);
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Error syncing reading session:', error);
      return { error };
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

  // Get categorized user books (Correctly handles "finished" based on plan progress and actual pages read)
  static async getCategorizedUserBooks(userId: string): Promise<{ data: CategorizedBooks | null; error: any }> {
    try {
      // 1. Fetch all user books
      const { data: allBooks, error: booksError } = await this.getUserBooks(userId);
      if (booksError || !allBooks) return { data: null, error: booksError };

      // 2. Fetch all reading plans
      const { data: plans, error: plansError } = await ReadingPlanService.getUserReadingPlans(userId);
      if (plansError) console.warn("Error fetching plans for categorization:", plansError);

      const plansMap: Record<string, any> = {};
      if (plans) {
        plans.forEach((plan) => {
          if (!plansMap[plan.book_id]) {
            plansMap[plan.book_id] = plan;
          }
        });
      }

      // 3. Fetch all reading sessions to calculate actual progress
      const { data: sessions, error: sessionsError } = await supabase
        .from('reading_sessions')
        .select('book_id, pages_read')
        .eq('user_id', userId);

      if (sessionsError) console.warn("Error fetching sessions for categorization:", sessionsError);

      const sessionsMap: Record<string, number> = {};
      if (sessions) {
        sessions.forEach((session) => {
          sessionsMap[session.book_id] = (sessionsMap[session.book_id] || 0) + session.pages_read;
        });
      }

      // 4. Categorize
      const categorized: CategorizedBooks = {
        wantToRead: [],
        currentlyReading: [],
        read: [],
      };

      for (const userBook of allBooks) {
        // If explicitly read, it's read
        if (userBook.status === BookStatus.READ) {
          categorized.read.push(userBook);
          continue;
        }

        // If want to read, it's want to read
        if (userBook.status === BookStatus.WANT_TO_READ) {
          categorized.wantToRead.push(userBook);
          continue;
        }

        // If currently reading, check plan progress AND actual pages read
        if (userBook.status === BookStatus.CURRENTLY_READING) {
          const plan = plansMap[userBook.book_id];
          const planProgress = ReadingPlanService.calculatePlanProgress(userBook, plan);

          // Check actual pages read
          const totalPagesRead = sessionsMap[userBook.book_id] || 0;
          const bookPageCount = userBook.book?.page_count || 0;
          const isActuallyFinished = bookPageCount > 0 && totalPagesRead >= bookPageCount;

          if (planProgress >= 100 || isActuallyFinished) {
            // Calculated as finished (either by time or by actual pages read)
            categorized.read.push(userBook);
          } else {
            categorized.currentlyReading.push(userBook);
          }
        }
      }

      return { data: categorized, error: null };
    } catch (error) {
      console.error("Error categorizing books:", error);
      return { data: null, error };
    }
  }

  // Get user's reading statistics
  static async getUserReadingStats(userId: string): Promise<{ data: any; error: any }> {
    try {
      // Get books via categorized method to ensure consistent "Finished" count
      const { data: categorized, error: catError } = await this.getCategorizedUserBooks(userId);
      if (catError) throw catError;

      // Sync reading sessions for currently reading books based on their plans
      // This ensures reading sessions exist for today based on the reading plan
      if (categorized?.currentlyReading) {
        for (const userBook of categorized.currentlyReading) {
          if (userBook.book_id) {
            await this.syncReadingSessionForToday(userId, userBook.book_id, userBook);
          }
        }
      }

      const totalBooksRead = categorized?.read.length || 0;

      // Calculate total pages read from book progress
      // We sum up pages from all books since reading_sessions is not reliably populated
      let totalPagesRead = 0;

      if (categorized) {
        // For read books, assume full book is read (use page_count)
        categorized.read.forEach(ub => {
          totalPagesRead += (ub.book?.page_count || ub.progress || 0);
        });

        // For currently reading, use progress
        categorized.currentlyReading.forEach(ub => {
          totalPagesRead += (ub.progress || 0);
        });

        // For want to read (rarely has progress, but just in case)
        categorized.wantToRead.forEach(ub => {
          totalPagesRead += (ub.progress || 0);
        });
      }

      // Calculate pages read today from reading_sessions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];

      const { data: todaySessions, error: sessionsError } = await supabase
        .from('reading_sessions')
        .select('pages_read')
        .eq('user_id', userId)
        .eq('session_date', todayStr);

      let pagesReadToday = 0;
      if (!sessionsError && todaySessions) {
        pagesReadToday = todaySessions.reduce((sum, session) => sum + (session.pages_read || 0), 0);
      }

      // Calculate total reading time from all sessions
      const { data: allSessions, error: allSessionsError } = await supabase
        .from('reading_sessions')
        .select('session_duration')
        .eq('user_id', userId);

      let totalReadingTime = 0;
      if (!allSessionsError && allSessions) {
        totalReadingTime = allSessions.reduce((sum, session) => sum + (session.session_duration || 0), 0);
      }

      const stats = {
        totalBooksRead,
        totalPagesRead,
        totalReadingTime,
        pagesReadToday,
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error("Error getting reading stats:", error);
      return { data: null, error };
    }
  }

  // Get currently reading books
  static async getCurrentlyReadingBooks(userId: string): Promise<{ data: UserBook[] | null; error: any }> {
    const { data, error } = await this.getCategorizedUserBooks(userId);
    return { data: data?.currentlyReading || null, error };
  }

  // Get want to read books
  static async getWantToReadBooks(userId: string): Promise<{ data: UserBook[] | null; error: any }> {
    const { data, error } = await this.getCategorizedUserBooks(userId);
    return { data: data?.wantToRead || null, error };
  }

  // Get read books
  static async getReadBooks(userId: string): Promise<{ data: UserBook[] | null; error: any }> {
    const { data, error } = await this.getCategorizedUserBooks(userId);
    return { data: data?.read || null, error };
  }
}
