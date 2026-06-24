import { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import AppHeader from '../../components/layout/app-header';
import { COLORS } from '../../constants/theme';

export default function Profile() {

  const router = useRouter();

  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {

    const user = await AsyncStorage.getItem('user');

    if (user) {
      setStudent(JSON.parse(user));
    }
  };

  const handleLogout = () => {

    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {

            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('role');

            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>

      <AppHeader />

      <View style={styles.content}>

        <Text style={styles.title}>
          Student Profile
        </Text>

        <View style={styles.card}>

          <Text style={styles.label}>
            Full Name
          </Text>

          <Text style={styles.value}>
            {student?.first_name} {student?.last_name}
          </Text>

          <Text style={styles.label}>
            SR-Code
          </Text>

          <Text style={styles.value}>
            {student?.sr_code}
          </Text>

        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>
            Sign Out
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 20,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  label: {
    color: COLORS.gray,
    fontSize: 13,
    marginTop: 10,
  },

  value: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 5,
  },

  logoutButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 14,
    marginTop: 30,
    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

});