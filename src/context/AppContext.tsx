import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Group, Match, ChatMessage, ActiveTab, VerificationStatus } from '../types';
import { INITIAL_USERS, INITIAL_GROUPS, INITIAL_MATCHES, INITIAL_MESSAGES } from '../data/mockData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  groups: Group[];
  matches: Match[];
  messages: Record<string, ChatMessage[]>;
  currentTab: ActiveTab;
  setCurrentTab: (tab: ActiveTab) => void;
  
  // Navigation / Modals
  selectedProfileUser: User | null;
  setSelectedProfileUser: (user: User | null) => void;
  activeChatRoomId: string | null;
  activeChatType: 'traditional' | 'blind' | 'group' | null;
  openChat: (roomId: string, type: 'traditional' | 'blind' | 'group') => void;
  closeChat: () => void;
  
  // Match celebration
  matchCelebration: {
    isOpen: boolean;
    user: User | null;
    type: 'traditional' | 'blind';
  };
  closeMatchCelebration: () => void;
  
  // Dialogs
  isRegisterOpen: boolean;
  setIsRegisterOpen: (open: boolean) => void;
  isSwitcherOpen: boolean;
  setIsSwitcherOpen: (open: boolean) => void;
  isCreateGroupOpen: boolean;
  setIsCreateGroupOpen: (open: boolean) => void;
  
  // Actions
  registerUser: (data: Omit<User, 'id' | 'verificationStatus' | 'registeredAt' | 'role'>) => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  banUser: (userId: string) => void;
  
  // Swiping
  swipedUserIds: Set<string>;
  blindSwipedUserIds: Set<string>;
  handleSwipe: (targetUserId: string, action: 'like' | 'pass' | 'superlike', mode: 'traditional' | 'blind') => void;
  resetSwipes: (mode: 'traditional' | 'blind') => void;
  
  // Group actions
  createGroup: (groupData: { name: string; description: string; category: any; coverUrl: string; tags: string[] }) => void;
  upvoteGroup: (groupId: string) => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  deleteGroup: (groupId: string) => void;
  assignGroupAdmin: (groupId: string, memberId: string) => void;
  removeGroupAdmin: (groupId: string, memberId: string) => void;
  kickGroupMember: (groupId: string, memberId: string) => void;
  
  // Chat actions
  sendMessage: (roomId: string, content: string) => void;
  deleteMessage: (roomId: string, messageId: string) => void;
  
  // Metrics helper for admin
  metrics: {
    totalStudents: number;
    pendingCount: number;
    approvedCount: number;
    totalMatches: number;
    blindMatchesCount: number;
    totalGroups: number;
  };

  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage keys
  const STORAGE_USERS = 'campy_users_v2';
  const STORAGE_GROUPS = 'campy_groups_v2';
  const STORAGE_MATCHES = 'campy_matches_v2';
  const STORAGE_MESSAGES = 'campy_messages_v2';
  const STORAGE_CURRENT_USER_ID = 'campy_current_user_id_v2';

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CURRENT_USER_ID);
      return saved || 'user_current';
    } catch {
      return 'user_current';
    }
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_GROUPS);
      return saved ? JSON.parse(saved) : INITIAL_GROUPS;
    } catch {
      return INITIAL_GROUPS;
    }
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MATCHES);
      return saved ? JSON.parse(saved) : INITIAL_MATCHES;
    } catch {
      return INITIAL_MATCHES;
    }
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MESSAGES);
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [currentTab, setCurrentTab] = useState<ActiveTab>('traditional');
  const [swipedUserIds, setSwipedUserIds] = useState<Set<string>>(new Set());
  const [blindSwipedUserIds, setBlindSwipedUserIds] = useState<Set<string>>(new Set());

  // Modals & Active state
  const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);
  const [activeChatRoomId, setActiveChatRoomId] = useState<string | null>(null);
  const [activeChatType, setActiveChatType] = useState<'traditional' | 'blind' | 'group' | null>(null);
  const [matchCelebration, setMatchCelebration] = useState<{ isOpen: boolean; user: User | null; type: 'traditional' | 'blind' }>({
    isOpen: false,
    user: null,
    type: 'traditional'
  });

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GROUPS, JSON.stringify(groups));
    } catch (e) {
      console.error(e);
    }
  }, [groups]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MATCHES, JSON.stringify(matches));
    } catch (e) {
      console.error(e);
    }
  }, [matches]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CURRENT_USER_ID, currentUserId);
    } catch (e) {
      console.error(e);
    }
  }, [currentUserId]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0] || INITIAL_USERS[0];

  const setCurrentUser = (user: User) => {
    setCurrentUserId(user.id);
  };

  const registerUser = (data: Omit<User, 'id' | 'verificationStatus' | 'registeredAt' | 'role'>) => {
    const newUser: User = {
      ...data,
      id: `user_${Date.now()}`,
      verificationStatus: 'pending',
      registeredAt: new Date().toISOString(),
      role: 'student'
    };
    setUsers(prev => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    setIsRegisterOpen(false);
  };

  const approveUser = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, verificationStatus: 'approved' as VerificationStatus } : u))
    );
  };

  const rejectUser = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, verificationStatus: 'rejected' as VerificationStatus } : u))
    );
  };

  const banUser = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, verificationStatus: 'banned' as VerificationStatus } : u))
    );
  };

  const openChat = (roomId: string, type: 'traditional' | 'blind' | 'group') => {
    setActiveChatRoomId(roomId);
    setActiveChatType(type);
  };

  const closeChat = () => {
    setActiveChatRoomId(null);
    setActiveChatType(null);
  };

  const closeMatchCelebration = () => {
    setMatchCelebration({ isOpen: false, user: null, type: 'traditional' });
  };

  const handleSwipe = (targetUserId: string, action: 'like' | 'pass' | 'superlike', mode: 'traditional' | 'blind') => {
    if (mode === 'traditional') {
      setSwipedUserIds(prev => new Set([...prev, targetUserId]));
    } else {
      setBlindSwipedUserIds(prev => new Set([...prev, targetUserId]));
    }

    if (action === 'like' || action === 'superlike') {
      const targetUser = users.find(u => u.id === targetUserId);
      if (!targetUser) return;

      // Realistic student match logic (75% match chance for exciting demo or superlike guaranteed)
      const isMatch = action === 'superlike' || Math.random() < 0.85;

      if (isMatch) {
        const matchId = `match_${mode}_${Date.now()}`;
        const newMatch: Match = {
          id: matchId,
          user1Id: currentUser.id,
          user2Id: targetUserId,
          type: mode,
          matchedAt: new Date().toISOString(),
          lastMessage: mode === 'traditional' ? '¡Hicieron match universitario!' : 'Cita a ciegas activada',
          lastMessageTime: 'Recién',
          unreadCount: 0
        };

        setMatches(prev => [newMatch, ...prev]);

        // If blind date, add the system pinned safety notice message
        if (mode === 'blind') {
          const systemMsg: ChatMessage = {
            id: `sys_${Date.now()}`,
            roomId: matchId,
            senderId: 'system',
            senderName: 'Campy Seguridad',
            content: 'Este chat fue creado para encontrarse y tener una cita a ciegas. Por favor, acuerden verse en un lugar público dentro o fuera del campus para la seguridad de ambos.',
            timestamp: 'Ahora',
            isSystem: true
          };
          setMessages(prev => ({
            ...prev,
            [matchId]: [systemMsg]
          }));
        }

        // Open match celebration modal
        setMatchCelebration({
          isOpen: true,
          user: targetUser,
          type: mode
        });
      }
    }
  };

  const resetSwipes = (mode: 'traditional' | 'blind') => {
    if (mode === 'traditional') {
      setSwipedUserIds(new Set());
    } else {
      setBlindSwipedUserIds(new Set());
    }
  };

  // Group actions
  const createGroup = (groupData: { name: string; description: string; category: any; coverUrl: string; tags: string[] }) => {
    const newGroup: Group = {
      id: `group_${Date.now()}`,
      name: groupData.name,
      description: groupData.description,
      category: groupData.category,
      coverUrl: groupData.coverUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      creatorId: currentUser.id,
      adminIds: [currentUser.id],
      memberIds: [currentUser.id],
      membersCount: 1,
      upvotesCount: 1,
      activeRecentCount: 1,
      createdAt: new Date().toISOString(),
      tags: groupData.tags
    };

    setGroups(prev => [newGroup, ...prev]);
    setIsCreateGroupOpen(false);

    // Initial greeting in group
    const welcomeMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      roomId: newGroup.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: `¡Bienvenidos al grupo "${newGroup.name}"! Creé este espacio para conectar estudiantes.`,
      timestamp: 'Ahora'
    };

    setMessages(prev => ({
      ...prev,
      [newGroup.id]: [welcomeMsg]
    }));
  };

  const upvoteGroup = (groupId: string) => {
    setGroups(prev =>
      prev.map(g => (g.id === groupId ? { ...g, upvotesCount: g.upvotesCount + 1 } : g))
    );
  };

  const joinGroup = (groupId: string) => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id === groupId && !g.memberIds.includes(currentUser.id)) {
          return {
            ...g,
            memberIds: [...g.memberIds, currentUser.id],
            membersCount: g.membersCount + 1
          };
        }
        return g;
      })
    );
  };

  const leaveGroup = (groupId: string) => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            memberIds: g.memberIds.filter(id => id !== currentUser.id),
            adminIds: g.adminIds.filter(id => id !== currentUser.id),
            membersCount: Math.max(0, g.membersCount - 1)
          };
        }
        return g;
      })
    );
  };

  const deleteGroup = (groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    if (activeChatRoomId === groupId) {
      closeChat();
    }
  };

  const assignGroupAdmin = (groupId: string, memberId: string) => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id === groupId && !g.adminIds.includes(memberId)) {
          return { ...g, adminIds: [...g.adminIds, memberId] };
        }
        return g;
      })
    );
  };

  const removeGroupAdmin = (groupId: string, memberId: string) => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id === groupId) {
          return { ...g, adminIds: g.adminIds.filter(id => id !== memberId) };
        }
        return g;
      })
    );
  };

  const kickGroupMember = (groupId: string, memberId: string) => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            memberIds: g.memberIds.filter(id => id !== memberId),
            adminIds: g.adminIds.filter(id => id !== memberId),
            membersCount: Math.max(1, g.membersCount - 1)
          };
        }
        return g;
      })
    );
  };

  const sendMessage = (roomId: string, content: string) => {
    if (!content.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      roomId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderPhoto: currentUser.photoUrl,
      content: content.trim(),
      timestamp: 'Ahora'
    };

    setMessages(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), newMsg]
    }));

    // Update match or group last message
    setMatches(prev =>
      prev.map(m => (m.id === roomId ? { ...m, lastMessage: content.trim(), lastMessageTime: 'Recién' } : m))
    );

    // Simulate reply for demo if it's a match
    const currentMatch = matches.find(m => m.id === roomId);
    if (currentMatch) {
      const otherUserId = currentMatch.user1Id === currentUser.id ? currentMatch.user2Id : currentMatch.user1Id;
      const otherUser = users.find(u => u.id === otherUserId);

      if (otherUser) {
        setTimeout(() => {
          const replies = currentMatch.type === 'blind' 
            ? [
                `¡Genial! Me parece un planazo vernos en ${otherUser.blindIdealSpot || 'la cafetería central'} 👍`,
                'Jajaja totalmente de acuerdo. ¿A qué hora te desocupas de clases hoy?',
                '¿En serio? Yo también tengo libre a esa hora entre semestres.',
                '¡Perfecto! Nos vemos en un lugar público concurrido como acordamos.'
              ]
            : [
                `¡Hola! Justo estaba terminando una entrega de ${otherUser.career} 📚 ¿Cómo te fue a ti?`,
                'Jaja me encantó tu perfil! ¿Qué materias estás llevando este semestre?',
                '¡Sii! Amo salir por un buen café entre clases, avísame cuando andes por campus.',
                'Jajaja qué risa, ¿estudias en biblioteca o en tu casa?'
              ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];

          const replyMsg: ChatMessage = {
            id: `reply_${Date.now()}`,
            roomId,
            senderId: otherUser.id,
            senderName: currentMatch.type === 'blind' ? `Estudiante de ${otherUser.career}` : otherUser.name,
            senderPhoto: currentMatch.type === 'blind' ? undefined : otherUser.photoUrl,
            content: randomReply,
            timestamp: 'Ahora'
          };

          setMessages(p => ({
            ...p,
            [roomId]: [...(p[roomId] || []), replyMsg]
          }));

          setMatches(p =>
            p.map(m => (m.id === roomId ? { ...m, lastMessage: randomReply, lastMessageTime: 'Recién' } : m))
          );
        }, 1200);
      }
    }
  };

  const deleteMessage = (roomId: string, messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).map(m => (m.id === messageId ? { ...m, isDeleted: true, content: 'Este mensaje fue eliminado por un administrador.' } : m))
    }));
  };

  const resetToDefaults = () => {
    setUsers(INITIAL_USERS);
    setGroups(INITIAL_GROUPS);
    setMatches(INITIAL_MATCHES);
    setMessages(INITIAL_MESSAGES);
    setCurrentUserId('user_current');
    setSwipedUserIds(new Set());
    setBlindSwipedUserIds(new Set());
  };

  const metrics = {
    totalStudents: users.length,
    pendingCount: users.filter(u => u.verificationStatus === 'pending').length,
    approvedCount: users.filter(u => u.verificationStatus === 'approved').length,
    totalMatches: matches.filter(m => m.type === 'traditional').length,
    blindMatchesCount: matches.filter(m => m.type === 'blind').length,
    totalGroups: groups.length
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        groups,
        matches,
        messages,
        currentTab,
        setCurrentTab,
        selectedProfileUser,
        setSelectedProfileUser,
        activeChatRoomId,
        activeChatType,
        openChat,
        closeChat,
        matchCelebration,
        closeMatchCelebration,
        isRegisterOpen,
        setIsRegisterOpen,
        isSwitcherOpen,
        setIsSwitcherOpen,
        isCreateGroupOpen,
        setIsCreateGroupOpen,
        registerUser,
        approveUser,
        rejectUser,
        banUser,
        swipedUserIds,
        blindSwipedUserIds,
        handleSwipe,
        resetSwipes,
        createGroup,
        upvoteGroup,
        joinGroup,
        leaveGroup,
        deleteGroup,
        assignGroupAdmin,
        removeGroupAdmin,
        kickGroupMember,
        sendMessage,
        deleteMessage,
        metrics,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
