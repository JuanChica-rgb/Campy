export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'banned';

export interface User {
  id: string;
  name: string;
  age: number;
  phone: string;
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
  blindBio?: string; // Prompt for blind dating
  blindIdealSpot?: string;
  role: 'student' | 'admin';
}

export type MatchType = 'traditional' | 'blind';

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  type: MatchType;
  matchedAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  roomId: string; // matchId or groupId
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  content: string;
  timestamp: string;
  isSystem?: boolean;
  isDeleted?: boolean;
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
}

export type ActiveTab = 'traditional' | 'blind' | 'groups' | 'chats' | 'admin' | 'profile';
