import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Avatar, Badge } from '../../components';
import apiService from '../../services';
import { ActivityIndicator } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants';
import { useAuth } from '../../context';

// ============ PROFESSIONAL LOGIN/REGISTER SCREEN ============
export const ProfessionalOnboardingScreen = ({ navigation }) => {
  const { register, login, isLoading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Register fields
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerSpecialty, setRegisterSpecialty] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async () => {
    setLoginError('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('⚠️ Por favor completa email y contraseña');
      return;
    }
    
    const res = await login(loginEmail.trim(), loginPassword.trim());
    if (!res.ok) {
      setLoginError('⚠️ ' + (res.error || 'Error en login'));
    }
  };

  const handleRegister = async () => {
    setRegisterError('');
    if (!registerName.trim() || !registerEmail.trim() || !registerPhone.trim() || !registerSpecialty.trim() || !registerPassword.trim()) {
      setRegisterError('⚠️ Por favor completa todos los campos');
      return;
    }

    const res = await register({
      name: registerName.trim(),
      email: registerEmail.trim(),
      phone: registerPhone.trim(),
      specialty: registerSpecialty.trim(),
      password: registerPassword.trim(),
      role: 'professional',
      city: '',
      experience: '',
      zone: registerSpecialty,
      verified: false,
    });

    if (!res.ok) {
      setRegisterError('⚠️ ' + (res.error || 'Error en registro'));
      return;
    }

    setSuccessMessage('✓ Cuenta creada exitosamente. Redirigiendo al login...');
    setTimeout(() => {
      setSuccessMessage('');
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPhone('');
      setRegisterSpecialty('');
      setRegisterPassword('');
      setIsRegistering(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.xl }}>
        <View style={styles.header}>
          {isRegistering && (
            <TouchableOpacity onPress={() => { setIsRegistering(false); setRegisterError(''); }}>
              <Text style={{ fontSize: 18, color: COLORS.primary }}>← Volver a iniciar sesión</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.screenTitle}>{isRegistering ? 'Registro Profesional' : 'Login Profesional'}</Text>
          <View style={{ width: 50 }} />
        </View>

        {!isRegistering ? (
          // LOGIN FORM
          <View style={styles.contentPadding}>
            {loginError && (
              <View style={[styles.banner, { backgroundColor: COLORS.danger }]}>
                <Text style={{ color: 'white', fontWeight: '600' }}>{loginError}</Text>
              </View>
            )}

            <Card>
              <Text style={styles.cardTitle}>🔐 Inicia sesión como profesional</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="tu@email.com"
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                  keyboardType="email-address"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tu contraseña"
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  secureTextEntry={true}
                  editable={!isLoading}
                />
              </View>
            </Card>

            <Button 
              title={isLoading ? "Iniciando..." : "Iniciar sesión"} 
              onPress={handleLogin}
              disabled={isLoading}
            />
            
            <View style={{ marginTop: SPACING.md }}>
              <Text style={{ textAlign: 'center', color: COLORS.textMuted, marginBottom: SPACING.md }}>
                ¿No tienes cuenta?
              </Text>
              <Button 
                title="📝 Regístrate como profesional" 
                variant="secondary"
                onPress={() => { setIsRegistering(true); setLoginError(''); setLoginEmail(''); setLoginPassword(''); }}
                disabled={isLoading}
              />
            </View>
          </View>
        ) : (
          // REGISTER FORM
          <View style={styles.contentPadding}>
            {registerError && (
              <View style={[styles.banner, { backgroundColor: COLORS.danger }]}>
                <Text style={{ color: 'white', fontWeight: '600' }}>{registerError}</Text>
              </View>
            )}

            {successMessage && (
              <View style={[styles.banner, { backgroundColor: COLORS.success }]}>
                <Text style={{ color: 'white', fontWeight: '600' }}>{successMessage}</Text>
              </View>
            )}

            <Card>
              <Text style={styles.cardTitle}>👤 Datos personales</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nombre completo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tu nombre"
                  value={registerName}
                  onChangeText={setRegisterName}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="tu@email.com"
                  value={registerEmail}
                  onChangeText={setRegisterEmail}
                  keyboardType="email-address"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+595 9xx xxxxxx"
                  value={registerPhone}
                  onChangeText={setRegisterPhone}
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Especialidad</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Electricista, Plomero"
                  value={registerSpecialty}
                  onChangeText={setRegisterSpecialty}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tu contraseña"
                  value={registerPassword}
                  onChangeText={setRegisterPassword}
                  secureTextEntry={true}
                  editable={!isLoading}
                />
              </View>
            </Card>

            <Button 
              title={isLoading ? "Registrando..." : "Crear cuenta"} 
              onPress={handleRegister}
              disabled={isLoading}
            />
            <Button 
              title="Cancelar" 
              variant="secondary"
              onPress={() => { setIsRegistering(false); setRegisterError(''); }}
              disabled={isLoading}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ PROFESSIONAL VALIDATION PENDING SCREEN ============
export const ProfessionalValidationScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);

  const ADMIN_WHATSAPP = '+595991836168'; // Número real del admin: 0991836168
  const registrationData = `
Solicitud de Validación - ManosPy 🔧

Nombre: ${user?.name}
Email: ${user?.email}
Teléfono: ${user?.phone}
Especialidad: ${user?.specialty}
Fecha de Registro: ${new Date().toLocaleDateString('es-ES')}

Por favor valida esta cuenta escribiendo: /validar ${user?.email}
  `.trim();

  const whatsappLink = `https://wa.me/${ADMIN_WHATSAPP.replace(/[^\d]/g, '')}?text=${encodeURIComponent(registrationData)}`;

  const copyToClipboard = () => {
    // Copiar datos al portapapeles
    alert('Datos copiados:\n\n' + registrationData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsApp = async () => {
    try {
      await Linking.openURL(whatsappLink);
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      alert('No se pudo abrir WhatsApp. Por favor, intenta copiar los datos.');
    }
  };

  const checkVerificationStatus = async () => {
    try {
      setChecking(true);
      // Obtener la BD de usuarios para verificar si esta cuenta ya fue validada
      const usersDB = await AsyncStorage.getItem('manospy_users_db_v1');
      if (usersDB) {
        const users = JSON.parse(usersDB);
        const updatedUser = users.find(u => u.id === user?.id);
        
        if (updatedUser && updatedUser.verified === true) {
          // La cuenta ha sido validada - refrescar el auth state
          await AsyncStorage.setItem('manospy_user_v1', JSON.stringify(updatedUser));
          // Forzar una renavegación
          navigation.navigate('ProfessionalTabs');
          Alert.alert('✓ ¡Excelente!', 'Tu cuenta ha sido validada. Ya puedes usar ManosPy.');
        } else {
          Alert.alert('⏳ Aún pendiente', 'Tu cuenta aún está en proceso de validación. Intenta en unos momentos.');
        }
      }
    } catch (error) {
      console.error('Error checking verification:', error);
      Alert.alert('Error', 'No se pudo verificar el estado de tu cuenta');
    } finally {
      setChecking(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContent}>
          <View style={{ alignItems: 'center', marginTop: SPACING.xl }}>
            <Text style={{ fontSize: 60 }}>⏳</Text>
            <Text style={[styles.screenTitle, { marginTop: SPACING.md }]}>Validación Pendiente</Text>
            <Text style={[styles.subtitle2, { marginTop: SPACING.sm, textAlign: 'center' }]}>
              Tu cuenta está en proceso de verificación
            </Text>
          </View>
        </View>

        <View style={styles.contentPadding}>
          <Card>
            <Text style={styles.cardTitle}>📋 Información de tu solicitud</Text>
            <View style={styles.prefItem}>
              <Text style={{ fontWeight: '600' }}>Nombre</Text>
              <Text style={{ color: COLORS.textMuted }}>{user?.name}</Text>
            </View>
            <View style={styles.prefItem}>
              <Text style={{ fontWeight: '600' }}>Email</Text>
              <Text style={{ color: COLORS.textMuted }}>{user?.email}</Text>
            </View>
            <View style={styles.prefItem}>
              <Text style={{ fontWeight: '600' }}>Teléfono</Text>
              <Text style={{ color: COLORS.textMuted }}>{user?.phone}</Text>
            </View>
            <View style={styles.prefItem}>
              <Text style={{ fontWeight: '600' }}>Especialidad</Text>
              <Text style={{ color: COLORS.textMuted }}>{user?.specialty}</Text>
            </View>
          </Card>

          <Card style={{ marginTop: SPACING.lg, backgroundColor: '#FFF9E6' }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.warning, marginBottom: SPACING.md }}>
              ⚠️ ¿Qué significa esto?
            </Text>
            <Text style={{ fontSize: 13, color: COLORS.text, lineHeight: 20 }}>
              Para garantizar la confiabilidad de ManosPy, validamos cada profesional. El administrador corroborará tus datos y verificará tu cuenta en las próximas 24-48 horas.
            </Text>
          </Card>

          <Card style={{ marginTop: SPACING.lg }}>
            <Text style={styles.cardTitle}>📞 Contactar al administrador</Text>
            <Text style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md }}>
              Puedes contactar directamente al administrador por WhatsApp:
            </Text>
            <Button
              title="💬 Abrir WhatsApp"
              onPress={openWhatsApp}
            />
            <TouchableOpacity
              style={{ marginTop: SPACING.md }}
              onPress={copyToClipboard}
            >
              <Text style={{ color: COLORS.primary, fontWeight: '600', textAlign: 'center', fontSize: 12 }}>
                {copied ? '✓ Copiado' : 'Copiar datos de solicitud'}
              </Text>
            </TouchableOpacity>
          </Card>

          <Card style={{ marginTop: SPACING.lg, backgroundColor: '#E6F3FF' }}>
            <View style={{ flexDirection: 'row', gap: SPACING.md }}>
              <Text style={{ fontSize: 20 }}>ℹ️</Text>
              <Text style={{ flex: 1, fontSize: 12, color: COLORS.text }}>
                Una vez que el administrador valide tu cuenta, recibirás una notificación por email y podrás iniciar sesión inmediatamente.
              </Text>
            </View>
          </Card>

          <View style={{ gap: SPACING.md, marginTop: SPACING.xl, marginBottom: SPACING.xl }}>
            <Button
              title={checking ? "🔄 Verificando..." : "✓ Verificar estado de validación"}
              onPress={checkVerificationStatus}
              disabled={checking}
            />
            <Button
              title="🚪 Cerrar sesión"
              variant="secondary"
              onPress={() => logout()}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ PROFESSIONAL HOME SCREEN ============
export const ProfessionalHomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>¡Hola, {user?.name || 'Profesional'}! 👋</Text>
          <Text style={styles.subtitle2}>{user?.specialty || 'Especialista'}</Text>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Solicitudes</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Hoy</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>$850K</Text>
            <Text style={styles.statLabel}>Ingresos est.</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>4.8★</Text>
            <Text style={styles.statLabel}>Valoración</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>
          <View style={styles.quickActions}>
            <Button 
              title="📥 Solicitudes"
              variant="secondary"
              onPress={() => navigation.navigate('ProfessionalRequests')}
            />
            <Button 
              title="📅 Agenda"
              variant="secondary"
              onPress={() => navigation.navigate('ProfessionalAgenda')}
            />
          </View>
          <View style={styles.quickActions}>
            <Button 
              title="📊 Estadísticas"
              variant="secondary"
              onPress={() => {}}
            />
            <Button 
              title="💬 Mensajes"
              variant="secondary"
              onPress={() => navigation.navigate('ProfessionalChat')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad reciente</Text>
          <Card>
            <Text style={styles.recentTitle}>📥 Nuevas solicitudes</Text>
            <Text style={styles.recentTime}>Hace 5 minutos</Text>
            <Text style={styles.recentDesc}>Electricidad - Reparación de toma corriente</Text>
          </Card>
          <Card>
            <Text style={styles.recentTitle}>✓ Trabajo completado</Text>
            <Text style={styles.recentTime}>Hoy a las 2:45 PM</Text>
            <Text style={styles.recentDesc}>Plomería - Reparación de caño</Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ PROFESSIONAL REQUESTS SCREEN ============
export const ProfessionalRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const items = await apiService.getRequests();
      if (!mounted) return;
      setRequests(items || []);
      setLoading(false);
    };
    load();
    return () => (mounted = false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContent}>
          <Text style={styles.screenTitle}>Solicitudes</Text>
          <Text style={styles.subtitle2}>{requests.length} nuevas</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : requests.length === 0 ? (
          <Text style={{ color: COLORS.textMuted, padding: SPACING.lg }}>No hay nuevas solicitudes.</Text>
        ) : (
          requests.map(req => (
            <Card key={req.id}>
              <View style={styles.requestHeader}>
                <View>
                  <Text style={styles.requestClient}>{req.client || req.userName}</Text>
                  <Badge 
                    text={req.category || req.service} 
                    variant="info"
                  />
                </View>
                {req.urgent && <Badge text="⚡ Urgente" variant="danger" />}
              </View>

              <Text style={styles.requestDesc}>{req.description}</Text>
              <View style={styles.requestMeta}>
                <Ionicons name="location" size={14} color={COLORS.textMuted} />
                <Text style={styles.requestLocation}>{req.location || ''}</Text>
                <Text style={styles.requestTime}>• {req.time || ''}</Text>
              </View>

              <View style={styles.requestActions}>
                <Button 
                  title="✅ Aceptar"
                  onPress={() => navigation.navigate('ProfessionalChat')}
                />
                <Button 
                  title="❌ Rechazar"
                  variant="danger"
                  onPress={() => {}}
                />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ PROFESSIONAL AGENDA SCREEN ============
export const ProfessionalAgendaScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('week');
  const [scheduled, setScheduled] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const items = await apiService.getReservations();
      if (!mounted) return;
      setScheduled(items || []);
      setLoading(false);
    };
    load();
    return () => (mounted = false);
  }, []);

  const statusColors = {
    'Confirmada': COLORS.success,
    'Pendiente': COLORS.warning,
    'En curso': COLORS.info,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContent}>
          <Text style={styles.screenTitle}>Agenda</Text>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'week' && styles.activeTab]}
            onPress={() => setSelectedTab('week')}
          >
            <Text style={[styles.tabText, selectedTab === 'week' && { color: COLORS.primary, fontWeight: '600' }]}>
              📅 Semana
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'month' && styles.activeTab]}
            onPress={() => setSelectedTab('month')}
          >
            <Text style={[styles.tabText, selectedTab === 'month' && { color: COLORS.primary, fontWeight: '600' }]}>
              📆 Mes
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : scheduled.length === 0 ? (
          <Text style={{ color: COLORS.textMuted, padding: SPACING.lg }}>No tienes eventos en la agenda.</Text>
        ) : (
          scheduled.map(item => (
            <Card key={item.id}>
              <View style={styles.agendaItem}>
                <View style={styles.agendaTime}>
                  <Text style={styles.agendaDate}>{item.date}</Text>
                  <Text style={styles.agendaHour}>{item.time}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: SPACING.lg }}>
                  <Text style={styles.agendaClient}>{item.client || item.userName}</Text>
                  <Text style={styles.agendaService}>{item.service || item.category}</Text>
                  <Text style={styles.agendaCost}>{item.cost || ''}</Text>
                  <Badge text={item.status || 'Pendiente'} variant={item.status === 'Confirmada' ? 'success' : 'warning'} />
                </View>
              </View>
              <View style={styles.agendaActions}>
                <Button title="✓" variant="success" />
                <Button title="📝" variant="secondary" />
                <Button title="✕" variant="danger" />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ PROFESSIONAL CHAT SCREEN ============
export const ProfessionalChatScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const items = await apiService.getConversations();
      if (!mounted) return;
      setConversations(items || []);
      setLoading(false);
    };
    load();
    return () => (mounted = false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContent}>
          <Text style={styles.screenTitle}>Mensajes</Text>
          <Text style={styles.subtitle2}>{conversations.length} conversaciones</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : conversations.length === 0 ? (
          <Text style={{ color: COLORS.textMuted, padding: SPACING.lg }}>No tienes conversaciones aún.</Text>
        ) : (
          conversations.map(conv => (
            <TouchableOpacity 
              key={conv.id}
              style={styles.conversationItem}
              onPress={() => navigation.navigate('ChatDetail', { conversation: conv })}
            >
              <Avatar initials={(conv.name || 'U').charAt(0)} size="md" />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <View style={styles.convHeader}>
                  <Text style={styles.convName}>{conv.name}</Text>
                  <Text style={styles.convTime}>{conv.time || ''}</Text>
                </View>
                <Text style={styles.convMsg} numberOfLines={1}>{conv.lastMsg}</Text>
              </View>
              {conv.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{conv.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ PROFESSIONAL PROFILE SCREEN ============
export const ProfessionalProfileScreen = ({ navigation }) => {
  const { logout, user } = useAuth();
  const name = user?.name || 'Profesional';
  const specialty = user?.specialty || 'Especialista';
  const phone = user?.phone || 'No especificado';
  const email = user?.email || 'No especificado';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Avatar initials={(name.charAt(0) || 'P').toUpperCase()} size="xl" bgColor={COLORS.success} />
          <Text style={styles.profName}>{name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={COLORS.warning} />
            <Text style={styles.profRating}>4.8/5.0 (342 reseñas)</Text>
          </View>
          <View style={styles.badgesRow}>
            <Badge text="⭐ Premium" variant="warning" />
            <Badge text="✓ Verificado" variant="success" />
          </View>
        </View>

        <Card>
          <Text style={styles.cardTitle}>📝 Información</Text>
          <View style={styles.prefItem}>
            <Text style={{ fontWeight: '600' }}>Email</Text>
            <Text style={{ color: COLORS.textMuted }}>{email}</Text>
          </View>
          <View style={styles.prefItem}>
            <Text style={{ fontWeight: '600' }}>Teléfono</Text>
            <Text style={{ color: COLORS.textMuted }}>{phone}</Text>
          </View>
          <View style={styles.prefItem}>
            <Text style={{ fontWeight: '600' }}>Especialidad</Text>
            <Text style={{ color: COLORS.textMuted }}>{specialty}</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>🏆 Especialidades</Text>
          <View style={styles.specialtiesList}>
            <Badge text={specialty} variant="primary" />
            <Badge text="Reparaciones" variant="primary" />
            <Badge text="Mantenimiento" variant="primary" />
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>🌍 Zonas de servicio</Text>
          {['Asunción', 'San Ysidro', 'Villa Elisa'].map(zone => (
            <Text key={zone} style={styles.zoneItem}>
              📍 {zone}
            </Text>
          ))}
        </Card>

        <View style={styles.actionButtons}>
          <Button title="🏆 Mis trabajos" onPress={() => navigation.navigate('ProfessionalMyWork')} />
          <Button title="✏️ Editar perfil" onPress={() => navigation.navigate('ProfessionalEditProfile')} />
          <Button title="🚪 Cerrar sesión" variant="danger" onPress={() => logout()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ PROFESSIONAL EDIT PROFILE SCREEN ============
export const ProfessionalEditProfileScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [specialty, setSpecialty] = useState(user?.specialty || '');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSaveChanges = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !specialty.trim()) {
      alert('⚠️ Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = {
        ...user,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        specialty: specialty.trim(),
      };

      await updateUser(updatedUser);
      setSuccessMessage('✓ Perfil actualizado exitosamente');
      
      setTimeout(() => {
        setSuccessMessage('');
        navigation.goBack();
      }, 2000);
    } catch (error) {
      console.error('[EditProfile] Error:', error);
      alert('Error al actualizar perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 18, color: COLORS.primary }}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Editar perfil</Text>
          <View style={{ width: 50 }} />
        </View>

        {successMessage && (
          <View style={[styles.banner, { backgroundColor: COLORS.success }]}>
            <Text style={{ color: 'white', fontWeight: '600' }}>{successMessage}</Text>
          </View>
        )}

        <View style={styles.contentPadding}>
          <Card>
            <Text style={styles.cardTitle}>👤 Datos personales</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                style={styles.input}
                placeholder="+595 9xx xxxxxx"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Especialidad</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu especialidad"
                value={specialty}
                onChangeText={setSpecialty}
                editable={!loading}
              />
            </View>
          </Card>

          <View style={{ marginTop: 20 }}>
            <Button 
              title={loading ? "Guardando..." : "Guardar cambios"} 
              onPress={handleSaveChanges}
              disabled={loading}
            />
            <Button 
              title="Cancelar" 
              variant="secondary"
              onPress={() => navigation.goBack()}
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ PROFESSIONAL MY WORK SCREEN (Fotos de trabajos y certificados) ============
export const ProfessionalMyWorkScreen = ({ navigation }) => {
  const [workPhotos, setWorkPhotos] = useState([
    { id: 1, title: 'Instalación eléctrica', date: '2024-01-10', image: '⚡', verified: true },
    { id: 2, title: 'Reparación de caño', date: '2024-01-05', image: '🔧', verified: true },
  ]);
  const [certificates, setCertificates] = useState([
    { id: 1, title: 'Certificado de Electricista', issuer: 'ITC Paraguay', date: '2022-06-15', verified: true },
  ]);
  const [showAddWork, setShowAddWork] = useState(false);
  const [workTitle, setWorkTitle] = useState('');
  const [workDescription, setWorkDescription] = useState('');

  const handleAddWork = () => {
    if (workTitle.trim()) {
      const newWork = {
        id: workPhotos.length + 1,
        title: workTitle,
        date: new Date().toISOString().split('T')[0],
        image: '📸',
        verified: false,
      };
      setWorkPhotos([newWork, ...workPhotos]);
      setWorkTitle('');
      setWorkDescription('');
      setShowAddWork(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContent}>
          <Text style={styles.screenTitle}>🏆 Mis trabajos</Text>
          <Text style={styles.subtitle2}>Galería de trabajos completados y certificados</Text>
        </View>

        {!showAddWork ? (
          <View style={styles.contentPadding}>
            <Button 
              title="+ Agregar trabajo"
              onPress={() => setShowAddWork(true)}
            />
          </View>
        ) : (
          <View style={styles.contentPadding}>
            <Card>
              <Text style={styles.cardTitle}>📸 Nuevo trabajo</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Título del trabajo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Instalación de tomacorrientes"
                  value={workTitle}
                  onChangeText={setWorkTitle}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Descripción (opcional)</Text>
                <TextInput
                  style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                  placeholder="Detalles del trabajo realizado..."
                  value={workDescription}
                  onChangeText={setWorkDescription}
                  multiline
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Adjuntar foto</Text>
                <TouchableOpacity
                  style={[styles.input, { padding: 0, height: 60, justifyContent: 'center' }]}
                  onPress={() => alert('Cámara/Galería disponible en app nativa')}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md }}>
                    <Ionicons name="camera" size={24} color={COLORS.primary} />
                    <Text style={{ marginLeft: SPACING.md, color: COLORS.textMuted }}>
                      Tomar foto o seleccionar
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ gap: SPACING.md }}>
                <Button 
                  title="Guardar trabajo"
                  onPress={handleAddWork}
                />
                <Button 
                  title="Cancelar"
                  variant="secondary"
                  onPress={() => {
                    setShowAddWork(false);
                    setWorkTitle('');
                    setWorkDescription('');
                  }}
                />
              </View>
            </Card>
          </View>
        )}

        <View style={styles.contentPadding}>
          <Text style={[styles.cardTitle, { marginTop: SPACING.lg }]}>📸 Trabajos realizados ({workPhotos.length})</Text>
          {workPhotos.length === 0 ? (
            <Card>
              <Text style={{ color: COLORS.textMuted, textAlign: 'center' }}>
                Aún no has agregado trabajos. ¡Comienza a documentar tus proyectos!
              </Text>
            </Card>
          ) : (
            workPhotos.map(work => (
              <Card key={work.id}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
                      <Text style={{ fontSize: 28 }}>{work.image}</Text>
                      <View>
                        <Text style={{ fontWeight: '600', color: COLORS.text }}>{work.title}</Text>
                        <Text style={{ fontSize: 12, color: COLORS.textMuted }}>{work.date}</Text>
                      </View>
                    </View>
                  </View>
                  {work.verified && (
                    <Badge text="✓ Verificado" variant="success" />
                  )}
                </View>
              </Card>
            ))
          )}

          <Text style={[styles.cardTitle, { marginTop: SPACING.lg }]}>📜 Certificados ({certificates.length})</Text>
          {certificates.length === 0 ? (
            <Card>
              <Text style={{ color: COLORS.textMuted, textAlign: 'center' }}>
                No hay certificados agregados aún.
              </Text>
            </Card>
          ) : (
            certificates.map(cert => (
              <Card key={cert.id}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
                      <Text style={{ fontSize: 24 }}>🎓</Text>
                      <View>
                        <Text style={{ fontWeight: '600', color: COLORS.text }}>{cert.title}</Text>
                        <Text style={{ fontSize: 12, color: COLORS.textMuted }}>{cert.issuer} • {cert.date}</Text>
                      </View>
                    </View>
                  </View>
                  {cert.verified && (
                    <Badge text="✓ Verificado" variant="success" />
                  )}
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ PROFESSIONAL DETAIL SCREEN (Cliente ve perfil de profesional) ============
export const ProfessionalDetailScreen = ({ route, navigation }) => {
  const professional = route?.params?.professional || {
    name: 'Carlos Mendoza',
    rating: 4.8,
    reviews: 342,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="bookmark-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileHeader}>
          <Avatar initials={professional.name.charAt(0)} size="xl" />
          <Text style={styles.profName}>{professional.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={COLORS.warning} />
            <Text style={styles.profRating}>{professional.rating}/5.0 ({professional.reviews})</Text>
          </View>
        </View>

        <Card>
          <Button title="💬 Mensajear" onPress={() => navigation.navigate('ClientChat')} />
        </Card>

        <Card>
          <Button 
            title="📅 Reservar servicio"
            onPress={() => navigation.navigate('RequestService')}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ CHAT DETAIL SCREEN ============
export const ChatDetailScreen = ({ route, navigation }) => {
  const conversation = route?.params?.conversation || { name: 'Cliente' };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.chatHeaderTitle}>{conversation.name}</Text>
        <TouchableOpacity>
          <Ionicons name="call" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.messagesArea}>
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>Hola, ¿cuándo puedes llegar?</Text>
          <Text style={styles.messageTime}>10:30</Text>
        </View>
        <View style={[styles.messageBubble, styles.ownMessage]}>
          <Text style={styles.ownMessageText}>Estoy en camino, llego en 20 minutos</Text>
          <Text style={styles.ownMessageTime}>10:35</Text>
        </View>
      </View>

      <View style={styles.inputArea}>
        <TouchableOpacity>
          <Ionicons name="add-circle" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.input} placeholder="Escribe un mensaje..." />
        <TouchableOpacity>
          <Ionicons name="send" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: SPACING.lg, 
    paddingVertical: SPACING.md,
  },
  headerContent: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  contentPadding: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  greeting: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  subtitle2: { fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.xs },
  screenTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  section: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.md },
  stepIndicator: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  stepNumber: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted, marginBottom: SPACING.sm },
  progressBar: { height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  progress: { height: '100%', backgroundColor: COLORS.primary },
  stepTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, paddingHorizontal: SPACING.lg, marginVertical: SPACING.lg },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  input: { 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    borderRadius: RADIUS.md, 
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  formGroup: { marginBottom: SPACING.md },
  banner: { 
    padding: SPACING.md, 
    marginHorizontal: SPACING.lg, 
    marginBottom: SPACING.md,
    borderRadius: RADIUS.md,
  },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    paddingHorizontal: SPACING.lg, 
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  statCard: { width: '48.5%' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.xs },
  quickActions: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  recentTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  recentTime: { fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.xs },
  recentDesc: { fontSize: 12, color: COLORS.text, marginTop: SPACING.sm },
  requestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  requestClient: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  requestDesc: { fontSize: 13, color: COLORS.text, marginBottom: SPACING.sm },
  requestMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.md },
  requestLocation: { fontSize: 11, color: COLORS.textMuted },
  requestTime: { fontSize: 11, color: COLORS.textMuted },
  requestActions: { flexDirection: 'row', gap: SPACING.md },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg, gap: SPACING.md },
  tab: { flex: 1, paddingVertical: SPACING.md, borderBottomWidth: 2, borderBottomColor: COLORS.border },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center' },
  agendaItem: { flexDirection: 'row', marginBottom: SPACING.md },
  agendaTime: { alignItems: 'center' },
  agendaDate: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
  agendaHour: { fontSize: 12, color: COLORS.text, marginTop: SPACING.xs },
  agendaClient: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  agendaService: { fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.xs },
  agendaCost: { fontSize: 12, fontWeight: '600', color: COLORS.primary, marginTop: SPACING.xs },
  agendaActions: { flexDirection: 'row', gap: SPACING.sm },
  conversationItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: SPACING.lg, 
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  convHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  convName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  convTime: { fontSize: 12, color: COLORS.textMuted },
  convMsg: { fontSize: 12, color: COLORS.textMuted },
  unreadBadge: { backgroundColor: COLORS.danger, borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  unreadText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  profileHeader: { alignItems: 'center', paddingVertical: SPACING.xl, paddingHorizontal: SPACING.lg },
  profName: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginTop: SPACING.md },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.sm },
  profRating: { fontSize: 13, color: COLORS.textMuted },
  badgesRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  cardTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.md },
  profBio: { fontSize: 13, color: COLORS.text, lineHeight: 18 },
  prefItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm },
  specialtiesList: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  zoneItem: { fontSize: 13, color: COLORS.text, paddingVertical: SPACING.xs },
  actionButtons: { gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  chatHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  chatHeaderTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  messagesArea: { flex: 1, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, justifyContent: 'flex-end' },
  messageBubble: { 
    backgroundColor: COLORS.border, 
    borderRadius: RADIUS.lg, 
    padding: SPACING.md, 
    marginBottom: SPACING.md, 
    maxWidth: '80%',
  },
  messageText: { fontSize: 13, color: COLORS.text },
  messageTime: { fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.xs },
  ownMessage: { 
    backgroundColor: COLORS.primary, 
    alignSelf: 'flex-end',
  },
  ownMessageText: { fontSize: 13, color: '#FFF' },
  ownMessageTime: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: SPACING.xs },
  inputArea: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border, gap: SPACING.md },
});
