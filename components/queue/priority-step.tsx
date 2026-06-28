import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '../../constants/theme';

interface Props {
  priority: boolean;
  setPriority: (value: boolean) => void;
  priorityReason: string;
  setPriorityReason: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PriorityStep({
  priority,
  setPriority,
  priorityReason,
  setPriorityReason,
  onNext,
  onBack,
}: Props) {
  const next = () => {
    if (priority && !priorityReason.trim()) {
      Alert.alert('Required', 'Please enter a reason.');
      return;
    }
    onNext();
  };

  return (
    <View>
      <Text style={styles.title}>
        Priority lane
      </Text>

      <TouchableOpacity
        style={[
          styles.card,
          priority && styles.selected,
        ]}
        onPress={() => setPriority(!priority)}
      >
        <View style={styles.radioRow}>
          <View
            style={[
              styles.radio,
              priority && styles.radioActive,
            ]}
          >
            {priority && (
              <View style={styles.radioDot} />
            )}
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardText}>
              Apply for priority lane
            </Text>
            <Text style={styles.cardSub}>
              For PWD, senior citizens, and pregnant
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.card,
          !priority && styles.selected,
        ]}
        onPress={() => setPriority(false)}
      >
        <View style={styles.radioRow}>
          <View
            style={[
              styles.radio,
              !priority && styles.radioActive,
            ]}
          >
            {!priority && (
              <View style={styles.radioDot} />
            )}
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardText}>
              Regular lane
            </Text>
            <Text style={styles.cardSub}>
              Standard queue placement
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {priority && (
        <TextInput
          style={styles.input}
          placeholder="Enter reason for priority"
          placeholderTextColor={COLORS.gray}
          value={priorityReason}
          onChangeText={setPriorityReason}
          multiline
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={next}
      >
        <Text style={styles.buttonText}>
          Continue
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
      >
        <Text style={styles.backButtonText}>
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: COLORS.primary,
  },

  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#eee',
  },

  selected: {
    borderColor: COLORS.primary,
    backgroundColor: '#fdf5f5',
  },

  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },

  radioDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#fff',
  },

  cardContent: {
    flex: 1,
  },

  cardText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.secondary,
  },

  cardSub: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },

  input: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    backgroundColor: COLORS.white,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  button: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
  },

  backButton: {
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ddd',
  },

  backButtonText: {
    color: COLORS.gray,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 14,
  },
});