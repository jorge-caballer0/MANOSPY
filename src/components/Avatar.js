import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants';

export const Avatar = ({ initials = 'U', size = 'md', bgColor = COLORS.primary }) => {
  const sizeMap = {
    sm: SIZES.sm,
    md: SIZES.md,
    lg: SIZES.lg,
    xl: SIZES.xl,
  };

  const dimension = sizeMap[size];
  const fontSize = dimension / 2;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: bgColor,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize }]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
