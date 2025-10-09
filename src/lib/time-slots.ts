import { supabase } from './supabase';

export interface TimeSlot {
  id: string;
  experience_id: string;
  date: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  current_bookings: number;
  remaining_capacity: number;
  is_available: boolean;
}

export interface DateAvailability {
  date: string;
  available_slots_count: number;
  slots: TimeSlot[];
}

/**
 * Get available time slots for a specific experience and month
 */
export async function getAvailableTimeSlots(
  experienceId: string,
  year: number,
  month: number
): Promise<{ success: boolean; data?: DateAvailability[]; error?: string }> {
  try {
    // Calculate date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const { data, error } = await supabase
      .from('available_time_slots')
      .select('*')
      .eq('experience_id', experienceId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date')
      .order('start_time');

    if (error) {
      console.error('Error fetching time slots:', error);
      return { success: false, error: error.message };
    }

    // Group slots by date
    const slotsByDate = new Map<string, TimeSlot[]>();

    (data || []).forEach((slot) => {
      const dateKey = slot.date;
      if (!slotsByDate.has(dateKey)) {
        slotsByDate.set(dateKey, []);
      }
      slotsByDate.get(dateKey)!.push({
        id: slot.id,
        experience_id: slot.experience_id,
        date: slot.date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        max_capacity: slot.max_capacity,
        current_bookings: slot.current_bookings,
        remaining_capacity: slot.remaining_capacity,
        is_available: slot.is_available,
      });
    });

    // Convert to array with availability count
    const dateAvailability: DateAvailability[] = Array.from(slotsByDate.entries()).map(
      ([date, slots]) => ({
        date,
        available_slots_count: slots.length,
        slots,
      })
    );

    return { success: true, data: dateAvailability };
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get time slots for a specific date
 */
export async function getTimeSlotsForDate(
  experienceId: string,
  date: string
): Promise<{ success: boolean; data?: TimeSlot[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('available_time_slots')
      .select('*')
      .eq('experience_id', experienceId)
      .eq('date', date)
      .order('start_time');

    if (error) {
      console.error('Error fetching time slots for date:', error);
      return { success: false, error: error.message };
    }

    const slots: TimeSlot[] = (data || []).map((slot) => ({
      id: slot.id,
      experience_id: slot.experience_id,
      date: slot.date,
      start_time: slot.start_time,
      end_time: slot.end_time,
      max_capacity: slot.max_capacity,
      current_bookings: slot.current_bookings,
      remaining_capacity: slot.remaining_capacity,
      is_available: slot.is_available,
    }));

    return { success: true, data: slots };
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if a time slot is available for booking
 */
export async function isTimeSlotAvailable(
  experienceId: string,
  date: string,
  startTime: string
): Promise<{ available: boolean; remaining?: number }> {
  try {
    const { data, error } = await supabase
      .from('available_time_slots')
      .select('remaining_capacity')
      .eq('experience_id', experienceId)
      .eq('date', date)
      .eq('start_time', startTime)
      .single();

    if (error || !data) {
      return { available: false };
    }

    return {
      available: data.remaining_capacity > 0,
      remaining: data.remaining_capacity,
    };
  } catch (error) {
    console.error('Error checking slot availability:', error);
    return { available: false };
  }
}
