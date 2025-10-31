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
}

