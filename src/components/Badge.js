import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants';

export const Badge = ({ text, variant = 'primary', style }) => {
  const variantStyles = {
    primary: { bg: COLORS.primary + '20', text: COLORS.primary },
    success: { bg: COLORS.success + '20', text: COLORS.success },
    danger: { bg: COLORS.danger + '20', text: COLORS.danger },
    warning: { bg: COLORS.warning + '20', text: COLORS.warning },
    info: { bg: COLORS.info + '20', text: COLORS.info },
  };

  const vs = variantStyles[variant];

  return (
    <View style={[styles.badge, { backgroundColor: vs.bg }, style]}>
      <Text style={[styles.text, { color: vs.text }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
