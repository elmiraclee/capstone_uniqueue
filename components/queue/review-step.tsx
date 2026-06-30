import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
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
  queueType: 'walkin' | 'appointment';
  priority: boolean;
  priorityReason: string;
  appointmentDate: string;
  setAppointmentDate: (text: string) => void;
  documents: DocumentItem[];
  selectedDocuments: number[];
  quantities: Record<number, number>;
  onSubmit: () => void;
  onBack: () => void;
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function ReviewStep({
  queueType,
  priority,
  priorityReason,
  appointmentDate,
  setAppointmentDate,
  documents,
  selectedDocuments,
  quantities,
  onSubmit,
  onBack,
}: Props) {
  return (
    <View>
      <Text style={styles.title}>
        Review your request
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>
          Queue details
        </Text>

        <InfoRow
          label="Type"
          value={
            queueType === 'walkin'
              ? 'Walk-in'
              : 'Appointment'
          }
        />

        <InfoRow
          label="Priority lane"
          value={priority ? 'Yes' : 'No'}
        />

        {priority && (
          <InfoRow
            label="Reason"
            value={priorityReason}
          />
        )}
      </View>

      {queueType === 'appointment' && (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>
            Appointment date
          </Text>

          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={COLORS.gray}
            value={appointmentDate}
            onChangeText={setAppointmentDate}
          />
        </View>
      )}

      {queueType === 'walkin' &&
        selectedDocuments.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>
              Documents requested
            </Text>

            {documents
              .filter((doc) =>
                selectedDocuments.includes(doc.id)
              )
              .map((doc) => (
                <View
                  key={doc.id}
                  style={styles.docRow}
                >
                  <Text style={styles.docName}>
                    {doc.name}
                  </Text>

                  <View style={styles.qtyBadge}>
                    <Text style={styles.qtyBadgeText}>
                      x{quantities[doc.id] || 1}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            queueType === 'appointment' &&
            appointmentDate.trim() === ''
              ? styles.disabledButton
              : null,
          ]}
          disabled={
            queueType === 'appointment' &&
            appointmentDate.trim() === ''
          }
          onPress={() => {
            if (
              queueType === 'appointment' &&
              appointmentDate.trim() === ''
            ) {
              alert('Please select an appointment date.');
              return;
            }

            onSubmit();
          }}
        >
          <Text style={styles.buttonText}>
            Join queue
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

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0e8e8',
  },

  label: {
    fontSize: 13,
    color: COLORS.gray,
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
    maxWidth: '60%',
    textAlign: 'right',
  },

  input: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: COLORS.text,
    marginTop: 4,
  },

  docRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0e8e8',
  },

  docName: {
    fontSize: 14,
    color: COLORS.secondary,
    flex: 1,
  },

  qtyBadge: {
    backgroundColor: '#fdf5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#f5c5c8',
  },

  qtyBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
    marginTop: 8,
  },

  buttonText: {
    color: COLORS.white,
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

  disabledButton: {
  opacity: 0.5,
},
});