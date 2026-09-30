import valeriaImg from '@/src/assets/images/student_valeria_portrait_1790743232883.jpg';
import mateoImg from '@/src/assets/images/student_mateo_portrait_1790743248404.jpg';
import roboticaImg from '@/src/assets/images/group_robotica_tech_1790743264536.jpg';
import campusGroupImg from '@/src/assets/images/group_campus_social_1790743274760.jpg';
import { User, Group, Match, ChatMessage } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_valeria',
    name: 'Valeria Morales',
    age: 21,
    phone: '+52 55 4910 2345',
    university: 'UNAM (Facultad de Medicina)',
    career: 'Médico Cirujano',
    semester: 6,
    photoUrl: valeriaImg,
    bio: 'Sobreviviendo a farmacología con litros de café americano ☕. Si te gusta el tenis, Taylor Swift o escaparte a museos los domingos, ya tenemos tema de conversación.',
    interests: ['Medicina', 'Café de especialidad', 'Taylor Swift', 'Tenis', 'Museos', 'Gatos'],
    verificationStatus: 'approved',
    registeredAt: '2026-09-15T10:30:00Z',
    blindBio: 'Soy la que siempre tiene apuntes organizados por colores. Busco a alguien para platicar de cosas random y compartir postres sin pretensiones.',
    blindIdealSpot: 'Jardines de la Biblioteca Central o la cafetería de Ciencias.',
    role: 'student'
  },
  {
    id: 'user_mateo',
    name: 'Mateo Silva',
    age: 22,
    phone: '+52 81 1234 5678',
    university: 'Tecnológico de Monterrey',
    career: 'Ing. en Mecatrónica & IA',
    semester: 7,
    photoUrl: mateoImg,
    bio: 'Construyendo robots en el día y escuchando rock indie de noche 🎸🤖. Fan del gimnasio y los torneos de ajedrez relámpago.',
    interests: ['Robótica', 'Anime', 'Gimnasio', 'Rock Indie', 'Ajedrez', 'Tecnología'],
    verificationStatus: 'approved',
    registeredAt: '2026-09-18T14:10:00Z',
    blindBio: 'No me juzgues por mis playlists eclécticas. Me gusta escuchar historias de personas apasionadas por lo que estudian.',
    blindIdealSpot: 'Bancas bajo los árboles del Campus Sur con un bubble tea.',
    role: 'student'
  },
  {
    id: 'user_camila',
    name: 'Camila Reyes',
    age: 20,
    phone: '+52 55 7766 8899',
    university: 'Universidad Iberoamericana',
    career: 'Diseño y Comunicación Visual',
    semester: 4,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Fotógrafa de 35mm aficionada, fan del cine independiente y coleccionista de chamarras vintage. Siempre buscando la mejor cafetería cerca del campus.',
    interests: ['Fotografía', 'Cine de Arte', 'Moda vintage', 'Café', 'Ilustración'],
    verificationStatus: 'approved',
    registeredAt: '2026-09-20T09:15:00Z',
    blindBio: 'Tengo una teoría sobre por qué las películas de los 90s tenían mejor paleta de colores. Te dibujo un boceto en una servilleta si nos encontramos.',
    blindIdealSpot: 'El quiosco universitario o las gradas del auditorio.',
    role: 'student'
  },
  {
    id: 'user_diego',
    name: 'Diego Arismendi',
    age: 23,
    phone: '+57 310 987 6543',
    university: 'Universidad Nacional',
    career: 'Arquitectura & Urbanismo',
    semester: 8,
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    bio: 'Siempre con una libreta de bocetos y una maqueta que no cabe en el bus. Fan de salir a rodar en bici por la ciudad y de la música electrónica underground.',
    interests: ['Arquitectura', 'Skate', 'Ciclismo Urbano', 'Electrónica', 'Diseño'],
    verificationStatus: 'approved',
    registeredAt: '2026-09-22T17:40:00Z',
    blindBio: 'Puedo calcular la escala de un edificio a simple vista pero no sé elegir qué comer en la cafetería sin dudar 10 minutos.',
    blindIdealSpot: 'Terraza del edificio de Arquitectura con vista al atardecer.',
    role: 'student'
  },
  {
    id: 'user_lucia',
    name: 'Lucía Fernández',
    age: 21,
    phone: '+54 11 4455 6677',
    university: 'Universidad de Buenos Aires (UBA)',
    career: 'Psicología',
    semester: 5,
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    bio: 'No te voy a psicoanalizar en la primera cita (o tal vez un poquito 👀). Me gusta el mate amargo, el teatro experimental y salir a caminar sin rumbo fijo.',
    interests: ['Psicología', 'Teatro', 'Yoga', 'Filosofía', 'Mate', 'Viajes'],
    verificationStatus: 'approved',
    registeredAt: '2026-09-23T11:20:00Z',
    blindBio: 'Hablemos de tus teorías conspirativas favoritas o de por qué todos los estudiantes tenemos crisis existencial a mitad de carrera.',
    blindIdealSpot: 'Plaza frente a la facultad con café o mate.',
    role: 'student'
  },
  {
    id: 'user_santiago',
    name: 'Santiago Peña',
    age: 22,
    phone: '+56 9 8765 4321',
    university: 'Pontificia Universidad Católica',
    career: 'Ingeniería en Computación',
    semester: 6,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Pasando noches enteras en hackathons y fines de semana en la montaña. Busco a alguien para jugar videojuegos cooperativos o debatir sobre inteligencia artificial.',
    interests: ['Programación', 'Gaming', 'Senderismo', 'IA', 'Pizza'],
    verificationStatus: 'approved',
    registeredAt: '2026-09-24T16:00:00Z',
    blindBio: 'Puedo enseñarte a automatizar tus tareas de la u si me acompañas por una pizza después de clases.',
    blindIdealSpot: 'Mesas al aire libre del centro tecnológico.',
    role: 'student'
  },
  // PENDING VERIFICATION USERS FOR THE VERIFICATION AUDIT FLOW
  {
    id: 'user_sofia_pending',
    name: 'Sofía Navarro',
    age: 19,
    phone: '+52 55 9182 3456',
    university: 'UNAM (FES Acatlán)',
    career: 'Relaciones Internacionales',
    semester: 2,
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    bio: 'Nueva en el campus y con ganas de conocer gente linda para armar grupo de estudio y salir por tacos después de clases.',
    interests: ['Idiomas', 'Diplomacia', 'Debate', 'Tacos', 'K-pop'],
    verificationStatus: 'pending',
    registeredAt: '2026-09-29T19:30:00Z',
    blindBio: 'Hablo 3 idiomas pero en mi primer día me perdí buscando el salón de clase. Prometo risas aseguradas.',
    blindIdealSpot: 'Área verde frente al edificio de lenguas.',
    role: 'student'
  },
  {
    id: 'user_emiliano_pending',
    name: 'Emiliano Vargas',
    age: 20,
    phone: '+52 33 2211 4433',
    university: 'Universidad de Guadalajara (CUCEI)',
    career: 'Química Farmacéutica',
    semester: 3,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Amante de la síntesis orgánica y los atardeceres. Me encanta el voleibol universitario.',
    interests: ['Química', 'Voleibol', 'Ciencia', 'Música Latina'],
    verificationStatus: 'pending',
    registeredAt: '2026-09-29T20:15:00Z',
    blindBio: 'Tengo bata de laboratorio y muchas ganas de conocer a alguien fuera de mi carrera.',
    blindIdealSpot: 'Explanada de laboratorios.',
    role: 'student'
  },
  // CURRENT LOGGED IN USER DEFAULT (Can be switched)
  {
    id: 'user_current',
    name: 'Rodrigo Méndez',
    age: 21,
    phone: '+52 55 8392 0192',
    university: 'UNAM (Facultad de Ingeniería)',
    career: 'Ingeniería en Computación',
    semester: 5,
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    bio: 'Estudiante de ingeniería, fan de las pizzas a medianoche, los maratones de series y los proyectos locos de software. ¿Un café entre clases?',
    interests: ['Tecnología', 'Anime', 'Café', 'Música', 'Gimnasio', 'Cine'],
    verificationStatus: 'approved',
    registeredAt: '2026-09-10T12:00:00Z',
    blindBio: 'Soy introvertido al principio pero después de un café no paro de hablar. Me gustan los planes espontáneos.',
    blindIdealSpot: 'Cafetería de Ingeniería o bancas del Anexo.',
    role: 'student'
  },
  // ADMIN USER
  {
    id: 'user_admin',
    name: 'Moderación Campus Campy',
    age: 26,
    phone: '+52 55 0000 9999',
    university: 'Equipo Oficial Campy Universitario',
    career: 'Comité de Seguridad y Verificación',
    semester: 10,
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80',
    bio: 'Administrador oficial de Campy. Auditando carnés y asegurando un campus libre de perfiles falsos.',
    interests: ['Seguridad', 'Comunidad Universitaria'],
    verificationStatus: 'approved',
    registeredAt: '2026-01-01T00:00:00Z',
    role: 'admin'
  }
];

