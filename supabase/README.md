# Supabase Backend Setup Guide

This guide explains how to set up the Supabase backend for the KIKKAKE (きっかけ) app.

## Prerequisites

1. **Supabase CLI**
   ```bash
   brew install supabase/tap/supabase
   # Or using npm
   npm install -g supabase
   ```

2. **Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

## Initial Setup

### 1. Link to Your Supabase Project

```bash
cd /Users/nakagawashunsuke/dev/nara
supabase link --project-ref YOUR_PROJECT_REF
```

### 2. Push Migrations to Supabase

```bash
supabase db push
```

This will create all tables, RLS policies, and triggers defined in the migration files.

### 3. Update Environment Variables

Update `/Users/nakagawashunsuke/dev/nara/.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Database Schema

### Tables

1. **users** - Extends Supabase Auth users
   - Automatically created via trigger when auth user signs up
   - Stores user role ('user' | 'provider')

2. **profiles** - User profile information
   - full_name, phone, avatar_url
   - One-to-one with users table

3. **providers** - Provider/business information
   - Business details, contact info
   - Links to user with role='provider'

4. **experiences** - Activities/experiences offered by providers
   - Title, description, pricing, photos
   - Published/unpublished status

5. **bookings** - User reservations
   - Participant information
   - Payment details
   - QR code for check-in

### Row Level Security (RLS)

All tables have RLS enabled:

- Users can only view/edit their own data
- Providers can only manage their own experiences and bookings
- Published experiences are viewable by everyone
- Bookings are private to the user and the experience provider

## Seed Data

### Update Provider User IDs

Before running seed data, you need to create provider accounts and update the UUIDs in `migrations/20250101000004_seed_data.sql`:

1. **Create Provider Accounts in Supabase Auth Dashboard**
   - Go to Authentication > Users
   - Add 10 new users (one for each provider)
   - Note down their User IDs

2. **Update Migration File**
   Replace the placeholder UUIDs in the seed data file:
   ```sql
   -- Replace these with actual auth.users IDs
   'bbbbbbbb-bbbb-bbbb-bbbb-000000000001'::uuid
   'bbbbbbbb-bbbb-bbbb-bbbb-000000000002'::uuid
   -- etc...
   ```

3. **Re-push Migrations**
   ```bash
   supabase db reset
   ```

## Edge Functions

### Deploy Edge Functions

```bash
# Deploy confirm-booking function
supabase functions deploy confirm-booking

# Deploy verify-qr function
supabase functions deploy verify-qr
```

### Set Environment Secrets

```bash
supabase secrets set QR_SECRET=your-secret-key-here
```

Generate a secure secret key:
```bash
openssl rand -base64 32
```

## Local Development

### Start Supabase Locally

```bash
supabase start
```

This starts:
- PostgreSQL database
- Studio (GUI at http://localhost:54323)
- API Gateway
- Edge Functions runtime

### Stop Supabase

```bash
supabase stop
```

## Testing

### Create Test User

1. Go to Supabase Dashboard > Authentication > Users
2. Add User
3. Email: test@example.com
4. Password: testpassword123
5. Confirm email manually if needed

### Test API Calls

```typescript
// In React Native app
import { useExperienceStore } from './src/stores/experience';

const ExampleComponent = () => {
  const { fetchExperiences, experiences } = useExperienceStore();

  useEffect(() => {
    fetchExperiences();
  }, []);

  return (
    <View>
      {experiences.map(exp => (
        <Text key={exp.id}>{exp.title}</Text>
      ))}
    </View>
  );
};
```

## Common Issues

### Issue: "relation does not exist"

**Solution:** Make sure migrations are pushed
```bash
supabase db push
```

### Issue: "permission denied for table"

**Solution:** Check RLS policies. May need to disable RLS temporarily for testing
```sql
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

### Issue: Edge Functions not working

**Solution:**
1. Check function logs: `supabase functions logs confirm-booking`
2. Verify secrets are set: `supabase secrets list`
3. Redeploy: `supabase functions deploy confirm-booking`

## Production Deployment

1. **Create Production Project** on Supabase
2. **Push Migrations** to production
3. **Deploy Edge Functions** to production
4. **Update Environment Variables** in your app
5. **Test thoroughly** before releasing

## API Reference

### Experience Store

```typescript
const {
  experiences,          // Array of experiences
  loading,             // Boolean
  error,               // String | null
  fetchExperiences,    // (params?) => Promise<void>
  getExperienceById,   // (id: string) => Promise<Experience | null>
} = useExperienceStore();
```

### Booking Store

```typescript
const {
  upcoming,            // Booking[]
  past,                // Booking[]
  confirmBooking,      // (params) => Promise<Booking>
  fetchBookings,       // (userId) => Promise<void>
  cancelBooking,       // (id) => Promise<void>
  refreshQrToken,      // (id) => Promise<void>
} = useBookingStore();
```

### Auth Store

```typescript
const {
  session,             // { userId, email } | null
  profile,             // Profile | null
  signin,              // (email, password) => Promise<void>
  signout,             // () => Promise<void>
  loadProfile,         // (userId) => Promise<void>
  updateProfile,       // (userId, updates) => Promise<void>
} = useAuthStore();
```

## Next Steps

1. **Implement Stripe Payment Integration**
   - Add Stripe SDK
   - Create payment intent Edge Function
   - Update booking flow

2. **Add Real-time Features**
   - Subscribe to booking updates
   - Live availability tracking

3. **Implement Push Notifications**
   - Booking confirmations
   - Reminders

4. **Add Search & Filters**
   - Full-text search on experiences
   - Advanced filtering

## Support

For issues or questions:
- Check Supabase Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
