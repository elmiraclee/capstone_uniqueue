import { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS } from '../../constants/theme';

interface HeaderProps {
  title?: string;
  onNotificationPress?: () => void;
}

export default function AppHeader({
  title = 'UniQueue',
  onNotificationPress,
}: HeaderProps) {

  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await AsyncStorage.getItem('user');

      if (user) {
        const parsedUser = JSON.parse(user);

        if (parsedUser.first_name) {
          setStudentName(parsedUser.first_name);

        } else if (parsedUser.name) {
          setStudentName(parsedUser.name);

        } else {
          setStudentName(
            parsedUser.full_name ||
            parsedUser.username
          );
        }
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.leftContainer}>

        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />

        <View>
          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.userName}>
            {studentName}
          </Text>
        </View>

      </View>

      <View style={styles.rightContainer}>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNotificationPress}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 15,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    elevation: 4,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
    marginRight: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },

  userName: {
    fontSize: 13,
    color: COLORS.gray,
  },

  rightContainer: {
    flexDirection: 'row',
  },

  iconButton: {
    marginLeft: 15,
  },

});