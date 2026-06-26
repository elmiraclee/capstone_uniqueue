import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import AppHeader from '../../../components/layout/app-header';
import ConfigDrawer from '../../../components/layout/config-drawer';
import { COLORS } from '../../../constants/theme';

export default function Document() {
  const router = useRouter();

  const [documents, setDocuments] = useState<any[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [dailyCapacity, setDailyCapacity] = useState('');
  const [processingTime, setProcessingTime] = useState('');
  const [requirements, setRequirements] = useState('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);

      const user = await AsyncStorage.getItem('user');
      if (!user) return;

      const parsedUser = JSON.parse(user);

      const response = await fetch(
        `http://192.168.1.6/uniqueue_api/get_documents.php?office_id=${parsedUser.office_id}`
      );

      const data = await response.json();

      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDailyCapacity('');
    setProcessingTime('');
    setRequirements('');
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsEdit(false);
    setModalVisible(true);
  };

  const openEditModal = (item: any) => {
    setIsEdit(true);
    setModalVisible(true);

    setEditingId(item.id);
    setName(item.name);
    setDailyCapacity(String(item.daily_capacity));
    setProcessingTime(String(item.processing_time));

    setRequirements(
      Array.isArray(item.requirements)
        ? item.requirements.join(', ')
        : ''
    );
  };

  const saveDocument = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (!user) return;

      const parsedUser = JSON.parse(user);

      if (!name || !dailyCapacity || !processingTime) {
        Alert.alert('Error', 'Please fill all fields');
        return;
      }

      const payload = {
        office_id: parsedUser.office_id,
        name,
        daily_capacity: parseInt(dailyCapacity),
        processing_time: parseInt(processingTime),
        requirements: requirements
          .split(',')
          .map(r => r.trim())
          .filter(r => r.length > 0),
      };

      const url = isEdit
        ? 'http://192.168.1.17/uniqueue_api/update_documents.php'
        : 'http://192.168.1.17/uniqueue_api/add_documents.php';

      const body = isEdit
        ? { ...payload, id: editingId }
        : payload;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setModalVisible(false);
        resetForm();
        await loadDocuments();
      } else {
        Alert.alert('Error', data.message || 'Failed');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteDocument = async (id: number) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(
              'http://192.168.1.17/uniqueue_api/delete_documents.php',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
              }
            );

            const data = await res.json();

            if (data.success) {
              await loadDocuments();
            }
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Document Configuration" />

      {/* MENU */}
      <View style={styles.menuContainer}>
        <Pressable onPress={() => setDrawerVisible(true)}>
          <Ionicons name="menu" size={32} color={COLORS.primary} />
        </Pressable>
      </View>

      {/* LOADING */}
      {loading && (
        <ActivityIndicator size="large" color={COLORS.primary} />
      )}

      {/* EMPTY STATE */}
      {!loading && documents.length === 0 && (
        <Text style={styles.emptyText}>No documents found</Text>
      )}

      {/* LIST */}
      <FlatList
        data={documents}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>

            <Text style={styles.text}>
              Daily Capacity: {item.daily_capacity}
            </Text>

            <Text style={styles.text}>
              Processing Time: {item.processing_time} mins
            </Text>

            <Text style={styles.requirements}>Requirements:</Text>

            {Array.isArray(item.requirements) &&
              item.requirements.map((req: string, i: number) => (
                <Text key={i}>• {req}</Text>
              ))}

            {/* ACTIONS */}
            <View style={styles.actionsRow}>
              <Pressable
                style={styles.editBtn}
                onPress={() => openEditModal(item)}
              >
                <Ionicons name="create-outline" size={18} color="#fff" />
                <Text style={styles.btnText}>Edit</Text>
              </Pressable>

              <Pressable
                style={styles.deleteBtn}
                onPress={() => deleteDocument(item.id)}
              >
                <Ionicons name="trash-outline" size={18} color="#fff" />
                <Text style={styles.btnText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* FLOATING ADD BUTTON — must be after FlatList so it's on top */}
      <Pressable style={styles.fab} onPress={openAddModal}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEdit ? 'Edit Document' : 'Add Document'}
            </Text>

            <TextInput
              placeholder="Document Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <TextInput
              placeholder="Daily Capacity"
              value={dailyCapacity}
              onChangeText={setDailyCapacity}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              placeholder="Processing Time"
              value={processingTime}
              onChangeText={setProcessingTime}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              placeholder="Requirements (comma separated)"
              value={requirements}
              onChangeText={setRequirements}
              style={styles.input}
            />

            <Pressable style={styles.saveBtn} onPress={saveDocument}>
              <Text style={styles.saveBtnText}>
                {isEdit ? 'Update' : 'Save'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.cancelBtn}
              onPress={() => {
                setModalVisible(false);
                resetForm();
              }}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* DRAWER */}
     <ConfigDrawer
      visible={drawerVisible}
      activeScreen="document"
      onClose={() => setDrawerVisible(false)}
      onDocumentPress={() => setDrawerVisible(false)}
      onWindowPress={() => {
        setDrawerVisible(false);
        router.push('/office/config/window');
      }}
      onCapacityPress={() => {
        setDrawerVisible(false);
        router.push('/office/config/capacity');
      }}
      onLogoutPress={async () => {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('role');
        router.replace('/login');
      }}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  menuContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },

  text: {
    marginTop: 5,
    color: COLORS.text,
  },

  requirements: {
    marginTop: 10,
    fontWeight: '700',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },

  saveBtn: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },

  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
  },

  cancelBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  cancelBtnText: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },

  editBtn: {
    flexDirection: 'row',
    backgroundColor: '#7A7A7A',
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
    gap: 5,
  },

  deleteBtn: {
    flexDirection: 'row',
    backgroundColor: '#660810',
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
    gap: 5,
  },

  btnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 10,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});