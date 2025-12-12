import type { UserBook } from './books';
import { supabase } from './supabase';

export interface ReadingPlan {
  id: string;
  user_id: string;
  book_id: string;
  plan_type: 'everyday' | 'weekly';
  pages_per_day?: number; // For everyday plans
  weekly_schedule?: Record<string, number>; // For weekly plans: {"Mon": 5, "Tue": 10, ...}
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class ReadingPlanService {
  // Create a reading plan
  static async createReadingPlan(
    userId: string,
    bookId: string,
    planType: 'everyday' | 'weekly',
    pagesPerDay?: number,
    weeklySchedule?: Record<string, number>
  ): Promise<{ data: ReadingPlan | null; error: any }> {
    try {
      const planData: any = {
        user_id: userId,
        book_id: bookId,
        plan_type: planType,
        is_active: true,
      };

      if (planType === 'everyday' && pagesPerDay !== undefined) {
        planData.pages_per_day = pagesPerDay;
      }

      if (planType === 'weekly' && weeklySchedule) {
        planData.weekly_schedule = weeklySchedule;
      }

      const { data, error } = await supabase
        .from('reading_plans')
        .insert(planData)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get reading plans for a user
  static async getUserReadingPlans(
    userId: string,
    bookId?: string,
    planType?: 'everyday' | 'weekly'
  ): Promise<{ data: ReadingPlan[] | null; error: any }> {
    try {
      let query = supabase
        .from('reading_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (bookId) {
        query = query.eq('book_id', bookId);
      }

      if (planType) {
        query = query.eq('plan_type', planType);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get reading plan by ID
  static async getReadingPlanById(planId: string): Promise<{ data: ReadingPlan | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('reading_plans')
        .select('*')
        .eq('id', planId)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Update a reading plan
  static async updateReadingPlan(
    planId: string,
    updates: Partial<ReadingPlan>
  ): Promise<{ data: ReadingPlan | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('reading_plans')
        .update(updates)
        .eq('id', planId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Deactivate a reading plan (soft delete)
  static async deactivateReadingPlan(planId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('reading_plans')
        .update({ is_active: false })
        .eq('id', planId);

      return { error };
    } catch (error) {
      return { error };
    }
  }

  // Delete a reading plan (hard delete)
  static async deleteReadingPlan(planId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('reading_plans')
        .delete()
        .eq('id', planId);

      return { error };
    } catch (error) {
      return { error };
    }
  }

  // Get active reading plan for a book
  static async getActivePlanForBook(
    userId: string,
    bookId: string
  ): Promise<{ data: ReadingPlan | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('reading_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
  // Calculate progress based on pages supposed to be read by today and past days
  static calculatePlanProgress(userBook: UserBook, readingPlan: ReadingPlan | null | undefined): number {
    const book = userBook.book;

    // If no plan or book data, return current progress or 0
    if (!readingPlan || !book) {
      return userBook.progress || 0;
    }

    const totalPages = book.page_count || 0;
    if (totalPages === 0) return 0;

    // Calculate total pages supposed to be read by today (including today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let totalPagesSupposedToRead = 0;
    const startDate = userBook.started_at
      ? new Date(userBook.started_at)
      : new Date(readingPlan.created_at);
    startDate.setHours(0, 0, 0, 0);

    if (readingPlan.plan_type === "everyday" && readingPlan.pages_per_day) {
      // For everyday plan: count all days from start to today (inclusive)
      const daysDiff = Math.max(
        0,
        Math.floor(
          (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      );
      totalPagesSupposedToRead = daysDiff * readingPlan.pages_per_day;
    } else if (
      readingPlan.plan_type === "weekly" &&
      readingPlan.weekly_schedule
    ) {
      // For weekly plan: count only scheduled days from start to today
      const schedule = readingPlan.weekly_schedule;
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      let currentDate = new Date(startDate);
      // Clone today to avoid modification loop issues if any, comparison is safe
      const compareToday = new Date(today);

      while (currentDate <= compareToday) {
        const dayName = dayNames[currentDate.getDay()];
        const pagesForDay = schedule[dayName] || 0;
        totalPagesSupposedToRead += pagesForDay;
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Progress percentage is based on pages supposed to be read by today (including today)
    // This shows how much of the book should have been read according to the plan
    const progressPercentage = Math.min(
      100,
      (totalPagesSupposedToRead / totalPages) * 100
    );

    // Return percentage (0-100)
    return Math.round(progressPercentage);
  }
}
