/**
 * ═══════════════════════════════════════════════════════════════════
 * NAVEGACIÓN MEJORADA - MANOSPY2
 * ═══════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants';

/**
 * Componente de Header personalizado con botón de atrás
 */
export const NavigationHeader = ({ 
  title, 
  navigation, 
  showBack = true,
  rightComponent = null,
  backgroundColor = COLORS.background,
  textColor = COLORS.text,
}) => {
  return (
    <View style={[styles.header, { backgroundColor }]}>
      <View style={styles.headerLeft}>
        {showBack && (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color={textColor} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.headerCenter}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      </View>
      
      <View style={styles.headerRight}>
        {rightComponent}
      </View>
    </View>
  );
};

/**
 * Hook para gestionar navegación con stack
 */
export const useNavigationHelper = (navigation) => {
  return {
    goBack: () => navigation.goBack(),
    navigate: (screen, params) => navigation.navigate(screen, params),
    push: (screen, params) => navigation.push(screen, params),
    popToTop: () => navigation.popToTop(),
  };
};

/**
 * Componente de botón de navegación estándar
 */
export const NavButton = ({
  title,
  onPress,
  icon = null,
  variant = 'primary',
  style = {},
}) => {
  const variantStyles = {
    primary: styles.primaryButton,
    secondary: styles.secondaryButton,
    danger: styles.dangerButton,
  };

  return (
    <TouchableOpacity 
      style={[variantStyles[variant], style]}
      onPress={onPress}
    >
      {icon && <Ionicons name={icon} size={18} color="#fff" style={{ marginRight: SPACING.sm }} />}
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flex: 0.2,
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  backButton: {
    padding: SPACING.sm,
    marginLeft: -SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButton: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
