import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import AppHeader from '../../../components/layout/app-header';
import DocumentStep from '../../../components/queue/document-step';
import PriorityStep from '../../../components/queue/priority-step';
import QuantityStep from '../../../components/queue/quantity-step';
import QueueTypeStep from '../../../components/queue/queue-type-step';
import RequirementStep from '../../../components/queue/requirement-step';
import ReviewStep from '../../../components/queue/review-step';
import { COLORS } from '../../../constants/theme';

export interface Document {
  id: number;
  name: string;
  requirements: string[];
}

const WALK_IN_STEPS = [
  { label: 'Type' },
  { label: 'Priority' },
  { label: 'Documents' },
  { label: 'Requirements' },
  { label: 'Quantity' },
  { label: 'Review' },
];

const APPOINTMENT_STEPS = [
  { label: 'Type' },
  { label: 'Priority' },
  { label: 'Review' },
];

function StepIndicator({
  current,
  queueType,
}: {
  current: number;
  queueType: 'walkin' | 'appointment';
}) {
  const steps =
    queueType === 'appointment'
      ? APPOINTMENT_STEPS
      : WALK_IN_STEPS;

  // Map real step numbers to visual step index
  const stepMap: Record<string, number[]> = {
    walkin: [1, 2, 3, 4, 5, 6],
    appointment: [1, 2, 6],
  };

  const currentSteps = stepMap[queueType];
  const visualIndex = currentSteps.indexOf(current);

  return (
    <View style={indicator.wrapper}>
      <View style={indicator.row}>
        {steps.map((step, i) => {
          const isDone = i < visualIndex;
          const isActive = i === visualIndex;

          return (
            <View
              key={i}
              style={indicator.stepGroup}
            >
              <View
                style={[
                  indicator.dot,
                  isDone && indicator.dotDone,
                  isActive && indicator.dotActive,
                  !isDone &&
                    !isActive &&
                    indicator.dotTodo,
                ]}
              >
                {isDone ? (
                  <Text style={indicator.dotTextDone}>
                    ✓
                  </Text>
                ) : (
                  <Text
                    style={[
                      indicator.dotText,
                      isActive &&
                        indicator.dotTextActive,
                    ]}
                  >
                    {i + 1}
                  </Text>
                )}
              </View>

              {i < steps.length - 1 && (
                <View
                  style={[
                    indicator.line,
                    isDone && indicator.lineDone,
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>

      <Text style={indicator.label}>
        {steps[visualIndex]?.label ?? ''}
      </Text>
    </View>
  );
}

const indicator = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  stepGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dotDone: {
    backgroundColor: COLORS.primary,
  },

  dotActive: {
    backgroundColor: COLORS.primary,
    // ring effect via border
    borderWidth: 3,
    borderColor: '#f5c5c8',
  },

  dotTodo: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ddd',
  },

  dotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#bbb',
  },

  dotTextActive: {
    color: '#fff',
  },

  dotTextDone: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },

  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#ddd',
    marginHorizontal: 3,
  },

  lineDone: {
    backgroundColor: COLORS.primary,
  },

  label: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default function RegistrarQueue() {
  const [step, setStep] = useState(1);
  const [studentId, setStudentId] = useState(0);

  const [queueType, setQueueType] =
    useState<'walkin' | 'appointment'>('walkin');

  const [priority, setPriority] = useState(false);
  const [priorityReason, setPriorityReason] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');

  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const [checkedRequirements, setCheckedRequirements] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [queueNumber, setQueueNumber] = useState(''); 
  const [assignedWindow, setAssignedWindow] = useState('');

  useEffect(() => {
    loadUser();
    fetchDocuments();
  }, []);

  const loadUser = async () => {
    const user = await AsyncStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      setStudentId(parsed.id);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch(
        'http://192.168.1.9/uniqueue_api/get_documents.php?office_id=1'
      );
      const data = await response.json();
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const joinQueue = async () => {
    try {
      const docs = selectedDocuments.map((id) => ({
        document_id: id,
        quantity: quantities[id] || 1,
      }));

      const response = await fetch(
        'http://192.168.1.9/uniqueue_api/join_registrar_queue.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: studentId,
            office_id: 1,
            type: queueType,
            priority,
            priority_reason: priorityReason,
            appointment_date:
              queueType === 'appointment'
                ? appointmentDate
                : null,
            documents: docs,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setQueueNumber(data.queue_number);
        setAssignedWindow(data.window_name || 'Not Assigned');
        setShowSuccessModal(true);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to join queue');
    }
  };

  // Compute the "back" step depending on queue type
  const goBack = () => {
    if (step === 1) return;

    if (queueType === 'appointment') {
      // steps for appointment: 1 → 2 → 6
      if (step === 2) setStep(1);
      else if (step === 6) setStep(2);
    } else {
      setStep(step - 1);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader />

      <ScrollView
        contentContainerStyle={styles.content}
      >
        <StepIndicator
          current={step}
          queueType={queueType}
        />

        {step === 1 && (
          <QueueTypeStep
            queueType={queueType}
            setQueueType={setQueueType}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <PriorityStep
            priority={priority}
            setPriority={setPriority}
            priorityReason={priorityReason}
            setPriorityReason={setPriorityReason}
            onNext={() =>
              setStep(
                queueType === 'appointment' ? 6 : 3
              )
            }
            onBack={goBack}
          />
        )}

        {step === 3 && (
          <DocumentStep
            documents={documents}
            selectedDocuments={selectedDocuments}
            setSelectedDocuments={setSelectedDocuments}
            onNext={() => setStep(4)}
            onBack={goBack}
          />
        )}

        {step === 4 && (
          <RequirementStep
            documents={documents}
            selectedDocuments={selectedDocuments}
            checkedRequirements={checkedRequirements}
            setCheckedRequirements={setCheckedRequirements}
            onNext={() => setStep(5)}
            onBack={goBack}
          />
        )}

        {step === 5 && (
          <QuantityStep
            documents={documents}
            selectedDocuments={selectedDocuments}
            quantities={quantities}
            setQuantities={setQuantities}
            onNext={() => setStep(6)}
            onBack={goBack}
          />
        )}

        {step === 6 && (
          <ReviewStep
            queueType={queueType}
            priority={priority}
            priorityReason={priorityReason}
            appointmentDate={appointmentDate}
            documents={documents}
            selectedDocuments={selectedDocuments}
            quantities={quantities}
            setAppointmentDate={setAppointmentDate}
            onSubmit={joinQueue}
            onBack={goBack}
          />
        )}
      </ScrollView>

<Modal
  visible={showSuccessModal}
  transparent
  animationType="fade"
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalCard}>
      <Text style={styles.modalTitle}>
        Queue Created
      </Text>

      <Text style={styles.queueNumberText}>
        {queueNumber}
      </Text>

      <Text style={styles.modalLabel}>
        Assigned Counter
      </Text>

      <Text style={styles.windowText}>
        {assignedWindow}
      </Text>

      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => {
          setShowSuccessModal(false);

          // reset form
          setStep(1);
          setQueueType('walkin');
          setPriority(false);
          setPriorityReason('');
          setAppointmentDate('');
          setSelectedDocuments([]);
          setCheckedRequirements([]);
          setQuantities({});
        }}
      >
        <Text style={styles.modalButtonText}>
          OK
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

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
    paddingBottom: 50,
  },

  modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
},

modalCard: {
  width: '85%',
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: 30,
  alignItems: 'center',
},

modalTitle: {
  fontSize: 24,
  fontWeight: '700',
  color: COLORS.primary,
  marginBottom: 15,
},

queueNumberText: {
  fontSize: 48,
  fontWeight: 'bold',
  color: COLORS.primary,
  marginBottom: 20,
},

modalLabel: {
  fontSize: 14,
  color: COLORS.gray,
},

windowText: {
  fontSize: 22,
  fontWeight: '700',
  color: COLORS.secondary,
  marginTop: 8,
},

modalButton: {
  marginTop: 30,
  backgroundColor: COLORS.primary,
  paddingHorizontal: 40,
  paddingVertical: 14,
  borderRadius: 12,
},

modalButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '700',
},
});