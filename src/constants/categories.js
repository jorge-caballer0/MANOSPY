export const CATEGORIES = [
  // Hogar
  { id: 1, name: 'Plomería', icon: 'water', color: '#3B82F6' },
  { id: 2, name: 'Electricidad', icon: 'flash', color: '#FBBF24' },
  { id: 3, name: 'Carpintería', icon: 'hammer', color: '#8B5A3C' },
  { id: 4, name: 'Pintura', icon: 'color-palette-outline', color: '#EC4899' },
  { id: 5, name: 'Cerrajería', icon: 'key', color: '#6B7280' },
  { id: 6, name: 'Jardinería', icon: 'leaf', color: '#10B981' },
  { id: 7, name: 'Reparaciones', icon: 'build', color: '#F97316' },
  { id: 8, name: 'Climatización', icon: 'snow', color: '#06B6D4' },

  // Tecnología
  { id: 9, name: 'Reparación PC', icon: 'desktop', color: '#8B5CF6' },
  { id: 10, name: 'Telefonía', icon: 'phone-portrait', color: '#06B6D4' },
  { id: 11, name: 'Instalación Red', icon: 'wifi', color: '#3B82F6' },

  // Vehículos
  { id: 12, name: 'Mecánica', icon: 'settings', color: '#DC2626' },
  { id: 13, name: 'Electricidad Auto', icon: 'flash', color: '#FBBF24' },
  { id: 14, name: 'Lavado', icon: 'water', color: '#0EA5E9' },
  { id: 15, name: 'Detallado', icon: 'sparkles', color: '#F59E0B' },

  // Servicios personales
  { id: 16, name: 'Barbería', icon: 'cut', color: '#DC2626' },
  { id: 17, name: 'Peluquería', icon: 'people', color: '#EC4899' },
  { id: 18, name: 'Masajes', icon: 'body', color: '#06B6D4' },
];

export const PROFESSIONAL_CATEGORIES = [
  'Plomería',
  'Electricidad',
  'Carpintería',
  'Pintura',
  'Cerrajería',
  'Jardinería',
  'Reparaciones',
  'Climatización',
  'Reparación PC',
  'Telefonía',
  'Instalación Red',
  'Mecánica',
  'Electricidad Auto',
  'Lavado',
  'Detallado',
  'Barbería',
  'Peluquería',
  'Masajes',
];

export const getCategoryById = (id) => CATEGORIES.find(cat => cat.id === id);
export const getCategoryByName = (name) => CATEGORIES.find(cat => cat.name === name);
