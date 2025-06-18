# Authentication Setup Guide

## Supabase Configuration

To enable authentication with email verification, you need to set up Supabase:

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Environment Variables

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Auth Configuration

In your Supabase dashboard:

1. Go to Authentication > Settings
2. Set **Site URL** to: `http://localhost:3000` (for development)
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/verify`
   - `http://localhost:3000/get-quote`
4. Enable **Email confirmations**
5. Customize email templates if desired

### 4. Email Provider (Optional)

For production, configure an email provider:
- Go to Authentication > Settings > SMTP Settings
- Configure your email service (SendGrid, Mailgun, etc.)

## Authentication Flow

1. **User visits `/get-quote`** → Redirected to `/auth/login`
2. **New users** → Click "Sign up" → Go to `/auth/signup`
3. **Sign up form** → Creates account → Shows "Check your email" message
4. **Email verification** → User clicks link → Redirected to `/auth/verify`
5. **Verified users** → Automatically redirected to `/get-quote`

## Features Implemented

- ✅ Email/password authentication
- ✅ Email verification required
- ✅ Password strength validation
- ✅ Protected routes
- ✅ Automatic redirects
- ✅ User state management
- ✅ Sign out functionality
- ✅ Resend verification emails
- ✅ Error handling
- ✅ Loading states

## Testing

1. Start the development server: `npm run dev`
2. Try to access `/get-quote` without being logged in
3. Create a new account and verify the email flow
4. Test sign in/out functionality

## Security Notes

- Email verification is required before accessing the quote form
- Passwords must be at least 8 characters with uppercase, lowercase, and numbers
- User sessions are managed by Supabase
- All authentication state is handled securely 