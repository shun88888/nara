import { View, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getAvailableTimeSlots, getTimeSlotsForDate, type TimeSlot } from '../../../src/lib/time-slots';

export default function SelectSlot() {
  const { experienceId } = useLocalSearchParams<{ experienceId: string }>();
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [availabilityMap, setAvailabilityMap] = useState<{ [key: number]: number }>({});
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Fetch available slots for the current month
  useEffect(() => {
    if (!experienceId) return;

    const fetchSlots = async () => {
      setLoading(true);
      const result = await getAvailableTimeSlots(experienceId, selectedYear, selectedMonth);

      if (result.success && result.data) {
        // Create availability map
        const map: { [key: number]: number } = {};
        result.data.forEach((dateAvail) => {
          const day = new Date(dateAvail.date).getDate();
          map[day] = dateAvail.available_slots_count;
        });
        setAvailabilityMap(map);
      }

      setLoading(false);
    };

    fetchSlots();
  }, [experienceId, selectedYear, selectedMonth]);

  // Fetch time slots for selected date
  useEffect(() => {
    if (!experienceId || !selectedDate) {
      setTimeSlots([]);
      return;
    }

    const fetchTimeSlotsForDate = async () => {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
      const result = await getTimeSlotsForDate(experienceId, dateStr);

      if (result.success && result.data) {
        setTimeSlots(result.data);
      } else {
        setTimeSlots([]);
      }
    };

    fetchTimeSlotsForDate();
  }, [experienceId, selectedYear, selectedMonth, selectedDate]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
    const days = [];
    const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

    // Week day headers
    const headers = weekDays.map((day, index) => (
      <View key={`header-${index}`} className="flex-1 items-center py-3">
        <Text className={`text-sm font-medium ${index === 0 ? 'text-[#FF6B6B]' : index === 6 ? 'text-[#4A90E2]' : 'text-[#666]'}`}>
          {day}
        </Text>
      </View>
    ));

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} className="flex-1 aspect-square p-1">
          <View className="flex-1" />
        </View>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const availability = availabilityMap[day] ?? 0;
      const isSelected = selectedDate === day;
      const dayOfWeek = (firstDay + day - 1) % 7;
      const isSunday = dayOfWeek === 0;
      const isSaturday = dayOfWeek === 6;

      days.push(
        <View key={`day-${day}`} className="flex-1 aspect-square p-1">
          <TouchableOpacity
            className={`flex-1 items-center justify-center rounded-lg ${
              isSelected ? 'bg-[#7B68EE]' : availability === 0 ? 'bg-transparent' : 'bg-transparent'
            }`}
            onPress={() => availability > 0 && setSelectedDate(day)}
            disabled={availability === 0}
          >
            <Text
              className={`text-base font-medium ${
                isSelected
                  ? 'text-white'
                  : availability === 0
                  ? 'text-[#CCC]'
                  : isSunday
                  ? 'text-[#FF6B6B]'
                  : isSaturday
                  ? 'text-[#4A90E2]'
                  : 'text-black'
              }`}
            >
              {day}
            </Text>
            {availability > 0 && !isSelected && (
              <Text className="text-[10px] text-[#999] mt-0.5">{availability}枠</Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    // Fill remaining cells to complete the last week
    const totalCells = days.length;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <View key={`empty-end-${i}`} className="flex-1 aspect-square p-1">
          <View className="flex-1" />
        </View>
      );
    }

    // Group into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(
        <View key={`week-${i}`} className="flex-row">
          {days.slice(i, i + 7)}
        </View>
      );
    }

    return (
      <View>
        <View className="flex-row bg-[#F8F8F8]">{headers}</View>
        {weeks}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#E5E5E5]">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black">来店日時指定</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1">
        {/* Month Selector */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-[#E5E5E5]">
          <TouchableOpacity
            onPress={() => {
              if (selectedMonth === 1) {
                setSelectedMonth(12);
                setSelectedYear(selectedYear - 1);
              } else {
                setSelectedMonth(selectedMonth - 1);
              }
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#666" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">
            {selectedYear}年{selectedMonth}月
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (selectedMonth === 12) {
                setSelectedMonth(1);
                setSelectedYear(selectedYear + 1);
              } else {
                setSelectedMonth(selectedMonth + 1);
              }
            }}
          >
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <View className="px-2 py-4">{renderCalendar()}</View>

        {/* Time Slot Selection */}
        <View className="px-4 py-4">
          <Text className="text-base font-bold text-black mb-3">来店時刻</Text>

          {/* Time slots grid (shown when date is selected) */}
          {selectedDate && (
            <View className="flex-row flex-wrap">
              {timeSlots.map((slot, index) => {
                const isSelected = selectedTimeSlot?.id === slot.id;

                return (
                  <TouchableOpacity
                    key={slot.id}
                    className={`mr-3 mb-3 px-4 py-3 rounded-lg border ${
                      isSelected ? 'bg-[#7B68EE] border-[#7B68EE]' : 'bg-white border-[#E5E5E5]'
                    }`}
                    onPress={() => setSelectedTimeSlot(slot)}
                    disabled={slot.remaining_capacity === 0}
                    style={{ minWidth: 100 }}
                  >
                    <Text
                      className={`text-center font-medium ${
                        isSelected ? 'text-white' : slot.remaining_capacity === 0 ? 'text-[#CCC]' : 'text-[#007AFF]'
                      }`}
                    >
                      {slot.start_time.substring(0, 5)}
                    </Text>
                    {slot.remaining_capacity > 0 && (
                      <Text className={`text-center text-xs mt-1 ${
                        isSelected ? 'text-white/80' : 'text-[#999]'
                      }`}>
                        残り{slot.remaining_capacity}枠
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="px-4 py-3 border-t border-[#E5E5E5] flex-row">
        <TouchableOpacity
          className="flex-1 mr-2 py-3 rounded-lg border border-[#E5E5E5]"
          onPress={() => {
            setSelectedDate(null);
            setSelectedTimeSlot(null);
          }}
        >
          <Text className="text-center text-black font-medium">クリア</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 ml-2 py-3 rounded-lg ${
            selectedDate && selectedTimeSlot ? 'bg-[#7B68EE]' : 'bg-[#E5E5E5]'
          }`}
          onPress={() => {
            if (selectedDate && selectedTimeSlot) {
              const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
              const bookingData = JSON.stringify({
                date: dateStr,
                startTime: selectedTimeSlot.start_time,
                endTime: selectedTimeSlot.end_time,
                slotId: selectedTimeSlot.id,
              });
              router.push(`/(user)/booking/confirm?experienceId=${experienceId}&bookingData=${encodeURIComponent(bookingData)}`);
            }
          }}
          disabled={!selectedDate || !selectedTimeSlot}
        >
          <Text className="text-center text-white font-medium">
            完了 ({selectedDate && selectedTimeSlot ? '1件' : '0件'})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading overlay */}
      {loading && (
        <View className="absolute inset-0 bg-black/20 items-center justify-center">
          <ActivityIndicator size="large" color="#7B68EE" />
        </View>
      )}
    </SafeAreaView>
  );
}
