import { View, ViewProps } from 'react-native';

export function Card({ style, ...rest }: ViewProps) {
  return <View className="border border-[#E5E5E5] rounded-lg p-4 bg-white" style={style} {...rest} />;
}


