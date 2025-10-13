# Supabase Setup Guide for BookApp

This guide will help you set up Supabase for your BookApp backend.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `bookapp` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

## 3. Configure Your App

1. Open `lib/supabase.ts` in your project
2. Replace the placeholder values:

```typescript
const supabaseUrl = "YOUR_SUPABASE_URL"; // Replace with your Project URL
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY"; // Replace with your anon key
```

## 4. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database/schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

This will create:

- `users` table (extends auth.users)
- `books` table
- `user_books` table (junction table)
- `reading_sessions` table
- `user_friends` table
- `reading_goals` table
- All necessary indexes and Row Level Security policies

## 5. Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:

### Site URL

- Set to your app's URL (for development: `exp://localhost:8081` or your Expo dev server URL)

### Redirect URLs

- Add your app's redirect URLs
- For development: `exp://localhost:8081`

### Email Templates (Optional)

- Customize the email templates for signup confirmation, password reset, etc.

## 6. Test Your Setup

1. Start your Expo development server:

   ```bash
   npm start
   ```

2. Try signing up with a new account
3. Check your Supabase dashboard → **Authentication** → **Users** to see if the user was created
4. Check **Table Editor** → **users** to see if the user profile was created

## 7. Environment Variables (Recommended for Production)

For production, you should use environment variables instead of hardcoding the keys:

1. Create a `.env` file in your project root:

   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Update `lib/supabase.ts`:

   ```typescript
   const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
   const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
   ```

3. Add `.env` to your `.gitignore` file

## 8. Database Features

Your database now includes:

### User Management

- User profiles with first name, last name, email
- Automatic profile creation on signup
- Row Level Security (users can only access their own data)

### Book Management

- Books table with title, author, ISBN, description, cover URL
- User books junction table for personal collections
- Reading status tracking (want to read, currently reading, read)
- Progress tracking (0-100%)
- Rating and review system

### Reading Analytics

- Reading sessions tracking
- Reading goals (books per year, pages per day, etc.)
- Progress tracking over time

### Social Features

- Friend system for "My Pals" feature
- Friend request management

## 9. Next Steps

1. **Initialize Auth**: Add auth initialization to your app's root component
2. **Add Book Management**: Create services for adding/removing books
3. **Implement Reading Tracking**: Add reading session tracking
4. **Social Features**: Implement friend system
5. **Analytics**: Add reading goals and progress tracking

## 10. Useful Supabase Features

- **Real-time subscriptions**: Listen to database changes in real-time
- **Storage**: Store book covers and user avatars
- **Edge Functions**: Serverless functions for complex operations
- **Database backups**: Automatic daily backups
- **API documentation**: Auto-generated API docs

## Troubleshooting

### Common Issues

1. **"Invalid API key"**: Check that you copied the correct anon key
2. **"Invalid URL"**: Ensure your Supabase URL is correct
3. **RLS errors**: Make sure you're authenticated when accessing protected data
4. **Email not sending**: Check your email settings in Supabase dashboard

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)
