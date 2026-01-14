import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants';

export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false,
  loading = false,
  style,
  ...props 
}) => {
  const variants = {
    primary: {
      bg: COLORS.primary,
      text: '#FFF',
    },
    secondary: {
      bg: COLORS.surface,
      text: COLORS.primary,
      border: 1,
      borderColor: COLORS.primary,
    },
    ghost: {
      bg: 'transparent',
      text: COLORS.primary,
    },
    danger: {
      bg: COLORS.danger,
      text: '#FFF',
    },
    success: {
      bg: COLORS.success,
      text: '#FFF',
    },
  };

  const variant_style = variants[variant];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: variant_style.bg,
          borderWidth: variant_style.border || 0,
          borderColor: variant_style.borderColor || 'transparent',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant_style.text} />
      ) : (
        <Text style={[styles.text, { color: variant_style.text }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
