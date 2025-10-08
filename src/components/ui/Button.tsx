import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

type Props = TouchableOpacityProps & { title: string; variant?: 'solid' | 'outline' };

export function Button({ title, variant = 'solid', style, ...rest }: Props) {
  const base = 'rounded-md py-3';
  const solid = 'bg-black';
  const outline = 'border border-[#E5E5E5]';
  const text = variant === 'solid' ? 'text-white' : 'text-black';
  return (
    <TouchableOpacity className={`${base} ${variant === 'solid' ? solid : outline}`} style={style} {...rest}>
      <Text className={`text-center font-medium ${text}`}>{title}</Text>
    </TouchableOpacity>
  );
}


