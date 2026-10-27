export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'banned';

export type Seeking =
  | 'pareja'
  | 'pareja-abierta'
  | 'veremos'
  | 'nada-serio'
  | 'amigos'
  | 'pensando';

export type InterestIn = 'mujeres' | 'hombres' | 'todos';

export interface User {
  id: string;
  name: string;
  age: number;
  phone: string;
  email?: string;
  adultConfirmed?: boolean;
  university: string;
  career: string;
  semester: number;
  photoUrl: string;
  additionalPhotos?: string[];
  bio: string;
  interests: string[];
  verificationStatus: VerificationStatus;
  registeredAt: string;
  verificationNotes?: string;
  blindBio?: string;
  blindIdealSpot?: string;
  role: 'student' | 'admin';
  gender?: 'mujer' | 'hombre';
  interestIn?: InterestIn;
  seeking?: Seeking;
  groupPlan?: boolean;
  languages?: string[];
  zodiac?: string;
  family?: string;
  communication?: string[];
  love?: string[];
  pets?: string[];
  drinking?: string;
  smoking?: string;
  socials?: string;
  plusUntil?: string;
  privateProfile?: boolean;
}

export interface DiscoveryPrefs {
  interestIn: InterestIn;
  ageMin: number;
  ageMax: number;
  seeking: Seeking;
  languages: string[];
  zodiac: string;
  family: string;
  communication: string[];
  love: string[];
  pets: string[];
  drinking: string;
  smoking: string;
  socials: string;
}

export type MatchType = 'traditional' | 'blind' | 'libre';

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  type: MatchType;
  matchedAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  revealedAt?: string;
  revealRequestedBy?: string;
  revealRequestedAt?: string;
  revealAskUser1At?: string;
  revealAskUser2At?: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  content: string;
  timestamp: string;
  isSystem?: boolean;
  isDeleted?: boolean;
}

export interface Outreach {
  id: string;
  fromId: string;
  toId: string;
  kind: 'superlike' | 'note';
  body?: string;
  createdAt: string;
}

export type GroupCategory =
  | 'Anime & Otaku'
  | 'Robótica & Tech'
  | 'Integración Campus'
  | 'Deportes & Fitness'
  | 'Música & Arte'
  | 'Fiesta & Vida Nocturna'
  | 'Club de Lectura & Café';

export interface Group {
  id: string;
  name: string;
  description: string;
  category: GroupCategory;
  coverUrl: string;
  creatorId: string;
  adminIds: string[];
  memberIds: string[];
  membersCount: number;
  upvotesCount: number;
  activeRecentCount: number;
  createdAt: string;
  tags: string[];
  university: string;
  inviteCode: string;
  bannedIds?: string[];
}

export type ActiveTab =
  | 'traditional'
  | 'planes'
  | 'blind'
  | 'groups'
  | 'likes'
  | 'chats'
  | 'admin'
  | 'profile';
