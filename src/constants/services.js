/**
 * ═══════════════════════════════════════════════════════════════════
 * SERVICIOS Y ESPECIALIDADES - MANOSPY2
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Lista completa de servicios/rubros que pueden ofrecer los profesionales
 */

export const SERVICES = {
  // CONSTRUCCIÓN Y REFORMA
  construction: {
    id: 'construction',
    category: '🏗️ Construcción y Reforma',
    services: [
      'Albañilería',
      'Carpintería',
      'Pintura de interiores',
      'Pintura de exteriores',
      'Tejas y techos',
      'Pisos y azulejos',
      'Puertas y ventanas',
      'Estructuras metálicas',
      'Restauración de fachadas',
      'Demolición y escombros',
    ],
  },

  // PLOMERÍA Y GAS
  plumbing: {
    id: 'plumbing',
    category: '🚿 Plomería y Gas',
    services: [
      'Instalación de tuberías',
      'Reparación de fugas',
      'Desatascos',
      'Instalación de baños',
      'Calefones y termotanques',
      'Instalación de gas',
      'Mantenimiento de sistemas',
      'Inspección de tuberías',
      'Agua caliente sanitaria',
    ],
  },

  // ELECTRICIDAD Y ILUMINACIÓN
  electrical: {
    id: 'electrical',
    category: '⚡ Electricidad',
    services: [
      'Instalación eléctrica',
      'Reparación de averías',
      'Cambio de enchufes',
      'Instalación de luces',
      'Iluminación LED',
      'Circuitos eléctricos',
      'Tableros y distribuidores',
      'Puesta a tierra',
      'Inspección eléctrica',
      'Aire acondicionado eléctrico',
    ],
  },

  // CALEFACCIÓN Y REFRIGERACIÓN
  hvac: {
    id: 'hvac',
    category: '❄️ Aire Acondicionado y Calefacción',
    services: [
      'Instalación de aire acondicionado',
      'Reparación de aires',
      'Mantenimiento de aires',
      'Instalación de calefactores',
      'Reparación de calefactores',
      'Sistemas de ventilación',
      'Limpieza de filtros',
      'Recarga de refrigerante',
      'Instalación de radiadores',
    ],
  },

  // CERRAJERÍA
  locksmith: {
    id: 'locksmith',
    category: '🔐 Cerrajería',
    services: [
      'Apertura de puertas',
      'Instalación de cerraduras',
      'Reparación de cerraduras',
      'Llaves nuevas',
      'Cerraduras de seguridad',
      'Puertas blindadas',
      'Cajas de seguridad',
      'Cerraduras automáticas',
    ],
  },

  // LIMPIEZA
  cleaning: {
    id: 'cleaning',
    category: '🧹 Limpieza y Mantenimiento',
    services: [
      'Limpieza de hogares',
      'Limpieza de oficinas',
      'Limpieza de alfombras',
      'Limpieza de tapicería',
      'Limpieza de ventanas',
      'Desinfección',
      'Limpieza de pisos',
      'Pulido de pisos',
      'Mantenimiento general',
    ],
  },

  // JARDÍN Y PAISAJISMO
  landscaping: {
    id: 'landscaping',
    category: '🌳 Jardinería y Paisajismo',
    services: [
      'Diseño de jardines',
      'Poda de árboles',
      'Mantenimiento de pasto',
      'Plantación de árboles',
      'Instalación de riego',
      'Limpieza de jardines',
      'Compostaje',
      'Control de plagas',
      'Paisajismo',
    ],
  },

  // MUDANZAS Y TRANSPORTES
  moving: {
    id: 'moving',
    category: '📦 Mudanzas y Transportes',
    services: [
      'Mudanzas locales',
      'Mudanzas internacionales',
      'Embalaje profesional',
      'Transporte de carga',
      'Almacenamiento',
      'Desembalaje',
      'Montaje de muebles',
      'Demolición de muebles',
    ],
  },

  // REPARACIÓN DE ELECTRODOMÉSTICOS
  appliances: {
    id: 'appliances',
    category: '🔧 Reparación de Electrodomésticos',
    services: [
      'Reparación de heladeras',
      'Reparación de lavadoras',
      'Reparación de secadoras',
      'Reparación de hornos',
      'Reparación de microondas',
      'Reparación de lavavajillas',
      'Reparación de televisores',
      'Mantenimiento general',
    ],
  },

  // INFORMÁTICA Y TELECOMUNICACIONES
  tech: {
    id: 'tech',
    category: '💻 Informática y Telecomunicaciones',
    services: [
      'Reparación de computadoras',
      'Instalación de software',
      'Antivirus y seguridad',
      'Recuperación de datos',
      'Reparación de celulares',
      'Instalación de internet',
      'Redes y WiFi',
      'Soporte técnico',
      'Mantenimiento preventivo',
    ],
  },

  // SEGURIDAD
  security: {
    id: 'security',
    category: '🔒 Seguridad',
    services: [
      'Instalación de cámaras',
      'Sistemas de alarma',
      'Control de acceso',
      'Video vigilancia',
      'Monitoreo 24/7',
      'Puertas y cercos de seguridad',
      'Bóveda de seguridad',
    ],
  },

  // MASCOTAS
  pets: {
    id: 'pets',
    category: '🐾 Mascotas',
    services: [
      'Aseo de mascotas',
      'Peluquería canina',
      'Servicios veterinarios',
      'Adiestramiento',
      'Guardería de mascotas',
      'Paseos de mascotas',
      'Atención a domicilio',
    ],
  },

  // EDUCACIÓN Y TUTORÍAS
  education: {
    id: 'education',
    category: '📚 Educación y Tutorías',
    services: [
      'Clases particulares',
      'Matemáticas',
      'Idiomas',
      'Programación',
      'Música',
      'Deportes',
      'Arte y diseño',
      'Preparación de exámenes',
    ],
  },

  // ASESORÍAS
  consulting: {
    id: 'consulting',
    category: '📋 Asesorías',
    services: [
      'Asesoría legal',
      'Asesoría contable',
      'Asesoría fiscal',
      'Consultoría empresarial',
      'Recursos humanos',
      'Marketing y publicidad',
      'Finanzas personales',
    ],
  },

  // SERVICIOS DE BELLEZA
  beauty: {
    id: 'beauty',
    category: '💅 Servicios de Belleza',
    services: [
      'Peluquería',
      'Manicure',
      'Pedicure',
      'Depilación',
      'Maquillaje',
      'Tratamientos faciales',
      'Masajes',
      'Spa',
    ],
  },

  // COCINA Y GASTRONOMÍA
  catering: {
    id: 'catering',
    category: '🍳 Gastronomía y Catering',
    services: [
      'Catering para eventos',
      'Chef privado',
      'Repostería',
      'Elaboración de tortas',
      'Comida casera',
      'Dietas especiales',
      'Preparación de eventos',
    ],
  },

  // EVENTOS Y ENTRETENIMIENTO
  events: {
    id: 'events',
    category: '🎉 Eventos y Entretenimiento',
    services: [
      'Organización de eventos',
      'DJ y animación',
      'Decoración',
      'Sonido e iluminación',
      'Fotografía y video',
      'Animadores infantiles',
      'Alquiler de salones',
    ],
  },

  // SALUD Y BIENESTAR
  health: {
    id: 'health',
    category: '⚕️ Salud y Bienestar',
    services: [
      'Fisioterapia',
      'Nutrición',
      'Psicología',
      'Yoga',
      'Pilates',
      'Entrenamiento personal',
      'Rehabilitación',
    ],
  },
};

/**
 * Obtener lista de servicios por categoría
 */
export const getServicesByCategory = (categoryId) => {
  return SERVICES[categoryId]?.services || [];
};

/**
 * Obtener todas las categorías
 */
export const getAllCategories = () => {
  return Object.values(SERVICES).map(cat => ({
    id: cat.id,
    name: cat.category,
    count: cat.services.length,
  }));
};

/**
 * Buscar servicio en todas las categorías
 */
export const searchService = (query) => {
  const results = [];
  Object.values(SERVICES).forEach(category => {
    category.services.forEach(service => {
      if (service.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          service,
          category: category.category,
          categoryId: category.id,
        });
      }
    });
  });
  return results;
};

/**
 * Obtener servicio completo con categoría
 */
export const getServiceDetails = (service) => {
  for (const category of Object.values(SERVICES)) {
    if (category.services.includes(service)) {
      return {
        service,
        category: category.category,
        categoryId: category.id,
      };
    }
  }
  return null;
};
