import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import AppHeader from '../../components/layout/app-header';
import { COLORS } from '../../constants/theme';

export default function StudentHome() {

  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await AsyncStorage.getItem('user');

      if (user) {
        const parsedUser = JSON.parse(user);

        setStudentName(
          `${parsedUser.first_name} ${parsedUser.last_name}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good Morning';
    }

    if (hour < 18) {
      return 'Good Afternoon';
    }

    return 'Good Evening';
  };

  return (
    <View style={styles.container}>

      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Greeting Card */}
        <View style={styles.greetingCard}>

          <Text style={styles.greeting}>
            {getGreeting()} 👋
          </Text>

          <Text style={styles.studentName}>
            {studentName}
          </Text>

          <Text style={styles.subtitle}>
            Welcome to UniQueue System
          </Text>

        </View>

        {/* Summary */}
        <Text style={styles.sectionTitle}>
          My Transactions
        </Text>

        <View style={styles.summaryContainer}>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              0
            </Text>

            <Text style={styles.summaryLabel}>
              Current Queue
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              0
            </Text>

            <Text style={styles.summaryLabel}>
              Completed
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              0
            </Text>

            <Text style={styles.summaryLabel}>
              Pending Feedback
            </Text>
          </View>

        </View>

        {/* Announcements */}
        <Text style={styles.sectionTitle}>
          Announcements
        </Text>

        <View style={styles.announcementCard}>

          <Text style={styles.announcementTitle}>
            No announcements available.
          </Text>

          <Text style={styles.announcementText}>
            Updates from academic offices will appear here.
          </Text>

        </View>

      </ScrollView>

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

  greetingCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 25,
  },

  greeting: {
    color: COLORS.white,
    fontSize: 18,
  },

  studentName: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '700',
    marginTop: 5,
  },

  subtitle: {
    color: COLORS.white,
    marginTop: 8,
    opacity: 0.9,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 30,
    marginBottom: 15,
  },

  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  summaryCard: {
    backgroundColor: COLORS.white,
    width: '31%',
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  summaryNumber: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
  },

  summaryLabel: {
    marginTop: 8,
    textAlign: 'center',
    color: COLORS.gray,
    fontSize: 12,
  },

  announcementCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  announcementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },

  announcementText: {
    color: COLORS.gray,
    lineHeight: 20,
  },

});