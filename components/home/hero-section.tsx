// components/home/HeroSection.tsx

import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../ui/custom-button';
import { useRouter } from 'expo-router';

import { COLORS } from '../../constants/theme';

export default function HeroSection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        UniQueue
      </Text>

      <Text style={styles.subtitle}>
        Smart Academic Queue Management System
      </Text>

      <Text style={styles.description}>
        Skip long lines and monitor academic office queues anytime, anywhere.
      </Text>

      <View style={styles.buttons}>
        <CustomButton
          title="Log In"
          onPress={() => router.push('/login')}
        />

        <CustomButton
          title="Sign Up"
          outlined
          onPress={() => router.push('/signup')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    alignItems: 'center',
  },

  title: {
    fontSize: 38,
    fontWeight: '700',
    color: COLORS.primary,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.secondary,
  },

  description: {
    marginTop: 15,
    textAlign: 'center',
    color: COLORS.gray,
    lineHeight: 24,
  },

  buttons: {
    width: '100%',
    marginTop: 30,
    gap: 15,
  },
});