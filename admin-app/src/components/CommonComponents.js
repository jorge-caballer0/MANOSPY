import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants';

// Card Component
export const Card = ({ children, style, onPress }) => (
  <TouchableOpacity
    style={[styles.card, style]}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    {children}
  </TouchableOpacity>
);

// Badge Component
export const Badge = ({ children, variant = 'default', style }) => (
  <View style={[styles.badge, styles[`badge_${variant}`], style]}>
    <Text style={[styles.badgeText, styles[`badgeText_${variant}`]]}>
      {children}
    </Text>
  </View>
);

// Button Component
export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  loading = false,
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      styles[`button_${variant}`],
      disabled && styles.buttonDisabled,
      style,
    ]}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.7}
  >
    <Text
      style={[
        styles.buttonText,
        styles[`buttonText_${variant}`],
        disabled && styles.buttonTextDisabled,
      ]}
    >
      {loading ? 'Cargando...' : title}
    </Text>
  </TouchableOpacity>
);

// Avatar Component
export const Avatar = ({ initials, size = 40, color = COLORS.primary }) => (
  <View
    style={[
      styles.avatar,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      },
    ]}
  >
    <Text style={[styles.avatarText, { fontSize: size / 2 }]}>
      {initials}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  // Card styles
  card: {
    backgroundColor: COLORS.surface || '#fff',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border || '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Badge styles
  badge: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
  badge_default: {
    backgroundColor: COLORS.background || '#f5f5f5',
  },
  badge_success: {
    backgroundColor: COLORS.success + '20' || '#34C75920',
  },
  badge_warning: {
    backgroundColor: '#FF950020',
  },
  badge_danger: {
    backgroundColor: COLORS.danger + '20' || '#FF3B3020',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeText_default: {
    color: COLORS.text,
  },
  badgeText_success: {
    color: COLORS.success,
  },
  badgeText_warning: {
    color: '#FF9500',
  },
  badgeText_danger: {
    color: COLORS.danger,
  },

  // Button styles
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  button_primary: {
    backgroundColor: COLORS.primary,
  },
  button_secondary: {
    backgroundColor: COLORS.background || '#f5f5f5',
    borderWidth: 1,
    borderColor: COLORS.border || '#e0e0e0',
  },
  button_danger: {
    backgroundColor: COLORS.danger,
  },
  button_success: {
    backgroundColor: COLORS.success,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonText_primary: {
    color: '#fff',
  },
  buttonText_secondary: {
    color: COLORS.text,
  },
  buttonText_danger: {
    color: '#fff',
  },
  buttonText_success: {
    color: '#fff',
  },
  buttonTextDisabled: {
    color: COLORS.textMuted,
  },

  // Avatar styles
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
