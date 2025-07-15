import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { medicalAPI } from '../config/api';

interface MedicalAllergy {
  id?: number;
  allergy_name: string;
  severity: 'mild' | 'moderate' | 'severe';
}

interface Medication {
  id?: number;
  medication_name: string;
  dosage: string;
  frequency: string;
  is_active: boolean;
}

interface MedicalCondition {
  id?: number;
  condition_name: string;
  is_chronic: boolean;
  notes: string;
}

export default function EditMedicalScreen() {
  const [loading, setLoading] = useState(true);
  const [allergies, setAllergies] = useState<MedicalAllergy[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [conditions, setConditions] = useState<MedicalCondition[]>([]);
  
  // Modal states
  const [allergyModalVisible, setAllergyModalVisible] = useState(false);
  const [medicationModalVisible, setMedicationModalVisible] = useState(false);
  const [conditionModalVisible, setConditionModalVisible] = useState(false);
  
  // Form states
  const [newAllergy, setNewAllergy] = useState<MedicalAllergy>({
    allergy_name: '',
    severity: 'mild'
  });
  const [newMedication, setNewMedication] = useState<Medication>({
    medication_name: '',
    dosage: '',
    frequency: '',
    is_active: true
  });
  const [newCondition, setNewCondition] = useState<MedicalCondition>({
    condition_name: '',
    is_chronic: false,
    notes: ''
  });

  const [editingItem, setEditingItem] = useState<{type: string, item: any} | null>(null);

  useEffect(() => {
    loadMedicalData();
  }, []);

  const loadMedicalData = async () => {
    try {
      setLoading(true);
      const [allergiesResponse, medicationsResponse, conditionsResponse] = await Promise.all([
        medicalAPI.getAllergies(),
        medicalAPI.getMedications(),
        medicalAPI.getConditions()
      ]);

      setAllergies(allergiesResponse.data || []);
      setMedications(medicationsResponse.data || []);
      setConditions(conditionsResponse.data || []);
    } catch (error) {
      console.error('Error loading medical data:', error);
      Alert.alert('Error', 'Failed to load medical data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllergy = async () => {
    if (!newAllergy.allergy_name.trim()) {
      Alert.alert('Error', 'Please enter an allergy name.');
      return;
    }

    try {
      if (editingItem?.type === 'allergy') {
        await medicalAPI.updateAllergy(editingItem.item.id, newAllergy);
        setAllergies(allergies.map(a => a.id === editingItem.item.id ? { ...newAllergy, id: editingItem.item.id } : a));
      } else {
        const response = await medicalAPI.addAllergy(newAllergy);
        setAllergies([...allergies, response.data]);
      }
      
      setAllergyModalVisible(false);
      setNewAllergy({ allergy_name: '', severity: 'mild' });
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving allergy:', error);
      Alert.alert('Error', 'Failed to save allergy. Please try again.');
    }
  };

  const handleAddMedication = async () => {
    if (!newMedication.medication_name.trim() || !newMedication.dosage.trim() || !newMedication.frequency.trim()) {
      Alert.alert('Error', 'Please fill in all medication fields.');
      return;
    }

    try {
      if (editingItem?.type === 'medication') {
        await medicalAPI.updateMedication(editingItem.item.id, newMedication);
        setMedications(medications.map(m => m.id === editingItem.item.id ? { ...newMedication, id: editingItem.item.id } : m));
      } else {
        const response = await medicalAPI.addMedication(newMedication);
        setMedications([...medications, response.data]);
      }
      
      setMedicationModalVisible(false);
      setNewMedication({ medication_name: '', dosage: '', frequency: '', is_active: true });
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving medication:', error);
      Alert.alert('Error', 'Failed to save medication. Please try again.');
    }
  };

  const handleAddCondition = async () => {
    if (!newCondition.condition_name.trim()) {
      Alert.alert('Error', 'Please enter a condition name.');
      return;
    }

    try {
      if (editingItem?.type === 'condition') {
        await medicalAPI.updateCondition(editingItem.item.id, newCondition);
        setConditions(conditions.map(c => c.id === editingItem.item.id ? { ...newCondition, id: editingItem.item.id } : c));
      } else {
        const response = await medicalAPI.addCondition(newCondition);
        setConditions([...conditions, response.data]);
      }
      
      setConditionModalVisible(false);
      setNewCondition({ condition_name: '', is_chronic: false, notes: '' });
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving condition:', error);
      Alert.alert('Error', 'Failed to save condition. Please try again.');
    }
  };

  const handleEditAllergy = (allergy: MedicalAllergy) => {
    setNewAllergy(allergy);
    setEditingItem({ type: 'allergy', item: allergy });
    setAllergyModalVisible(true);
  };

  const handleEditMedication = (medication: Medication) => {
    setNewMedication(medication);
    setEditingItem({ type: 'medication', item: medication });
    setMedicationModalVisible(true);
  };

  const handleEditCondition = (condition: MedicalCondition) => {
    setNewCondition(condition);
    setEditingItem({ type: 'condition', item: condition });
    setConditionModalVisible(true);
  };

  const handleDeleteAllergy = async (id: number) => {
    Alert.alert(
      'Delete Allergy',
      'Are you sure you want to delete this allergy?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await medicalAPI.deleteAllergy(id);
              setAllergies(allergies.filter(a => a.id !== id));
            } catch (error) {
              console.error('Error deleting allergy:', error);
              Alert.alert('Error', 'Failed to delete allergy. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleDeleteMedication = async (id: number) => {
    Alert.alert(
      'Delete Medication',
      'Are you sure you want to delete this medication?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await medicalAPI.deleteMedication(id);
              setMedications(medications.filter(m => m.id !== id));
            } catch (error) {
              console.error('Error deleting medication:', error);
              Alert.alert('Error', 'Failed to delete medication. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleDeleteCondition = async (id: number) => {
    Alert.alert(
      'Delete Condition',
      'Are you sure you want to delete this condition?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await medicalAPI.deleteCondition(id);
              setConditions(conditions.filter(c => c.id !== id));
            } catch (error) {
              console.error('Error deleting condition:', error);
              Alert.alert('Error', 'Failed to delete condition. Please try again.');
            }
          }
        }
      ]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return '#10B981';
      case 'moderate': return '#F59E0B';
      case 'severe': return '#EF4444';
      default: return '#64748B';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DC143C" />
        <Text style={styles.loadingText}>Loading medical information...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#64748B" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Medical Information</Text>
            
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Allergies Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Allergies</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setAllergyModalVisible(true)}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {allergies.length === 0 ? (
            <Text style={styles.emptyText}>No allergies recorded</Text>
          ) : (
            allergies.map((allergy) => (
              <View key={allergy.id} style={styles.itemCard}>
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{allergy.allergy_name}</Text>
                  <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(allergy.severity) + '20' }]}>
                    <Text style={[styles.severityText, { color: getSeverityColor(allergy.severity) }]}>
                      {allergy.severity.charAt(0).toUpperCase() + allergy.severity.slice(1)}
                    </Text>
                  </View>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => handleEditAllergy(allergy)}
                  >
                    <Ionicons name="pencil" size={16} color="#64748B" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteAllergy(allergy.id!)}
                  >
                    <Ionicons name="trash" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Medications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medications</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setMedicationModalVisible(true)}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {medications.length === 0 ? (
            <Text style={styles.emptyText}>No medications recorded</Text>
          ) : (
            medications.map((medication) => (
              <View key={medication.id} style={styles.itemCard}>
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{medication.medication_name}</Text>
                  <Text style={styles.itemDetails}>{medication.dosage} - {medication.frequency}</Text>
                  {medication.is_active && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeText}>Active</Text>
                    </View>
                  )}
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => handleEditMedication(medication)}
                  >
                    <Ionicons name="pencil" size={16} color="#64748B" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteMedication(medication.id!)}
                  >
                    <Ionicons name="trash" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Medical Conditions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medical Conditions</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setConditionModalVisible(true)}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {conditions.length === 0 ? (
            <Text style={styles.emptyText}>No medical conditions recorded</Text>
          ) : (
            conditions.map((condition) => (
              <View key={condition.id} style={styles.itemCard}>
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{condition.condition_name}</Text>
                  {condition.notes && <Text style={styles.itemDetails}>{condition.notes}</Text>}
                  {condition.is_chronic && (
                    <View style={styles.chronicBadge}>
                      <Text style={styles.chronicText}>Chronic</Text>
                    </View>
                  )}
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => handleEditCondition(condition)}
                  >
                    <Ionicons name="pencil" size={16} color="#64748B" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteCondition(condition.id!)}
                  >
                    <Ionicons name="trash" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Allergy Modal */}
      <Modal
        visible={allergyModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => {
              setAllergyModalVisible(false);
              setNewAllergy({ allergy_name: '', severity: 'mild' });
              setEditingItem(null);
            }}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingItem?.type === 'allergy' ? 'Edit Allergy' : 'Add Allergy'}
            </Text>
            <TouchableOpacity onPress={handleAddAllergy}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Allergy Name *</Text>
              <TextInput
                style={styles.input}
                value={newAllergy.allergy_name}
                onChangeText={(text) => setNewAllergy({...newAllergy, allergy_name: text})}
                placeholder="e.g., Peanuts, Shellfish"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Severity *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={newAllergy.severity}
                  onValueChange={(itemValue) => setNewAllergy({...newAllergy, severity: itemValue})}
                  style={styles.picker}
                >
                  <Picker.Item label="Mild" value="mild" />
                  <Picker.Item label="Moderate" value="moderate" />
                  <Picker.Item label="Severe" value="severe" />
                </Picker>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Medication Modal */}
      <Modal
        visible={medicationModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => {
              setMedicationModalVisible(false);
              setNewMedication({ medication_name: '', dosage: '', frequency: '', is_active: true });
              setEditingItem(null);
            }}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingItem?.type === 'medication' ? 'Edit Medication' : 'Add Medication'}
            </Text>
            <TouchableOpacity onPress={handleAddMedication}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Medication Name *</Text>
              <TextInput
                style={styles.input}
                value={newMedication.medication_name}
                onChangeText={(text) => setNewMedication({...newMedication, medication_name: text})}
                placeholder="e.g., Aspirin, Lisinopril"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dosage *</Text>
              <TextInput
                style={styles.input}
                value={newMedication.dosage}
                onChangeText={(text) => setNewMedication({...newMedication, dosage: text})}
                placeholder="e.g., 5mg, 500mg"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Frequency *</Text>
              <TextInput
                style={styles.input}
                value={newMedication.frequency}
                onChangeText={(text) => setNewMedication({...newMedication, frequency: text})}
                placeholder="e.g., Once daily, Twice daily"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setNewMedication({...newMedication, is_active: !newMedication.is_active})}
            >
              <View style={[styles.checkbox, newMedication.is_active && styles.checkboxActive]}>
                {newMedication.is_active && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxLabel}>Currently taking this medication</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Condition Modal */}
      <Modal
        visible={conditionModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => {
              setConditionModalVisible(false);
              setNewCondition({ condition_name: '', is_chronic: false, notes: '' });
              setEditingItem(null);
            }}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingItem?.type === 'condition' ? 'Edit Condition' : 'Add Condition'}
            </Text>
            <TouchableOpacity onPress={handleAddCondition}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Condition Name *</Text>
              <TextInput
                style={styles.input}
                value={newCondition.condition_name}
                onChangeText={(text) => setNewCondition({...newCondition, condition_name: text})}
                placeholder="e.g., Diabetes, Hypertension"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newCondition.notes}
                onChangeText={(text) => setNewCondition({...newCondition, notes: text})}
                placeholder="Additional notes about this condition"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setNewCondition({...newCondition, is_chronic: !newCondition.is_chronic})}
            >
              <View style={[styles.checkbox, newCondition.is_chronic && styles.checkboxActive]}>
                {newCondition.is_chronic && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxLabel}>This is a chronic condition</Text>
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
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
  },
  header: {
    paddingTop: 50,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  headerGradient: {
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  addButton: {
    backgroundColor: '#DC143C',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#10B98120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  chronicBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F59E0B20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chronicText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
  bottomSpacing: {
    height: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingTop: 60,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  cancelButton: {
    fontSize: 16,
    color: '#64748B',
  },
  saveButton: {
    fontSize: 16,
    color: '#DC143C',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#1F2937',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#DC143C',
    borderColor: '#DC143C',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
  },
});