export const INITIAL_GROUPS: Group[] = [
  {
    id: 'group_robotica',
    name: 'Club de Robótica, IA & Hardware Libre',
    description: 'Comunidad inter-facultades para construir proyectos autónomos, drones, mini-sumos y competir en torneos universitarios. ¡Todos los niveles bienvenidos!',
    category: 'Robótica & Tech',
    coverUrl: roboticaImg,
    creatorId: 'user_mateo',
    adminIds: ['user_mateo', 'user_current'],
    memberIds: ['user_mateo', 'user_current', 'user_santiago', 'user_valeria'],
    membersCount: 342,
    upvotesCount: 289,
    activeRecentCount: 28,
    createdAt: '2026-09-01T10:00:00Z',
    tags: ['Robótica', 'Arduino', 'Python', 'IA', 'Electrónica']
  },
  {
    id: 'group_campus_social',
    name: 'Integración Campus & Planes Universitarios',
    description: '¿No tienes plan para el viernes después de exámenes? Aquí organizamos salidas a comer, juegos de mesa en los jardines, picnic y desconexión.',
    category: 'Integración Campus',
    coverUrl: campusGroupImg,
    creatorId: 'user_current',
    adminIds: ['user_current', 'user_valeria'],
    memberIds: ['user_current', 'user_valeria', 'user_camila', 'user_diego', 'user_lucia'],
    membersCount: 489,
    upvotesCount: 412,
    activeRecentCount: 45,
    createdAt: '2026-08-25T14:30:00Z',
    tags: ['Campus', 'Amigos', 'Picnic', 'Juegos de Mesa', 'Tardes']
  },
  {
    id: 'group_otaku',
    name: 'Anime, Manga & Gaming Campus',
    description: 'El refugio para discutir episodios de temporada, recomendaciones de manga, cosplay universitario y torneos de Smash y Mario Kart entre clases.',
    category: 'Anime & Otaku',
    coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    creatorId: 'user_mateo',
    adminIds: ['user_mateo'],
    memberIds: ['user_mateo', 'user_current', 'user_santiago'],
    membersCount: 215,
    upvotesCount: 198,
    activeRecentCount: 19,
    createdAt: '2026-09-05T12:00:00Z',
    tags: ['Anime', 'Manga', 'Gaming', 'Smash Bros', 'Cultura Pop']
  },
  {
    id: 'group_cafe_lectura',
    name: 'Club del Café, Libros & Tesis Survival',
    description: 'Encontrémonos en las cafeterías más tranquilas para leer juntos, prestarnos libros y no volvernos locos redactando los informes finales.',
    category: 'Club de Lectura & Café',
    coverUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    creatorId: 'user_valeria',
    adminIds: ['user_valeria', 'user_lucia'],
    memberIds: ['user_valeria', 'user_lucia', 'user_camila'],
    membersCount: 178,
    upvotesCount: 154,
    activeRecentCount: 14,
    createdAt: '2026-09-08T18:00:00Z',
    tags: ['Lectura', 'Café', 'Estudio', 'Filosofía', 'Relax']
  },
  {
    id: 'group_deportes',
    name: 'Fútbol 7, Voley & Running Universitario',
    description: 'Rentas de canchas entre semana, partidos amistosos los jueves y grupos para trotar en la pista de atletismo a las 7am.',
    category: 'Deportes & Fitness',
    coverUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    creatorId: 'user_diego',
    adminIds: ['user_diego'],
    memberIds: ['user_diego', 'user_santiago', 'user_current'],
    membersCount: 310,
    upvotesCount: 220,
    activeRecentCount: 22,
    createdAt: '2026-09-12T08:00:00Z',
    tags: ['Fútbol', 'Voley', 'Fitness', 'Canchas', 'Entrenamiento']
  },
  {
    id: 'group_fiesta',
    name: 'Jueves Universitarios & Noche de Música',
    description: 'Coordinación de los mejores spots cerca del campus para celebrar el fin de semana, bandas en vivo, terrazas y promociones para estudiantes.',
    category: 'Fiesta & Vida Nocturna',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    creatorId: 'user_camila',
    adminIds: ['user_camila'],
    memberIds: ['user_camila', 'user_diego', 'user_current'],
    membersCount: 265,
    upvotesCount: 180,
    activeRecentCount: 31,
    createdAt: '2026-09-14T21:00:00Z',
    tags: ['Jueves de Campus', 'Música', 'Fiesta', 'Bandas', 'After']
  }
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'match_trad_1',
    user1Id: 'user_current',
    user2Id: 'user_valeria',
    type: 'traditional',
    matchedAt: '2026-09-28T16:20:00Z',
    lastMessage: 'Jaja justo salgo del lab de biología, ¿estás por las islas?',
    lastMessageTime: 'Hace 25 min',
    unreadCount: 1
  },
  {
    id: 'match_blind_1',
    user1Id: 'user_current',
    user2Id: 'user_lucia',
    type: 'blind',
    matchedAt: '2026-09-29T11:45:00Z',
    lastMessage: '¡Hola! Qué curioso este modo a ciegas, vi que te gusta el cine también',
    lastMessageTime: 'Hace 2 h',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'match_trad_1': [
    {
      id: 'm1_1',
      roomId: 'match_trad_1',
      senderId: 'user_current',
      senderName: 'Rodrigo',
      content: '¡Hola Valeria! Qué coincidencia, vi que estás en Medicina en CU. ¿Cómo sobrevivieron al examen de esta semana?',
      timestamp: 'Ayer 18:30'
    },
    {
      id: 'm1_2',
      roomId: 'match_trad_1',
      senderId: 'user_valeria',
      senderName: 'Valeria Morales',
      content: '¡Hola Rodrigo! Casi morimos todos con farmacología jajaja pero logramos salir vivos 😅 ¿Tú estás en ingeniería?',
      timestamp: 'Ayer 18:42'
    },
    {
      id: 'm1_3',
      roomId: 'match_trad_1',
      senderId: 'user_current',
      senderName: 'Rodrigo',
      content: 'Sí, en computación en el anexo. ¿Vas seguido por la cafetería central?',
      timestamp: 'Hoy 14:10'
    },
    {
      id: 'm1_4',
      roomId: 'match_trad_1',
      senderId: 'user_valeria',
      senderName: 'Valeria Morales',
      content: 'Jaja justo salgo del lab de biología, ¿estás por las islas?',
      timestamp: 'Hoy 14:25'
    }
  ],
  'match_blind_1': [
    {
      id: 'mb_sys_1',
      roomId: 'match_blind_1',
      senderId: 'system',
      senderName: 'Campy Seguridad',
      content: 'Este chat fue creado para encontrarse y tener una cita a ciegas. Por favor, acuerden verse en un lugar público dentro o fuera del campus para la seguridad de ambos.',
      timestamp: 'Hoy 11:45',
      isSystem: true
    },
    {
      id: 'mb_1',
      roomId: 'match_blind_1',
      senderId: 'user_lucia',
      senderName: 'Estudiante de Psicología (UBA)',
      content: '¡Hola! Qué curioso este modo a ciegas, vi que te gusta el cine también y los planes tranquilos.',
      timestamp: 'Hoy 11:50'
    }
  ],
  'group_robotica': [
    {
      id: 'gr_1',
      roomId: 'group_robotica',
      senderId: 'user_mateo',
      senderName: 'Mateo Silva',
      content: '¡Hola a todos! Este viernes tendremos sesión de diseño de chasis en impresión 3D a las 4pm en el lab 2.',
      timestamp: 'Ayer 16:00'
    },
    {
      id: 'gr_2',
      roomId: 'group_robotica',
      senderId: 'user_santiago',
      senderName: 'Santiago Peña',
      content: 'Excelente, yo llevo los servomotores y las placas ESP32 para probar la telemetría.',
      timestamp: 'Ayer 16:15'
    },
    {
      id: 'gr_3',
      roomId: 'group_robotica',
      senderId: 'user_current',
      senderName: 'Rodrigo Méndez',
      content: '¡Cuenten conmigo! Llevaré el código de control de visión con OpenCV listo.',
      timestamp: 'Hoy 10:05'
    }
  ],
  'group_campus_social': [
    {
      id: 'gc_1',
      roomId: 'group_campus_social',
      senderId: 'user_valeria',
      senderName: 'Valeria Morales',
      content: '¿Alguien libre para un café en el quiosco después de las 3pm? Necesito despejar la mente post-clase.',
      timestamp: 'Hoy 12:20'
    },
    {
      id: 'gc_2',
      roomId: 'group_campus_social',
      senderId: 'user_camila',
      senderName: 'Camila Reyes',
      content: '¡Yo me apunto! Llevo mi cámara para sacar fotos del campus con la luz de la tarde 📸',
      timestamp: 'Hoy 12:35'
    }
  ]
};
