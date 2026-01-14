import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Avatar, Badge } from '../../components';
import apiService from '../../services';
import { useAuth } from '../../context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, RADIUS, CATEGORIES } from '../../constants';

// ============ CLIENT LOGIN SCREEN ============
export const ClientLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login, register, isLoading } = useAuth();

  const handleLogin = async () => {
    console.log('[ClientLogin] Intentando login con:', { email, password: '***' });
    setError('');
    
    if (!email) {
      const msg = 'Por favor ingresa tu email';
      console.log('[ClientLogin] Validación fallida:', msg);
      setError(msg);
      Alert.alert('Validación', msg);
      return;
    }
    
    if (!password) {
      const msg = 'Por favor ingresa tu contraseña';
      console.log('[ClientLogin] Validación fallida:', msg);
      setError(msg);
      Alert.alert('Validación', msg);
      return;
    }
    
    console.log('[ClientLogin] Llamando login()...');
    const res = await login(email, password);
    console.log('[ClientLogin] Respuesta login:', res);
    
    if (res.ok) {
      console.log('[ClientLogin] ✓ Login exitoso, usuario:', res.user.email);
      setError('');
      Alert.alert('Bienvenido', `Hola ${res.user.name}!`);
      // RootNavigator maneja la navegación automáticamente cuando user cambia
    } else {
      const errMsg = res.error || 'No se pudo iniciar sesión';
      console.log('[ClientLogin] ✗ Login falló:', errMsg);
      setError(errMsg);
      Alert.alert('Error de login', errMsg);
    }
  };

  const handleRegister = async () => {
    console.log('[ClientLogin] Intentando registro con:', { 
      email, 
      name: registerName,
      phone: registerPhone,
      password: password ? '***' : 'no especificada' 
    });
    setError('');
    setSuccessMessage('');
    
    if (!registerName) {
      const msg = 'Por favor ingresa tu nombre completo';
      console.log('[ClientLogin] Validación fallida:', msg);
      setError(msg);
      return;
    }

    if (!email) {
      const msg = 'Por favor ingresa un email';
      console.log('[ClientLogin] Validación fallida:', msg);
      setError(msg);
      return;
    }

    if (!registerPhone) {
      const msg = 'Por favor ingresa tu número de celular';
      console.log('[ClientLogin] Validación fallida:', msg);
      setError(msg);
      return;
    }

    if (!password) {
      const msg = 'Por favor ingresa una contraseña';
      console.log('[ClientLogin] Validación fallida:', msg);
      setError(msg);
      return;
    }

    const res = await register({ 
      email, 
      password, 
      name: registerName,
      phone: registerPhone
    });
    console.log('[ClientLogin] Respuesta registro:', res);
    
    if (!res.ok) {
      const errMsg = res.error || 'No se pudo crear la cuenta';
      console.log('[ClientLogin] ✗ Registro falló:', errMsg);
      setError(errMsg);
    } else {
      console.log('[ClientLogin] ✓ Registro exitoso:', res.user.email);
      setError('');
      setSuccessMessage('✓ Cuenta creada exitosamente. Redirigiendo al login...');
      // Esperar 2 segundos, luego limpiar y volver a login
      setTimeout(() => {
        console.log('[ClientLogin] Volviendo a login...');
        setEmail('');
        setPassword('');
        setRegisterName('');
        setRegisterPhone('');
        setSuccessMessage('');
        setIsRegistering(false);
      }, 2000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{isRegistering ? 'Crear cuenta' : 'Bienvenido'}</Text>
          <Text style={styles.subtitle}>
            {isRegistering ? 'Completa tu información' : 'Inicia sesión como cliente'}
          </Text>
        </View>

        <View style={styles.form}>
          {!isRegistering ? (
            // FORMULARIO DE LOGIN
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                  style={styles.input}
                  placeholder="tu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  editable
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordInput}>
                  <TextInput
                    style={{ flex: 1 }}
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                      name={showPassword ? 'eye' : 'eye-off'} 
                      size={20} 
                      color={COLORS.textMuted} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Button 
                title="Iniciar sesión" 
                onPress={handleLogin}
                loading={isLoading}
              />

              {error ? (
                <View style={{ 
                  marginTop: SPACING.md, 
                  padding: SPACING.md, 
                  backgroundColor: '#FEE', 
                  borderRadius: RADIUS.sm,
                  borderLeftWidth: 4,
                  borderLeftColor: COLORS.danger
                }}>
                  <Text style={{ color: COLORS.danger, fontWeight: '600' }}>⚠️ {error}</Text>
                </View>
              ) : null}

              <TouchableOpacity 
                style={styles.link} 
                onPress={() => {
                  setIsRegistering(true);
                  setError('');
                  setEmail('');
                  setPassword('');
                  setRegisterName('');
                }}
              >
                <Text style={styles.linkText}>¿No tienes cuenta? Regístrate aquí</Text>
              </TouchableOpacity>
            </>
          ) : (
            // FORMULARIO DE REGISTRO
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre completo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tu nombre completo"
                  value={registerName}
                  onChangeText={setRegisterName}
                  editable
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Número de celular</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+595 9xx xxxxxx"
                  value={registerPhone}
                  onChangeText={setRegisterPhone}
                  keyboardType="phone-pad"
                  editable
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                  style={styles.input}
                  placeholder="tu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  editable
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordInput}>
                  <TextInput
                    style={{ flex: 1 }}
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                      name={showPassword ? 'eye' : 'eye-off'} 
                      size={20} 
                      color={COLORS.textMuted} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Button 
                title="Crear cuenta" 
                onPress={handleRegister}
                loading={isLoading}
              />

              {error ? (
                <View style={{ 
                  marginTop: SPACING.md, 
                  padding: SPACING.md, 
                  backgroundColor: '#FEE', 
                  borderRadius: RADIUS.sm,
                  borderLeftWidth: 4,
                  borderLeftColor: COLORS.danger
                }}>
                  <Text style={{ color: COLORS.danger, fontWeight: '600' }}>⚠️ {error}</Text>
                </View>
              ) : null}

              {successMessage ? (
                <View style={{ 
                  marginTop: SPACING.md, 
                  padding: SPACING.md, 
                  backgroundColor: '#EFE', 
                  borderRadius: RADIUS.sm,
                  borderLeftWidth: 4,
                  borderLeftColor: COLORS.success
                }}>
                  <Text style={{ color: COLORS.success, fontWeight: '600' }}>{successMessage}</Text>
                </View>
              ) : null}

              <TouchableOpacity 
                style={styles.link}
                onPress={() => {
                  setIsRegistering(false);
                  setError('');
                  setSuccessMessage('');
                  setEmail('');
                  setPassword('');
                  setRegisterName('');
                  setRegisterPhone('');
                }}
              >
                <Text style={styles.linkText}>← Volver a iniciar sesión</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ CLIENT HOME SCREEN ============
export const ClientHomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const { user } = useAuth();

// Featured professionals section (fetches from apiService)
const FeaturedProfessionalsSection = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const res = await apiService.getProfessionals();
      if (!mounted) return;
      setItems(res || []);
      setLoading(false);
    };
    load();
    return () => (mounted = false);
  }, []);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Profesionales destacados</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ClientSearch')}>
          <Text style={styles.seeMore}>Ver más</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.primary} />
      ) : items.length === 0 ? (
        <Text style={{ color: COLORS.textMuted }}>Aún no hay profesionales disponibles.</Text>
      ) : (
        items.slice(0, 6).map(prof => (
          <TouchableOpacity
            key={prof.id}
            style={styles.professionalCard}
            onPress={() => navigation.navigate('ProfessionalDetail', { professional: prof })}
          >
            <Avatar initials={(prof.name || 'P').charAt(0)} size="md" />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <View style={styles.profHeader}>
                <Text style={styles.profName}>{prof.name}</Text>
                {prof.isPremium && <Badge text="⭐" variant="warning" />}
              </View>
              <Text style={styles.profSpecialty}>{prof.specialty || prof.profession || '-'}</Text>
              <View style={styles.profFooter}>
                <Ionicons name="star" size={14} color={COLORS.warning} />
                <Text style={styles.profRating}>{prof.rating || '—'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Hola, {user?.name || 'Cliente'} 👋</Text>
          <Text style={styles.subtitle2}>¿Qué necesitas hoy?</Text>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar servicio..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías populares</Text>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.slice(0, 6).map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => navigation.navigate('ClientSearch')}
              >
                <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                  <Ionicons name={cat.icon} size={24} color={cat.color} />
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FeaturedProfessionalsSection navigation={navigation} />

        <View style={styles.section}>
          <Button 
            title="⚡ Solicitar servicio urgente"
            onPress={() => navigation.navigate('RequestService')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ CLIENT SEARCH SCREEN ============
export const ClientSearchScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minRating, setMinRating] = useState(0);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchName, setSearchName] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const items = await apiService.getProfessionals();
      if (!mounted) return;
      setResults(items || []);
      setLoading(false);
    };
    load();
    return () => (mounted = false);
  }, []);

  // Filtros aplicados
  const filteredResults = results.filter(prof => {
    // Filtro por nombre
    if (searchName && !prof.name.toLowerCase().includes(searchName.toLowerCase())) return false;
    // Filtro por categoría
    if (selectedCategory && prof.specialty !== CATEGORIES.find(c => c.id === selectedCategory)?.name) return false;
    // Filtro por calificación
    if (prof.rating && prof.rating < minRating) return false;
    // Filtro por ubicación (simple)
    if (searchLocation && !prof.city?.toLowerCase().includes(searchLocation.toLowerCase())) return false;
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>🔍 Buscar profesionales</Text>
          
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Nombre o especialidad</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Carlos, Electricista"
              value={searchName}
              onChangeText={setSearchName}
            />
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>📍 Ubicación</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Asunción, Concepción"
              value={searchLocation}
              onChangeText={setSearchLocation}
            />
            <Card style={{ marginTop: SPACING.sm }}>
              <Text style={{ fontSize: 11, color: COLORS.textMuted }}>
                💡 En la app nativa podrás usar Google Maps para mayor precisión
              </Text>
            </Card>
          </View>

          <TouchableOpacity
            style={{ paddingVertical: SPACING.md }}
            onPress={() => setShowAdvanced(!showAdvanced)}
          >
            <Text style={{ color: COLORS.primary, fontWeight: '600', fontSize: 13 }}>
              {showAdvanced ? '▼ Filtros avanzados' : '▶ Filtros avanzados'}
            </Text>
          </TouchableOpacity>

          {showAdvanced && (
            <>
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Calificación mínima</Text>
                <View style={styles.ratingOptions}>
                  {[0, 4, 4.5, 4.8].map(rating => (
                    <TouchableOpacity
                      key={rating}
                      style={[
                        styles.ratingButton,
                        minRating === rating && { backgroundColor: COLORS.primary },
                      ]}
                      onPress={() => setMinRating(rating)}
                    >
                      <Text style={[
                        styles.ratingButtonText,
                        minRating === rating && { color: '#FFF' },
                      ]}>
                        {rating === 0 ? 'Todos' : rating + '⭐'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Categoría</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACING.lg }}>
                  <View style={{ paddingHorizontal: SPACING.lg, flexDirection: 'row', gap: SPACING.sm }}>
                    {CATEGORIES.map(cat => (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.categoryChip,
                          selectedCategory === cat.id && { backgroundColor: COLORS.primary },
                        ]}
                        onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                      >
                        <Text style={[
                          styles.categoryChipText,
                          selectedCategory === cat.id && { color: '#FFF' },
                        ]}>
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </>
          )}
        </View>

        <View style={styles.resultsSection}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
            <Text style={styles.resultsTitle}>
              {filteredResults.length} {filteredResults.length === 1 ? 'resultado' : 'resultados'}
            </Text>
            {(searchName || searchLocation || selectedCategory || minRating > 0) && (
              <TouchableOpacity
                onPress={() => {
                  setSearchName('');
                  setSearchLocation('');
                  setSelectedCategory(null);
                  setMinRating(0);
                }}
              >
                <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: '600' }}>Limpiar filtros</Text>
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : filteredResults.length === 0 ? (
            <Card>
              <Text style={{ color: COLORS.textMuted, textAlign: 'center' }}>
                {searchName || searchLocation || selectedCategory ? 'No hay profesionales que coincidan con tus filtros.' : 'No hay profesionales disponibles aún.'}
              </Text>
            </Card>
          ) : (
            filteredResults.map(prof => (
              <Card key={prof.id} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Avatar initials={(prof.name || 'P').charAt(0)} size="md" />
                  <View style={{ flex: 1, marginLeft: SPACING.md }}>
                    <Text style={styles.resultName}>{prof.name}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
                      {prof.specialty || 'Especialista'}
                    </Text>
                    <View style={styles.resultRating}>
                      <Ionicons name="star" size={14} color={COLORS.warning} />
                      <Text style={styles.resultRatingText}>{prof.rating || '—'} • {prof.city || 'Asunción'}</Text>
                    </View>
                  </View>
                </View>
                <Button 
                  title="Ver perfil" 
                  variant="secondary"
                  onPress={() => navigation.navigate('ProfessionalDetail', { professional: prof })}
                />
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ CLIENT RESERVATIONS SCREEN ============
export const ClientReservationsScreen = ({ navigation }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const items = await apiService.getReservations();
      if (!mounted) return;
      setReservations(items || []);
      setLoading(false);
    };
    load();
    return () => (mounted = false);
  }, []);

  const statusColors = {
    'Pendiente': COLORS.warning,
    'Confirmada': COLORS.success,
    'Completada': COLORS.textMuted,
    'En curso': COLORS.info,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContent}>
          <Text style={styles.screenTitle}>Mis reservas</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : reservations.length === 0 ? (
          <Text style={{ color: COLORS.textMuted, padding: SPACING.lg }}>No tienes reservas.</Text>
        ) : (
          reservations.map(res => (
            <Card key={res.id}>
              <View style={styles.reservationItem}>
                <Avatar initials={(res.professional || 'P').charAt(0)} size="md" />
                <View style={{ flex: 1, marginLeft: SPACING.md }}>
                  <Text style={styles.resName}>{res.professional || res.professionalName || 'Profesional'}</Text>
                  <Text style={styles.resDate}>{res.date || res.datetime}</Text>
                  <View style={styles.resFooter}>
                    <Text style={styles.resCost}>{res.cost || ''}</Text>
                    <Badge text={res.status || 'Pendiente'} variant={res.status === 'Completada' ? 'success' : res.status === 'Confirmada' ? 'success' : 'warning'} />
                  </View>
                </View>
              </View>
              <View style={styles.resActions}>
                <Button title="Chat" variant="ghost" onPress={() => navigation.navigate('ClientChat')} />
                <Button title="Cancelar" variant="ghost" onPress={() => {}} />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ CLIENT CHAT SCREEN ============
export const ClientChatScreen = ({ navigation }) => {
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
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : conversations.length === 0 ? (
          <Text style={{ color: COLORS.textMuted, padding: SPACING.lg }}>No tienes mensajes aún.</Text>
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
                  <Text style={styles.convTime}>{conv.time}</Text>
                </View>
                <Text style={styles.convMsg} numberOfLines={1}>{conv.lastMsg}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ CLIENT PROFILE SCREEN ============
export const ClientProfileScreen = ({ navigation }) => {
  const { logout, user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Avatar initials={(user?.name?.charAt(0) || 'C').toUpperCase()} size="xl" />
          <Text style={styles.userName}>{user?.name || 'Cliente'}</Text>
          <Text style={styles.userPhone}>{user?.phone || '+595 98 XXX XXXX'}</Text>
          <Text style={{ color: COLORS.textMuted, marginTop: SPACING.sm }}>{user?.email}</Text>
        </View>

        <Card>
          <Text style={styles.cardTitle}>📋 Información</Text>
          <View style={styles.prefItem}>
            <Text style={{ fontWeight: '600' }}>Email</Text>
            <Text style={{ color: COLORS.textMuted }}>{user?.email}</Text>
          </View>
          <View style={styles.prefItem}>
            <Text style={{ fontWeight: '600' }}>Teléfono</Text>
            <Text style={{ color: COLORS.textMuted }}>{user?.phone || 'No especificado'}</Text>
          </View>
          <View style={styles.prefItem}>
            <Text style={{ fontWeight: '600' }}>Ubicación</Text>
            <Text style={{ color: COLORS.textMuted }}>{user?.city || 'No especificada'}</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>📋 Historial</Text>
          <Text style={styles.cardText}>0 servicios completados</Text>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>🔧 Preferencias</Text>
          <View style={styles.prefItem}>
            <Text>Notificaciones</Text>
            <Text style={{ color: COLORS.success }}>✓ Activadas</Text>
          </View>
          <View style={styles.prefItem}>
            <Text>Idioma</Text>
            <Text>Español</Text>
          </View>
        </Card>

        <View style={styles.actionButtons}>
          <Button title="Editar perfil" onPress={() => navigation.navigate('ClientEditProfile')} />
          <Button title="Cerrar sesión" variant="danger" onPress={() => logout()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ EDIT PROFILE SCREEN ============
export const ClientEditProfileScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSaveChanges = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
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
        city: city.trim(),
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
              <Text style={styles.label}>Ciudad</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu ciudad"
                value={city}
                onChangeText={setCity}
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

// ============ REQUEST SERVICE SCREEN ============
export const RequestServiceScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [urgency, setUrgency] = useState('normal');

  const handlePhotoUpload = () => {
    // Placeholder para subida de fotos
    setPhotoUri('photo_placeholder');
    alert('Función de cámara/galería disponible en app nativa');
  };

  const selectedCategoryName = CATEGORIES.find(c => c.id === selectedCategory)?.name || '';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>Paso {step} de 4</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${(step / 4) * 100}%` }]} />
          </View>
        </View>

        {step === 1 && (
          <View style={styles.contentPadding}>
            <Text style={styles.stepName}>🏷️ Selecciona la categoría</Text>
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory === cat.id && styles.selectedCategory,
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Ionicons name={cat.icon} size={28} color={cat.color} />
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ gap: SPACING.md, marginTop: SPACING.lg }}>
              <Button 
                title="Siguiente"
                onPress={() => setStep(2)}
                disabled={!selectedCategory}
              />
              <Button 
                title="Cancelar"
                variant="secondary"
                onPress={() => navigation.goBack()}
              />
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.contentPadding}>
            <Text style={styles.stepName}>📍 Ubicación del servicio</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Dirección</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Asunción, Paraguay"
                value={location}
                onChangeText={setLocation}
              />
            </View>
            <Card>
              <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
                💡 Selecciona tu ubicación en el mapa para mayor precisión (disponible en app nativa)
              </Text>
            </Card>
            <View style={{ gap: SPACING.md, marginTop: SPACING.lg }}>
              <Button 
                title="Siguiente"
                onPress={() => setStep(3)}
                disabled={!location.trim()}
              />
              <Button 
                title="Atrás"
                variant="secondary"
                onPress={() => setStep(1)}
              />
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.contentPadding}>
            <Text style={styles.stepName}>📝 Describe el problema</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Descripción detallada</Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Cuéntanos qué necesitas con detalle..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Urgencia</Text>
              <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                {['normal', 'moderada', 'urgente'].map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.urgencyButton,
                      urgency === level && { backgroundColor: COLORS.primary }
                    ]}
                    onPress={() => setUrgency(level)}
                  >
                    <Text style={[
                      { fontSize: 12, fontWeight: '600' },
                      urgency === level && { color: '#FFF' }
                    ]}>
                      {level === 'normal' ? '⏱️ Normal' : level === 'moderada' ? '⚠️ Moderada' : '🔴 Urgente'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Presupuesto estimado (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 100000"
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Adjuntar foto (opcional)</Text>
              <TouchableOpacity
                style={[styles.input, { padding: 0, height: 60, justifyContent: 'center' }]}
                onPress={handlePhotoUpload}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md }}>
                  <Ionicons name="camera" size={24} color={COLORS.primary} />
                  <Text style={{ marginLeft: SPACING.md, color: COLORS.textMuted }}>
                    {photoUri ? '✓ Foto agregada' : 'Tomar foto o seleccionar'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ gap: SPACING.md, marginTop: SPACING.lg }}>
              <Button 
                title="Siguiente"
                onPress={() => setStep(4)}
                disabled={!description.trim()}
              />
              <Button 
                title="Atrás"
                variant="secondary"
                onPress={() => setStep(2)}
              />
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.contentPadding}>
            <Text style={styles.stepName}>✓ Confirma tu solicitud</Text>
            <Card>
              <Text style={styles.cardTitle}>📋 Resumen</Text>
              <View style={{ marginBottom: SPACING.md }}>
                <View style={styles.prefItem}>
                  <Text style={{ fontWeight: '600' }}>Categoría:</Text>
                  <Text style={{ color: COLORS.textMuted }}>{selectedCategoryName}</Text>
                </View>
                <View style={styles.prefItem}>
                  <Text style={{ fontWeight: '600' }}>Ubicación:</Text>
                  <Text style={{ color: COLORS.textMuted }}>{location}</Text>
                </View>
                <View style={styles.prefItem}>
                  <Text style={{ fontWeight: '600' }}>Urgencia:</Text>
                  <Text style={{ color: COLORS.textMuted }}>
                    {urgency === 'normal' ? 'Normal' : urgency === 'moderada' ? 'Moderada' : 'Urgente'}
                  </Text>
                </View>
                {budget && (
                  <View style={styles.prefItem}>
                    <Text style={{ fontWeight: '600' }}>Presupuesto:</Text>
                    <Text style={{ color: COLORS.textMuted }}>Gs. {budget}</Text>
                  </View>
                )}
                {photoUri && (
                  <View style={styles.prefItem}>
                    <Text style={{ fontWeight: '600' }}>Foto:</Text>
                    <Text style={{ color: COLORS.success }}>✓ Adjuntada</Text>
                  </View>
                )}
              </View>
              <View style={{ backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: RADIUS.md }}>
                <Text style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 18 }}>
                  <Text style={{ fontWeight: '600' }}>Descripción:</Text>{'\n'}{description}
                </Text>
              </View>
            </Card>

            <View style={{ gap: SPACING.md, marginTop: SPACING.lg, marginBottom: SPACING.xl }}>
              <Button 
                title="✉️ Enviar solicitud"
                onPress={() => {
                  alert('✓ Solicitud enviada exitosamente!');
                  navigation.goBack();
                }}
              />
              <Button 
                title="Atrás"
                variant="secondary"
                onPress={() => setStep(3)}
              />
            </View>
          </View>
        )}
      </ScrollView>
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
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.sm },
  subtitle2: { fontSize: 14, color: COLORS.textMuted },
  form: { gap: SPACING.md, marginVertical: SPACING.lg },
  inputGroup: { marginBottom: SPACING.md },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  input: { 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    borderRadius: RADIUS.md, 
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  passwordInput: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    borderRadius: RADIUS.md, 
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  link: { alignItems: 'center', marginTop: SPACING.lg },
  linkText: { color: COLORS.primary, fontWeight: '600' },
  headerContent: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  contentPadding: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  formGroup: { marginBottom: SPACING.md },
  banner: { 
    padding: SPACING.md, 
    marginHorizontal: SPACING.lg, 
    marginBottom: SPACING.md,
    borderRadius: RADIUS.md,
  },
  screenTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  greeting: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: SPACING.lg, 
    marginBottom: SPACING.lg,
    borderWidth: 1, 
    borderColor: COLORS.border, 
    borderRadius: RADIUS.md, 
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  searchInput: { flex: 1, paddingVertical: SPACING.md, marginLeft: SPACING.sm },
  section: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  seeMore: { color: COLORS.primary, fontWeight: '600' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md, marginBottom: SPACING.lg },
  categoryItem: { 
    width: '31%', 
    alignItems: 'center', 
    padding: SPACING.md, 
    backgroundColor: COLORS.surface, 
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedCategory: { borderColor: COLORS.primary, borderWidth: 2 },
  categoryIcon: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  categoryName: { fontSize: 12, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  professionalCard: { 
    flexDirection: 'row', 
    padding: SPACING.md, 
    backgroundColor: COLORS.surface, 
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  profName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  profSpecialty: { fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.xs },
  profFooter: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  profRating: { fontSize: 11, color: COLORS.textMuted },
  profDistance: { fontSize: 11, color: COLORS.textMuted },
  filterSection: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  filterTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.md },
  filterGroup: { marginBottom: SPACING.lg },
  filterLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  ratingOptions: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  ratingButton: { 
    paddingHorizontal: SPACING.md, 
    paddingVertical: SPACING.sm, 
    borderRadius: RADIUS.md, 
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ratingButtonText: { fontSize: 12, color: COLORS.text },
  categoryChip: { 
    paddingHorizontal: SPACING.md, 
    paddingVertical: SPACING.sm, 
    borderRadius: RADIUS.md, 
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  categoryChipText: { fontSize: 12, color: COLORS.text },
  resultsSection: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  resultsTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.md },
  resultCard: { marginBottom: SPACING.md },
  resultHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  resultName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  resultRating: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.xs },
  resultRatingText: { fontSize: 11, color: COLORS.textMuted },
  screenTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  reservationItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.md },
  resName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  resDate: { fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.xs },
  resFooter: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginTop: SPACING.sm },
  resCost: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },
  resActions: { flexDirection: 'row', gap: SPACING.sm },
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
  profileHeader: { alignItems: 'center', paddingVertical: SPACING.xl, paddingHorizontal: SPACING.lg },
  userName: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: SPACING.md },
  userPhone: { fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.xs },
  cardTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  cardText: { fontSize: 12, color: COLORS.textMuted },
  prefItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm },
  actionButtons: { gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg },
  stepHeader: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  stepTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.md },
  progressBar: { height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  progress: { height: '100%', backgroundColor: COLORS.primary },
  stepName: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, marginBottom: SPACING.md },
  descriptionInput: { 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    borderRadius: RADIUS.md, 
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.lg,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  estimate: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginTop: SPACING.md },
  urgencyButton: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
