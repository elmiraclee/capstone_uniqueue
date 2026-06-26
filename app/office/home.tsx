import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppHeader from '../../components/layout/app-header';
import { COLORS } from '../../constants/theme';

export default function Home() {

  return (
    <SafeAreaView style={styles.container}>

      <AppHeader title="Home" />

      <View style={styles.content}>

        <Text style={styles.title}>
          Welcome to UniQueue Office
        </Text>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
  },

});