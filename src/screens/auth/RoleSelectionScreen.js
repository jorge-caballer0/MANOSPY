import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context';
import { COLORS, SPACING, RADIUS } from '../../constants';

export const RoleSelectionScreen = ({ navigation }) => {
  const { selectRole } = useAuth();

  const handleRoleSelect = (role) => {
    selectRole(role);
    navigation.navigate(role === 'client' ? 'ClientLogin' : 'ProfessionalOnboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>ManosPy</Text>
          <Text style={styles.subtitle}>¿Quién eres?</Text>
        </View>

        <View style={styles.rolesContainer}>
          <TouchableOpacity
            style={[styles.roleCard, { borderColor: COLORS.primary }]}
            onPress={() => handleRoleSelect('client')}
          >
            <View style={[styles.roleIcon, { backgroundColor: COLORS.primary + '10' }]}>
              <Ionicons name="person" size={48} color={COLORS.primary} />
            </View>
            <Text style={styles.roleTitle}>Cliente</Text>
            <Text style={styles.roleDesc}>Busca y contrata servicios</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleCard, { borderColor: COLORS.success }]}
            onPress={() => handleRoleSelect('professional')}
          >
            <View style={[styles.roleIcon, { backgroundColor: COLORS.success + '10' }]}>
              <Ionicons name="briefcase" size={48} color={COLORS.success} />
            </View>
            <Text style={styles.roleTitle}>Profesional</Text>
            <Text style={styles.roleDesc}>Ofrece tus servicios</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.text,
  },
  rolesContainer: {
    gap: SPACING.lg,
  },
  roleCard: {
    borderWidth: 2,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  roleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  roleDesc: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
