/**
 * ═══════════════════════════════════════════════════════════════════
 * GESTOR DE FOTOS - CERTIFICADOS Y TRABAJOS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Permite que profesionales carguen:
 *   - Fotos de certificados (licencias, diplomas, etc)
 *   - Fotos de trabajos realizados (portfolio)
 *   - Galerías de imágenes
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, RADIUS } from '../constants';

// ═══════════════════════════════════════════════════════════════════
// GESTOR DE FOTOS - HOOK PRINCIPAL
// ═══════════════════════════════════════════════════════════════════

export const usePhotosManager = (userId) => {
  const [certificates, setCertificates] = useState([]);
  const [workPhotos, setWorkPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const STORAGE_KEY = `photos_${userId}`;

  // Cargar fotos guardadas
  useEffect(() => {
    loadPhotos();
  }, [userId]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const { certificates: certs, workPhotos: work } = JSON.parse(data);
        setCertificates(certs || []);
        setWorkPhotos(work || []);
      }
    } catch (error) {
      console.error('Error al cargar fotos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCertificate = async (photo) => {
    try {
      const newCert = {
        id: Date.now().toString(),
        uri: photo.uri,
        name: photo.name || `Certificado ${certificates.length + 1}`,
        uploadedAt: new Date().toISOString(),
      };
      const updated = [...certificates, newCert];
      setCertificates(updated);
      await savePhoToStorage(updated, workPhotos);
      return newCert;
    } catch (error) {
      console.error('Error al agregar certificado:', error);
      throw error;
    }
  };

  const addWorkPhoto = async (photo) => {
    try {
      const newPhoto = {
        id: Date.now().toString(),
        uri: photo.uri,
        name: photo.name || `Trabajo ${workPhotos.length + 1}`,
        description: photo.description || '',
        uploadedAt: new Date().toISOString(),
      };
      const updated = [...workPhotos, newPhoto];
      setWorkPhotos(updated);
      await savePhoToStorage(certificates, updated);
      return newPhoto;
    } catch (error) {
      console.error('Error al agregar foto de trabajo:', error);
      throw error;
    }
  };

  const removeCertificate = async (id) => {
    try {
      const updated = certificates.filter(c => c.id !== id);
      setCertificates(updated);
      await savePhoToStorage(updated, workPhotos);
    } catch (error) {
      console.error('Error al remover certificado:', error);
      throw error;
    }
  };

  const removeWorkPhoto = async (id) => {
    try {
      const updated = workPhotos.filter(p => p.id !== id);
      setWorkPhotos(updated);
      await savePhoToStorage(certificates, updated);
    } catch (error) {
      console.error('Error al remover foto:', error);
      throw error;
    }
  };

  const savePhoToStorage = async (certs, work) => {
    try {
      const data = { certificates: certs, workPhotos: work };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error al guardar fotos:', error);
      throw error;
    }
  };

  return {
    certificates,
    workPhotos,
    loading,
    addCertificate,
    addWorkPhoto,
    removeCertificate,
    removeWorkPhoto,
    loadPhotos,
  };
};

// ═══════════════════════════════════════════════════════════════════
// COMPONENTE: GALERÍA DE CERTIFICADOS
// ═══════════════════════════════════════════════════════════════════

export const CertificatesGallery = ({
  certificates = [],
  onAdd,
  onRemove,
  editable = false,
}) => {
  return (
    <View style={styles.gallery}>
      <View style={styles.galleryHeader}>
        <Text style={styles.galleryTitle}>📜 Certificados</Text>
        {editable && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={onAdd}
          >
            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {certificates.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={40} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>
            {editable ? 'No hay certificados. ¡Agrega uno!' : 'Sin certificados'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={certificates}
          keyExtractor={c => c.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.certItem}>
              <View style={styles.certContent}>
                <Ionicons name="document" size={24} color={COLORS.primary} />
                <View style={styles.certInfo}>
                  <Text style={styles.certName}>{item.name}</Text>
                  <Text style={styles.certDate}>
                    {new Date(item.uploadedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              {editable && (
                <TouchableOpacity 
                  onPress={() => onRemove(item.id)}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════
// COMPONENTE: GALERÍA DE TRABAJOS
// ═══════════════════════════════════════════════════════════════════

export const WorkPhotosGallery = ({
  workPhotos = [],
  onAdd,
  onRemove,
  editable = false,
}) => {
  return (
    <View style={styles.gallery}>
      <View style={styles.galleryHeader}>
        <Text style={styles.galleryTitle}>🖼️ Trabajos Realizados</Text>
        {editable && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={onAdd}
          >
            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {workPhotos.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="images-outline" size={40} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>
            {editable ? 'Sin fotos. ¡Muestra tu trabajo!' : 'Sin trabajos'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={workPhotos}
          keyExtractor={p => p.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.photosRow}
          renderItem={({ item }) => (
            <View style={styles.photoItem}>
              <View style={styles.photoPlaceholder}>
                <Ionicons name="image-outline" size={40} color={COLORS.textMuted} />
              </View>
              <Text style={styles.photoName} numberOfLines={2}>{item.name}</Text>
              {item.description && (
                <Text style={styles.photoDesc} numberOfLines={2}>{item.description}</Text>
              )}
              {editable && (
                <TouchableOpacity 
                  onPress={() => onRemove(item.id)}
                  style={styles.photoRemoveButton}
                >
                  <Ionicons name="close-circle" size={20} color={COLORS.danger} />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  gallery: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  galleryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  addButton: {
    padding: SPACING.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
  certItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface || '#f5f5f5',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  certContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  certInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  certName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  certDate: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  removeButton: {
    padding: SPACING.sm,
  },
  photosRow: {
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  photoItem: {
    width: '48%',
    backgroundColor: COLORS.surface || '#f5f5f5',
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  photoPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  photoName: {
    fontSize: 12,
    fontWeight: '600',
    padding: SPACING.sm,
    color: COLORS.text,
  },
  photoDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  photoRemoveButton: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 50,
  },
});
