import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { COLORS } from '../../constants/theme';

interface CustomInputProps
  extends TextInputProps {}

export default function CustomInput({
  ...props
}: CustomInputProps) {

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor={COLORS.gray}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    marginBottom: 14,
  },

  input: {
    backgroundColor: COLORS.white,

    borderWidth: 1,
    borderColor: '#E5E5E5',

    paddingVertical: 12,
    paddingHorizontal: 18,

    borderRadius: 14,

    fontSize: 15,
    color: COLORS.text,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },

});