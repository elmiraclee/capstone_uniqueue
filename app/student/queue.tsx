import { StyleSheet, Text, View } from 'react-native';

import AppHeader from '../../components/layout/app-header';
import { COLORS } from '../../constants/theme';

export default function Queue() {
  return (
    <View style={styles.container}>

      <AppHeader />

      <View style={styles.content}>
        <Text style={styles.title}>
          Queue Status
        </Text>

        <Text style={styles.subtitle}>
          You are currently not in any queue.
        </Text>
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
  },

  subtitle: {
    marginTop: 10,
    color: COLORS.gray,
  },

});