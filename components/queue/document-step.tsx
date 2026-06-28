import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '../../constants/theme';

interface DocumentItem {
  id: number;
  name: string;
  requirements: string[];
}

interface Props {
  documents: DocumentItem[];
  selectedDocuments: number[];
  setSelectedDocuments: React.Dispatch<
    React.SetStateAction<number[]>
  >;
  onNext: () => void;
  onBack: () => void;
}

export default function DocumentStep({
  documents,
  selectedDocuments,
  setSelectedDocuments,
  onNext,
  onBack,
}: Props) {
  const toggle = (id: number) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(
        selectedDocuments.filter((item) => item !== id)
      );
    } else {
      setSelectedDocuments([...selectedDocuments, id]);
    }
  };

  const next = () => {
    if (selectedDocuments.length === 0) {
      Alert.alert(
        'Required',
        'Select at least one document.'
      );
      return;
    }
    onNext();
  };

  return (
    <View>
      <Text style={styles.title}>
        Select documents
      </Text>

      <Text style={styles.subtitle}>
        Choose the documents you need from the registrar.
      </Text>

      {documents.map((doc) => {
        const isSelected = selectedDocuments.includes(doc.id);

        return (
          <TouchableOpacity
            key={doc.id}
            style={[
              styles.card,
              isSelected && styles.selected,
            ]}
            onPress={() => toggle(doc.id)}
          >
            <View
              style={[
                styles.checkbox,
                isSelected && styles.checkboxActive,
              ]}
            >
              {isSelected && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>

            <Text style={styles.cardText}>
              {doc.name}
            </Text>
          </TouchableOpacity>
        );
      })}

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
    color: COLORS.primary,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 16,
  },

  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  selected: {
    borderColor: COLORS.primary,
    backgroundColor: '#fdf5f5',
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },

  checkboxActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },

  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  cardText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
    flex: 1,
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