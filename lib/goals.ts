import { BookService } from './books';
import { supabase } from './supabase';

export interface ReadingGoal {
  id: string;
  user_id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AchievementGoal {
  id: string;
  title: string;
  description: string;
  targetBooks: number;
  progress: number;
  completed: boolean;
}

// Achievement goals configuration
const ACHIEVEMENT_GOALS = [
  {
    title: "Novice Reader",
    description: "Complete 1 book",
    targetBooks: 1,
  },
  {
    title: "Avid Explorer",
    description: "Complete 5 books",
    targetBooks: 5,
  },
  {
    title: "Page Turner",
    description: "Complete 10 books",
    targetBooks: 10,
  },
  {
    title: "Literary Sage",
    description: "Complete 20 books",
    targetBooks: 20,
  },
  {
    title: "Master Bibliophile",
    description: "Complete 25 books",
    targetBooks: 25,
  },
];

export class GoalsService {
  // Initialize achievement goals for a user (create if they don't exist)
  static async initializeAchievementGoals(userId: string): Promise<{ data: ReadingGoal[] | null; error: any }> {
    try {
      // Get current year dates
      const startDate = new Date();
      startDate.setMonth(0, 1); // January 1st
      const endDate = new Date();
      endDate.setMonth(11, 31); // December 31st

      const goals: ReadingGoal[] = [];

      // Check and create each achievement goal
      for (const achievement of ACHIEVEMENT_GOALS) {
        // Check if goal already exists
        const { data: existing } = await supabase
          .from('reading_goals')
          .select('*')
          .eq('user_id', userId)
          .eq('goal_type', 'books_per_year')
          .eq('target_value', achievement.targetBooks)
          .single();

        if (!existing) {
          // Create the goal
          const { data: newGoal, error } = await supabase
            .from('reading_goals')
            .insert({
              user_id: userId,
              goal_type: 'books_per_year',
              target_value: achievement.targetBooks,
              current_value: 0,
              start_date: startDate.toISOString().split('T')[0],
              end_date: endDate.toISOString().split('T')[0],
              is_active: true,
            })
            .select()
            .single();

          if (error) {
            console.error(`Error creating goal ${achievement.title}:`, error);
          } else if (newGoal) {
            goals.push(newGoal);
          }
        } else {
          goals.push(existing);
        }
      }

      return { data: goals, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get achievement goals for a user with current progress
  static async getAchievementGoals(userId: string): Promise<{ data: AchievementGoal[] | null; error: any }> {
    try {
      // Initialize goals if they don't exist
      await this.initializeAchievementGoals(userId);

      // Get user's completed books count
      const { data: stats } = await BookService.getUserReadingStats(userId);
      const completedBooks = stats?.totalBooksRead || 0;

      // Fetch all achievement goals from database
      const { data: goals, error } = await supabase
        .from('reading_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('goal_type', 'books_per_year')
        .in('target_value', ACHIEVEMENT_GOALS.map(g => g.targetBooks))
        .eq('is_active', true)
        .order('target_value', { ascending: true });

      if (error) {
        return { data: null, error };
      }

      // Map database goals to achievement goals with progress
      const achievementGoals: AchievementGoal[] = ACHIEVEMENT_GOALS.map((achievement) => {
        const dbGoal = goals?.find(g => g.target_value === achievement.targetBooks);
        const progress = Math.min((completedBooks / achievement.targetBooks) * 100, 100);
        const completed = completedBooks >= achievement.targetBooks;

        return {
          id: dbGoal?.id || '',
          title: achievement.title,
          description: achievement.description,
          targetBooks: achievement.targetBooks,
          progress: Math.round(progress),
          completed,
        };
      });

      // Update current_value in database for all goals
      for (const goal of goals || []) {
        if (goal.current_value !== completedBooks) {
          await supabase
            .from('reading_goals')
            .update({ current_value: completedBooks })
            .eq('id', goal.id);
        }
      }

      return { data: achievementGoals, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get user's current reading level based on completed books
  static getCurrentReadingLevel(completedBooks: number): string {
    if (completedBooks >= 25) return "Master Bibliophile";
    if (completedBooks >= 20) return "Literary Sage";
    if (completedBooks >= 10) return "Page Turner";
    if (completedBooks >= 5) return "Avid Explorer";
    if (completedBooks >= 1) return "Novice Reader";
    return "Rookie Reader";
  }
}

