import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function SelectSlot() {
  const { experienceId } = useLocalSearchParams<{ experienceId: string }>();
  const [selectedYear, setSelectedYear] = useState(2022);
  const [selectedMonth, setSelectedMonth] = useState(6);
  const [selectedDate, setSelectedDate] = useState<number | null>(10);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Mock data - 日付ごとの空き枠数
  const availabilityMap: { [key: number]: number } = {
    8: 3,
    9: 5,
    10: 2,
    11: 4,
    13: 1,
    14: 6,
    15: 3,
    16: 0,
    17: 2,
    18: 5,
    20: 4,
    21: 3,
    22: 0,
    23: 2,
    24: 1,
    25: 7,
    27: 3,
    28: 2,
    29: 0,
    30: 4,
  };

  // Mock time slots for selected date
  const timeSlots = [
    { time: '10:00 ~ 12:00', available: 2 },
    { time: '13:00 ~ 15:00', available: 3 },
    { time: '15:30 ~ 17:30', available: 1 },
  ];

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
          <Ionicons name="close" size={28} color="#7B68EE" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black">来店日時指定</Text>
        <View className="w-7" />
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
        <View className="px-4 py-4 bg-[#F8F8F8]">
          <Text className="text-base font-bold text-black mb-3">来店時刻</Text>
          <View className="flex-row items-center bg-white rounded-lg px-4 py-3 border border-[#E5E5E5]">
            <Text className="flex-1 text-base text-[#999]">
              {selectedTimeSlot || '時刻指定なし'}
            </Text>
            <Text className="text-base text-[#999]">〜</Text>
            <Text className="flex-1 text-right text-base text-[#999]">
              {selectedTimeSlot ? '' : '時刻指定なし'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#999" />
          </View>

          {/* Time slots list (shown when date is selected) */}
          {selectedDate && (
            <View className="mt-3">
              {timeSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  className={`bg-white rounded-lg px-4 py-3 mb-2 border ${
                    selectedTimeSlot === slot.time ? 'border-[#7B68EE]' : 'border-[#E5E5E5]'
                  }`}
                  onPress={() => setSelectedTimeSlot(slot.time)}
                  disabled={slot.available === 0}
                >
                  <View className="flex-row items-center justify-between">
                    <Text
                      className={`text-base ${
                        slot.available === 0 ? 'text-[#CCC]' : 'text-black'
                      } font-medium`}
                    >
                      {slot.time}
                    </Text>
                    <Text className={`text-sm ${slot.available === 0 ? 'text-[#CCC]' : 'text-[#666]'}`}>
                      残り{slot.available}枠
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
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
          onPress={() => selectedDate && selectedTimeSlot && router.push('/(user)/booking/confirm')}
          disabled={!selectedDate || !selectedTimeSlot}
        >
          <Text className="text-center text-white font-medium">
            完了 ({selectedDate && selectedTimeSlot ? '1件' : '0件'})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
