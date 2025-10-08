// Supabase Database Types
// These types match the schema defined in migrations

export type UserRole = 'user' | 'provider';
export type BookingStatus = 'pending' | 'confirmed' | 'canceled' | 'checked_in' | 'completed';
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: UserRole;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      providers: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          description: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          website_url: string | null;
          logo_url: string | null;
          stripe_account_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name: string;
          description?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          website_url?: string | null;
          logo_url?: string | null;
          stripe_account_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          business_name?: string;
          description?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          website_url?: string | null;
          logo_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      experiences: {
        Row: {
          id: string;
          provider_id: string;
          title: string;
          description: string;
          target_age: string;
          duration_min: number;
          price_yen: number;
          photos: string[];
          category: string | null;
          max_participants: number | null;
          location_address: string | null;
          location_lat: number | null;
          location_lng: number | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          title: string;
          description: string;
          target_age: string;
          duration_min: number;
          price_yen: number;
          photos?: string[];
          category?: string | null;
          max_participants?: number | null;
          location_address?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          target_age?: string;
          duration_min?: number;
          price_yen?: number;
          photos?: string[];
          category?: string | null;
          max_participants?: number | null;
          location_address?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          is_published?: boolean;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          experience_id: string;
          child_name: string;
          child_age: number;
          guardian_name: string;
          guardian_phone: string;
          start_at: string;
          end_at: string | null;
          status: BookingStatus;
          payment_method: string | null;
          payment_status: PaymentStatus;
          stripe_payment_intent_id: string | null;
          amount_yen: number;
          qr_token: string;
          qr_expires_at: string | null;
          notes: string | null;
          coupon_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          experience_id: string;
          child_name: string;
          child_age: number;
          guardian_name: string;
          guardian_phone: string;
          start_at: string;
          end_at?: string | null;
          status?: BookingStatus;
          payment_method?: string | null;
          payment_status?: PaymentStatus;
          stripe_payment_intent_id?: string | null;
          amount_yen: number;
          qr_token: string;
          qr_expires_at?: string | null;
          notes?: string | null;
          coupon_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: BookingStatus;
          payment_status?: PaymentStatus;
          qr_token?: string;
          qr_expires_at?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      booking_status: BookingStatus;
      payment_status: PaymentStatus;
    };
  };
}

// Helper types for joining tables
export type ExperienceWithProvider = Database['public']['Tables']['experiences']['Row'] & {
  provider: Database['public']['Tables']['providers']['Row'];
};

export type BookingWithDetails = Database['public']['Tables']['bookings']['Row'] & {
  experience: ExperienceWithProvider;
  user: Database['public']['Tables']['users']['Row'];
};
