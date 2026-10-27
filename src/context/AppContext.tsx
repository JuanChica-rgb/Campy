import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import type { User, Group, Match, ChatMessage, ActiveTab, DiscoveryPrefs, Outreach, VerificationStatus } from '../types';
import { supabase, isAdminEmail, authErrorMessage } from '../lib/supabase';
import { authEmailFromPhone, isValidPhone, normalizePhone } from '../lib/phoneAuth';
import { hasPlus, plusGateMessage } from '../lib/plus';
import { canSeeRealIdentity } from '../lib/privacy';
import { uploadProfilePhotos, uploadProfilePhoto } from '../lib/photos';
import { prepareAlerts, showAlert, watchAlertTaps } from '../lib/alerts';
import { prepareAds } from '../lib/googleAds';
import {
  loadCampy, saveProfile, saveLike, savePass, deletePass, clearSwipes, saveMatch, saveMessage, touchMatchPreview,
  saveOutreach, saveOutreachReply, saveReport, reportAndBlockUser, banCampyAccount, setUserRole,
  deleteCampyAccount, listUniversities, addUniversity,
  removeUniversity, renameUniversity, listAds, createAd, deleteAd, pairIds, mutualMatchId, userFromRow, matchFromRow,
  requestUnblindRemote, respondUnblindRemote,
  setVerificationStatus, saveGroup, joinGroupRemote, leaveGroupRemote, deleteGroupRemote,
  setGroupMemberAdmin, kickGroupMemberRemote, banGroupMemberRemote, findGroupByCode, bumpGroupUpvote, makeInviteCode,
  type LikeRow, type PassRow, type AdRow, type ReportRow
} from '../lib/campyDb';

const SEEN_MATCHES_KEY = 'campy_seen_matches';

function loadSeenMatches(): Set<string> | null {
  try {
    const raw = localStorage.getItem(SEEN_MATCHES_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []);
  } catch {
    return new Set();
  }
}

function saveSeenMatches(ids: Set<string>) {
  try {
    localStorage.setItem(SEEN_MATCHES_KEY, JSON.stringify([...ids].slice(-200)));
  } catch {
    /* ignore quota */
  }
}

function withProfileDefaults(user: User): User {
  return {
    ...user,
    languages: user.languages ?? [],
    communication: user.communication ?? [],
    love: user.love ?? [],
    pets: user.pets ?? []
  };
}

const DEFAULT_DISCOVERY: DiscoveryPrefs = {
  interestIn: 'todos',
  ageMin: 18,
  ageMax: 26,
  seeking: 'pensando',
  languages: [],
  zodiac: '',
  family: '',
  communication: [],
  love: [],
  pets: [],
  drinking: '',
  smoking: '',
  socials: ''
};

function withDiscoveryPrefs(saved?: Partial<DiscoveryPrefs>): DiscoveryPrefs {
  return {
    ...DEFAULT_DISCOVERY,
    ...saved,
    languages: saved?.languages ?? [],
    communication: saved?.communication ?? [],
    love: saved?.love ?? [],
    pets: saved?.pets ?? []
  };
}

export type ChatKind = 'traditional' | 'blind' | 'group' | 'outreach';

export type SignUpInput = {
  name: string;
  age: number;
  phone: string;
  password?: string;
  gender: 'mujer' | 'hombre';
  interestIn: 'mujeres' | 'hombres' | 'todos';
  university: string;
  career: string;
  semester: number;
  bio: string;
  interests: string[];
  blindBio?: string;
  blindIdealSpot?: string;
  adultConfirmed?: boolean;
  photoUrl?: string;
  photoFiles?: File[];
};

type MatchCelebration = {
  isOpen: boolean;
  user: User | null;
  type: 'traditional' | 'blind';
};

interface AppContextType {
  currentUser: User;
  users: User[];
  groups: Group[];
  matches: Match[];
  outreach: Outreach[];
  messages: Record<string, ChatMessage[]>;
  currentTab: ActiveTab;
  setCurrentTab: (tab: ActiveTab) => void;

  selectedProfileUser: User | null;
  setSelectedProfileUser: (user: User | null) => void;
  activeChatRoomId: string | null;
  activeChatType: ChatKind | null;
  openChat: (roomId: string, type: ChatKind) => void;
  closeChat: () => void;

  matchCelebration: MatchCelebration;
  closeMatchCelebration: () => void;

  isRegisterOpen: boolean;
  setIsRegisterOpen: (open: boolean) => void;
  isCreateGroupOpen: boolean;
  setIsCreateGroupOpen: (open: boolean) => void;

  authReady: boolean;
  remoteReady: boolean;
  sessionUserId: string | null;
  sessionEmail: string | null;
  signIn: (phone: string, password: string) => Promise<string | null>;
  signUp: (data: SignUpInput) => Promise<string | null>;
  signOut: () => Promise<void>;

  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  banUser: (userId: string) => Promise<string | null>;
  grantAdmin: (userId: string) => Promise<string | null>;
  revokeAdmin: (userId: string) => Promise<string | null>;
  deleteAccount: (userId: string) => Promise<string | null>;
  reportUser: (reportedId: string, reason: string) => Promise<string | null>;
  reportAndBlock: (reportedId: string, reason: string) => Promise<string | null>;
  reports: ReportRow[];
  blockedIds: Set<string>;
  isBlocked: (userId: string) => boolean;

  universities: string[];
  addUniversity: (name: string) => Promise<string | null>;
  removeUniversityName: (name: string) => Promise<string | null>;
  renameUniversityName: (oldName: string, newName: string) => Promise<string | null>;

  ads: AdRow[];
  publishAd: (input: {
    title: string;
    body: string;
    linkUrl: string;
    file?: File;
  }) => Promise<string | null>;
  deleteAd: (id: string) => Promise<string | null>;

  swipedUserIds: Set<string>;
  blindSwipedUserIds: Set<string>;
  handleSwipe: (
    targetUserId: string,
    action: 'like' | 'pass' | 'superlike',
    mode: 'traditional' | 'blind'
  ) => void;
  rewindLastPass: (mode: 'traditional' | 'blind') => void;
  resetSwipes: (mode: 'traditional' | 'blind') => void;
  incomingLikes: Record<string, string[]>;
  respondToLike: (likerId: string, decision: 'match' | 'pass') => void;
  discovery: DiscoveryPrefs;
  setDiscovery: (prefs: DiscoveryPrefs) => void;
  updateProfile: (patch: Partial<User>) => void;

  createGroup: (groupData: {
    name: string;
    description: string;
    category: Group['category'];
    coverUrl: string;
    tags: string[];
  }) => Promise<string | null>;
  updateGroup: (groupId: string, patch: Partial<Pick<Group, 'name' | 'description' | 'coverUrl' | 'tags'>>) => Promise<string | null>;
  joinGroupByCode: (code: string) => Promise<{ error: string | null; group: Group | null }>;
  upvoteGroup: (groupId: string) => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  deleteGroup: (groupId: string) => void;
  assignGroupAdmin: (groupId: string, memberId: string) => void;
  removeGroupAdmin: (groupId: string, memberId: string) => void;
  kickGroupMember: (groupId: string, memberId: string) => void;
  banGroupMember: (groupId: string, memberId: string) => void;
  canSeeProfile: (userId: string) => boolean;

  sendMessage: (roomId: string, content: string) => void;
  requestUnblind: (matchId: string) => Promise<string | null>;
  respondUnblind: (matchId: string, accept: boolean) => Promise<string | null>;
  sendSuperLike: (toId: string) => Promise<string | null>;
  sendNote: (toId: string, body: string) => Promise<string | null>;
  replyToNote: (outreachId: string, body: string) => Promise<string | null>;
  deleteMessage: (roomId: string, messageId: string) => void;

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

const EMPTY_USER: User = {
  id: '',
  name: '',
  age: 18,
  phone: '',
  university: '',
  career: '',
  semester: 1,
  photoUrl: '',
  bio: '',
  interests: [],
  verificationStatus: 'pending',
  registeredAt: '',
  role: 'student'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUserIdKey = 'campy_current_user_id_v2';

  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState(() => {
    try {
      return localStorage.getItem(currentUserIdKey) || '';
    } catch {
      return '';
    }
  });
  const [groups, setGroups] = useState<Group[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [outreach, setOutreach] = useState<Outreach[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [currentTab, setCurrentTab] = useState<ActiveTab>('traditional');
  const [likes, setLikes] = useState<LikeRow[]>([]);
  const [passes, setPasses] = useState<PassRow[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set());
  const [universities, setUniversities] = useState<string[]>([]);
  const [ads, setAds] = useState<AdRow[]>([]);
  const [authReady, setAuthReady] = useState(!supabase);
  const [remoteReady, setRemoteReady] = useState(false);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  const skipLoadRef = useRef(false);
  const celebratedMatchIdsRef = useRef(new Set<string>());
  const usersRef = useRef<User[]>([]);
  const activeChatRoomIdRef = useRef<string | null>(null);
  const matchesRef = useRef<Match[]>([]);
  const lastPassRef = useRef<{ toId: string; mode: 'traditional' | 'blind' } | null>(null);

  const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);
  const [activeChatRoomId, setActiveChatRoomId] = useState<string | null>(null);
  const [activeChatType, setActiveChatType] = useState<ChatKind | null>(null);
  const [matchCelebration, setMatchCelebration] = useState<MatchCelebration>({
    isOpen: false,
    user: null,
    type: 'traditional'
  });

  usersRef.current = users;
  activeChatRoomIdRef.current = activeChatRoomId;
  matchesRef.current = matches;

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [discoveryByUser, setDiscoveryByUser] = useState<Record<string, Partial<DiscoveryPrefs>>>(() => {
    try {
      const raw = localStorage.getItem('campy_discovery_v1');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('campy_discovery_v1', JSON.stringify(discoveryByUser));
    } catch (err) {
      console.error(err);
    }
  }, [discoveryByUser]);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSessionUserId(data.session?.user.id ?? null);
      setSessionEmail(data.session?.user.email ?? null);
      setAuthReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUserId(session?.user.id ?? null);
      setSessionEmail(session?.user.email ?? null);
      setAuthReady(true);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authReady) return;
    void listUniversities().then(setUniversities);
    void listAds().then(setAds);
  }, [authReady]);

  useEffect(() => {
    if (sessionUserId) setCurrentUserId(sessionUserId);
    setCurrentTab('traditional');
    setActiveChatRoomId(null);
    setActiveChatType(null);
    setSelectedProfileUser(null);
    lastPassRef.current = null;
  }, [sessionUserId]);

  useEffect(() => {
    if (!authReady || !sessionUserId || skipLoadRef.current) return;
    let cancelled = false;

    void loadCampy().then(snapshot => {
      if (cancelled) return;
      if (!snapshot) {
        setRemoteReady(true);
        return;
      }

      const canSeePhones =
        isAdminEmail(sessionEmail) ||
        snapshot.profiles.some(profile => profile.id === sessionUserId && profile.role === 'admin');

      const nextUsers = snapshot.profiles.map(profile =>
        withProfileDefaults({
          ...profile,
          phone: canSeePhones || profile.id === sessionUserId ? profile.phone : ''
        })
      );

      setUsers(nextUsers);
      setReports(snapshot.reports);
      setBlockedIds(new Set(snapshot.blockedIds));
      setLikes(prev => {
        const localOnly = prev.filter(
          row =>
            !snapshot.likes.some(
              remote =>
                remote.from_id === row.from_id && remote.to_id === row.to_id && remote.mode === row.mode
            )
        );
        return [...snapshot.likes, ...localOnly];
      });
      setPasses(prev => {
        const localOnly = prev.filter(
          row =>
            !snapshot.passes.some(
              remote =>
                remote.from_id === row.from_id && remote.to_id === row.to_id && remote.mode === row.mode
            )
        );
        return [...snapshot.passes, ...localOnly];
      });
      setMatches(snapshot.matches);
      setOutreach(snapshot.outreach);
      setMessages(snapshot.messages);
      setGroups(
        snapshot.groups.map(group => ({
          ...group,
          inviteCode: group.inviteCode || ''
        }))
      );

      const me = nextUsers.find(profile => profile.id === sessionUserId);
      if (me) {
        setDiscoveryByUser(prev => {
          const saved = prev[sessionUserId] ?? {};
          return {
            ...prev,
            [sessionUserId]: {
              ...saved,
              interestIn: saved.interestIn ?? me.interestIn ?? 'todos'
            }
          };
        });
      }

      const seen = loadSeenMatches();
      if (seen) {
        const unread = snapshot.matches.find(
          match =>
            !seen.has(match.id) &&
            !celebratedMatchIdsRef.current.has(match.id) &&
            (match.user1Id === sessionUserId || match.user2Id === sessionUserId) &&
            (match.type === 'traditional' || match.type === 'blind')
        );
        if (unread) {
          const otherId = unread.user1Id === sessionUserId ? unread.user2Id : unread.user1Id;
          const other = nextUsers.find(user => user.id === otherId);
          if (other) {
            setMatchCelebration({
              isOpen: true,
              user: other,
              type: unread.type === 'blind' ? 'blind' : 'traditional'
            });
          }
        }
      }
      saveSeenMatches(new Set([...(seen ?? []), ...snapshot.matches.map(match => match.id)]));
      setRemoteReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [authReady, sessionUserId, sessionEmail, reloadTick]);

  useEffect(() => {
    const client = supabase;
    if (!client || !sessionUserId) return;

    void prepareAlerts();
    void prepareAds();
    const stopWatching = watchAlertTaps(extra => {
      if (extra.tab === 'admin') {
        setCurrentTab('admin');
        return;
      }
      const roomId = typeof extra.roomId === 'string' ? extra.roomId : '';
      const chatType: ChatKind =
        extra.chatType === 'blind' || extra.chatType === 'group' || extra.chatType === 'outreach'
          ? extra.chatType
          : 'traditional';
      setCurrentTab('chats');
      if (roomId) {
        setActiveChatRoomId(roomId);
        setActiveChatType(chatType);
      }
    });

    const sameSwipe = (a: LikeRow | PassRow, b: LikeRow | PassRow) =>
      a.from_id === b.from_id && a.to_id === b.to_id && a.mode === b.mode;

    const channel = client
      .channel('campy-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'likes' }, payload => {
        const row = payload.new as LikeRow;
        setLikes(prev => (prev.some(item => sameSwipe(item, row)) ? prev : [...prev, row]));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'passes' }, payload => {
        const row = payload.new as PassRow;
        setPasses(prev => (prev.some(item => sameSwipe(item, row)) ? prev : [...prev, row]));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'matches' }, payload => {
        const row = payload.new as {
          id: string;
          user1_id: string;
          user2_id: string;
          type: Match['type'];
          matched_at: string;
          last_message?: string;
          last_message_time?: string;
        };
        const incoming = matchFromRow(payload.new as Record<string, unknown>);
        setMatches(prev =>
          prev.some(match => match.id === incoming.id) ? prev : [incoming, ...prev]
        );

        if (
          (row.user1_id !== sessionUserId && row.user2_id !== sessionUserId) ||
          celebratedMatchIdsRef.current.has(row.id)
        ) {
          return;
        }

        celebratedMatchIdsRef.current.add(row.id);
        const seen = loadSeenMatches();
        if (seen) {
          seen.add(row.id);
          saveSeenMatches(seen);
        }

        const otherId = row.user1_id === sessionUserId ? row.user2_id : row.user1_id;
        const other = usersRef.current.find(user => user.id === otherId) ?? null;
        const isBlind = row.type === 'blind';
        if (other && (row.type === 'traditional' || row.type === 'blind')) {
          setMatchCelebration({
            isOpen: true,
            user: other,
            type: isBlind ? 'blind' : 'traditional'
          });
        }

        if (document.visibilityState === 'hidden') {
          void showAlert(
            `match:${row.id}`,
            isBlind ? 'Cita a ciegas' : 'Nuevo match',
            isBlind
              ? 'Alguien también te dio like. Ya pueden hablar.'
              : other
                ? `Tú y ${other.name} se gustaron.`
                : 'Alguien también te dio like.',
            { roomId: row.id, chatType: isBlind ? 'blind' : 'traditional' }
          );
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'matches' }, payload => {
        const incoming = matchFromRow(payload.new as Record<string, unknown>);
        setMatches(prev => prev.map(match => (match.id === incoming.id ? { ...match, ...incoming } : match)));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'universities' }, () => {
        void listUniversities().then(setUniversities);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reports' }, payload => {
        const row = payload.new as {
          id: string;
          reporter_id: string;
          reported_id: string;
          reason: string;
          created_at: string;
        };
        const report: ReportRow = {
          id: row.id,
          reporterId: row.reporter_id,
          reportedId: row.reported_id,
          reason: row.reason,
          createdAt: row.created_at
        };
        setReports(prev => (prev.some(item => item.id === report.id) ? prev : [report, ...prev]));
        const amAdmin =
          isAdminEmail(sessionEmail) ||
          usersRef.current.some(user => user.id === sessionUserId && user.role === 'admin');
        if (amAdmin && row.reporter_id !== sessionUserId) {
          const reported = usersRef.current.find(user => user.id === row.reported_id);
          void showAlert(
            `report:${row.id}`,
            'Nueva denuncia',
            reported
              ? `${reported.name}: ${row.reason}`
              : row.reason,
            { tab: 'admin' }
          );
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, payload => {
        const row = payload.new as { id: string; verification_status?: string; role?: string };
        setUsers(prev =>
          prev.map(user => {
            if (user.id !== row.id) return user;
            const status = row.verification_status;
            const verificationStatus: VerificationStatus =
              status === 'approved' || status === 'rejected' || status === 'banned' || status === 'pending'
                ? status
                : user.verificationStatus;
            return {
              ...user,
              verificationStatus,
              role: row.role === 'admin' ? 'admin' : 'student'
            };
          })
        );
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, payload => {
        const profile = userFromRow(payload.new as Record<string, unknown>);
        setUsers(prev =>
          prev.some(user => user.id === profile.id) ? prev : [withProfileDefaults(profile), ...prev]
        );
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const row = payload.new as {
          id: string;
          room_id: string;
          sender_id: string;
          sender_name?: string;
          sender_photo?: string;
          content: string;
          timestamp_label?: string;
          is_system?: boolean;
          is_deleted?: boolean;
        };
        const message: ChatMessage = {
          id: row.id,
          roomId: row.room_id,
          senderId: row.sender_id,
          senderName: row.sender_name ?? '',
          senderPhoto: row.sender_photo,
          content: row.content,
          timestamp: row.timestamp_label ?? '',
          isSystem: row.is_system,
          isDeleted: row.is_deleted
        };

        setMessages(prev => {
          const room = prev[message.roomId] ?? [];
          if (room.some(item => item.id === message.id)) return prev;
          return { ...prev, [message.roomId]: [...room, message] };
        });

        if (
          message.senderId === sessionUserId ||
          message.senderId === 'system' ||
          message.isSystem ||
          message.isDeleted ||
          (activeChatRoomIdRef.current === message.roomId && document.visibilityState === 'visible')
        ) {
          return;
        }

        const match = matchesRef.current.find(item => item.id === message.roomId);
        const isBlind = match?.type === 'blind';
        void showAlert(
          `msg:${message.id}`,
          isBlind ? 'Mensaje en tu cita a ciegas' : `Mensaje de ${message.senderName || 'alguien'}`,
          isBlind ? 'Tienes un mensaje nuevo.' : message.content.slice(0, 140),
          {
            roomId: message.roomId,
            chatType: isBlind ? 'blind' : match ? 'traditional' : 'group'
          }
        );
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'outreach' }, payload => {
        const row = payload.new as {
          id: string;
          from_id: string;
          to_id: string;
          kind: string;
          body?: string;
          created_at: string;
        };
        const item: Outreach = {
          id: row.id,
          fromId: row.from_id,
          toId: row.to_id,
          kind: row.kind === 'note' ? 'note' : 'superlike',
          body: row.body || undefined,
          createdAt: row.created_at
        };

        setOutreach(prev => (prev.some(existing => existing.id === item.id) ? prev : [item, ...prev]));

        if (item.kind === 'note' && item.body) {
          setMessages(prev => {
            const room = prev[item.id] ?? [];
            if (room.some(message => message.id === `${item.id}_open`)) return prev;
            return {
              ...prev,
              [item.id]: [
                {
                  id: `${item.id}_open`,
                  roomId: item.id,
                  senderId: item.fromId,
                  senderName: '',
                  content: item.body || '',
                  timestamp: ''
                },
                ...room
              ]
            };
          });
        }

        if (item.toId !== sessionUserId || document.visibilityState === 'visible') return;

        const fromUser = usersRef.current.find(user => user.id === item.fromId);
        void showAlert(
          item.id,
          item.kind === 'superlike' ? 'Super Like' : `Mensaje de ${fromUser?.name || 'alguien'}`,
          item.kind === 'superlike' ? 'Te ha mandado un super like' : item.body || 'Tienes un mensaje',
          { roomId: item.id, chatType: 'outreach' }
        );
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'outreach_replies' }, payload => {
        const row = payload.new as {
          id: string;
          outreach_id: string;
          sender_id: string;
          body: string;
        };
        setMessages(prev => {
          const room = prev[row.outreach_id] ?? [];
          if (room.some(message => message.id === row.id)) return prev;
          return {
            ...prev,
            [row.outreach_id]: [
              ...room,
              {
                id: row.id,
                roomId: row.outreach_id,
                senderId: row.sender_id,
                senderName: '',
                content: row.body,
                timestamp: ''
              }
            ]
          };
        });
      })
      .subscribe();

    return () => {
      stopWatching();
      void client.removeChannel(channel);
    };
  }, [sessionUserId]);

  useEffect(() => {
    try {
      localStorage.setItem('campy_users_v2', JSON.stringify(users));
    } catch (err) {
      console.error(err);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('campy_matches_v2', JSON.stringify(matches));
    } catch (err) {
      console.error(err);
    }
  }, [matches]);

  useEffect(() => {
    try {
      localStorage.setItem('campy_messages_v2', JSON.stringify(messages));
    } catch (err) {
      console.error(err);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(currentUserIdKey, currentUserId);
    } catch (err) {
      console.error(err);
    }
  }, [currentUserId]);

  const effectiveUserId = sessionUserId || currentUserId;
  const currentUser = users.find(user => user.id === effectiveUserId) || EMPTY_USER;

  const updateProfile = (patch: Partial<User>) => {
    setUsers(prev =>
      prev.map(user => {
        if (user.id !== currentUserId) return user;
        const next = { ...user, ...patch, id: user.id, role: user.role };
        void saveProfile(next);
        return next;
      })
    );
  };

  const signIn = async (phone: string, password: string) => {
    if (!supabase) return 'No hay conexión con el servidor.';
    if (!isValidPhone(phone)) return 'Ingresa un número válido.';
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmailFromPhone(phone),
      password
    });
    if (error) return authErrorMessage(error.message);
    setRemoteReady(false);
    return null;
  };

  const signUp = async (data: SignUpInput) => {
    if (!supabase) return 'No hay conexión con el servidor.';
    if (!data.adultConfirmed) return 'Confirma que eres mayor de 18.';
    if (data.age < 18) return 'Debes tener 18 años o más.';
    if (!isValidPhone(data.phone)) return 'Ingresa un número / WhatsApp válido.';

    const phoneDigits = normalizePhone(data.phone);
    const authEmail = sessionEmail?.endsWith('@phone.campy.app')
      ? sessionEmail
      : authEmailFromPhone(phoneDigits);
    skipLoadRef.current = true;

    try {
      let userId = sessionUserId;
      if (!userId) {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email: authEmail,
          password: data.password ?? ''
        });
        if (error) return authErrorMessage(error.message);

        let session = signUpData.session;
        if (!session) {
          const signedIn = await supabase.auth.signInWithPassword({
            email: authEmail,
            password: data.password ?? ''
          });
          if (signedIn.error || !signedIn.data.session) {
            return 'No se pudo iniciar sesión. Revisa el número y la contraseña.';
          }
          session = signedIn.data.session;
        }
        userId = session.user.id;
      }

      const admin = isAdminEmail(authEmail);
      let photoUrl = data.photoUrl || '';
      let additionalPhotos: string[] = [];

      if (data.photoFiles?.length) {
        const uploaded = await uploadProfilePhotos(userId, data.photoFiles);
        if (uploaded.error || !uploaded.urls?.length) {
          setRemoteReady(true);
          return uploaded.error || 'No se pudo subir la foto.';
        }
        photoUrl = uploaded.urls[0];
        additionalPhotos = uploaded.urls.slice(1);
      }

      if (!photoUrl) {
        setRemoteReady(true);
        return 'Sube al menos una foto tuya.';
      }

      const profile: User = {
        id: userId,
        name: data.name.trim(),
        age: Number(data.age),
        phone: phoneDigits,
        adultConfirmed: true,
        gender: data.gender,
        interestIn: data.interestIn,
        university: data.university.trim(),
        career: data.career.trim(),
        semester: Number(data.semester),
        photoUrl,
        additionalPhotos,
        bio: data.bio.trim(),
        interests: data.interests,
        seeking: 'pensando',
        blindBio:
          data.blindBio?.trim() ||
          'Me gusta compartir un buen café y platicar de cosas interesantes.',
        blindIdealSpot: data.blindIdealSpot?.trim(),
        verificationStatus: admin ? 'approved' : 'pending',
        registeredAt: new Date().toISOString(),
        role: admin ? 'admin' : 'student'
      };

      const saveError = await saveProfile(profile);
      if (saveError) {
        setRemoteReady(true);
        return authErrorMessage(saveError);
      }

      setDiscoveryByUser(prev => ({
        ...prev,
        [userId]: {
          ...withDiscoveryPrefs(prev[userId]),
          interestIn: data.interestIn
        }
      }));
      setUsers(prev => [withProfileDefaults(profile), ...prev.filter(user => user.id !== profile.id)]);
      setCurrentUserId(userId);
      setIsRegisterOpen(false);
      setRemoteReady(true);
      return null;
    } finally {
      skipLoadRef.current = false;
      setReloadTick(tick => tick + 1);
    }
  };

  const signOut = async () => {
    setIsRegisterOpen(false);
    setRemoteReady(false);
    if (supabase) await supabase.auth.signOut();
    setSessionUserId(null);
    setSessionEmail(null);
  };

  const deleteAccount = async (userId: string) => {
    const error = await deleteCampyAccount(userId);
    if (error) return authErrorMessage(error);
    setUsers(prev => prev.filter(user => user.id !== userId));
    setReports(prev => prev.filter(report => report.reportedId !== userId && report.reporterId !== userId));
    if (userId === sessionUserId) await signOut();
    return null;
  };

  const reportUser = async (reportedId: string, reason: string) => {
    if (!sessionUserId) return 'Inicia sesión para continuar.';
    const error = await saveReport(sessionUserId, reportedId, reason);
    return error ? authErrorMessage(error) : null;
  };

  const reportAndBlock = async (reportedId: string, reason: string) => {
    if (!sessionUserId) return 'Inicia sesión para continuar.';
    const error = await reportAndBlockUser(reportedId, reason);
    if (error) return authErrorMessage(error);
    setBlockedIds(prev => new Set(prev).add(reportedId));
    setPasses(prev => {
      const next = [...prev];
      for (const mode of ['traditional', 'blind']) {
        if (!next.some(row => row.from_id === sessionUserId && row.to_id === reportedId && row.mode === mode)) {
          next.push({ from_id: sessionUserId, to_id: reportedId, mode });
        }
      }
      return next;
    });
    setMatches(prev =>
      prev.filter(match => match.user1Id !== reportedId && match.user2Id !== reportedId)
    );
    setSelectedProfileUser(null);
    if (activeChatRoomId) {
      const match = matchesRef.current.find(item => item.id === activeChatRoomId);
      if (match && (match.user1Id === reportedId || match.user2Id === reportedId)) {
        setActiveChatRoomId(null);
        setActiveChatType(null);
      }
    }
    return null;
  };

  const grantAdmin = async (userId: string) => {
    const error = await setUserRole(userId, 'admin');
    if (error) return authErrorMessage(error);
    setUsers(prev =>
      prev.map(user => (user.id === userId ? { ...user, role: 'admin' as const } : user))
    );
    return null;
  };

  const revokeAdmin = async (userId: string) => {
    const error = await setUserRole(userId, 'student');
    if (error) return authErrorMessage(error);
    setUsers(prev =>
      prev.map(user => (user.id === userId ? { ...user, role: 'student' as const } : user))
    );
    return null;
  };

  const isBlocked = (userId: string) => blockedIds.has(userId);

  const addUniversityName = async (name: string) => {
    const trimmed = name.trim();
    if (trimmed.length < 3) return 'Escribe el nombre de la universidad.';
    if (universities.some(item => item.toLowerCase() === trimmed.toLowerCase())) {
      return 'Esa universidad ya está en la lista.';
    }
    const error = await addUniversity(trimmed);
    if (error) return authErrorMessage(error);
    setUniversities(prev => [...prev, trimmed].sort((a, b) => a.localeCompare(b, 'es')));
    return null;
  };

  const removeUniversityName = async (name: string) => {
    const error = await removeUniversity(name);
    if (error) return authErrorMessage(error);
    setUniversities(prev => prev.filter(item => item !== name));
    return null;
  };

  const renameUniversityName = async (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (trimmed.length < 3) return 'Escribe el nombre de la universidad.';
    if (
      trimmed.toLowerCase() !== oldName.toLowerCase() &&
      universities.some(item => item.toLowerCase() === trimmed.toLowerCase())
    ) {
      return 'Esa universidad ya está en la lista.';
    }
    const error = await renameUniversity(oldName, trimmed);
    if (error) return authErrorMessage(error);
    setUniversities(prev =>
      prev.map(item => (item === oldName ? trimmed : item)).sort((a, b) => a.localeCompare(b, 'es'))
    );
    return null;
  };

  const publishAd = async (input: {
    title: string;
    body: string;
    linkUrl: string;
    file?: File;
  }) => {
    if (!sessionUserId) return 'Inicia sesión para continuar.';
    const title = input.title.trim();
    if (title.length < 2) return 'Escribe el título del anuncio.';

    let imageUrl: string | undefined;
    if (input.file) {
      const uploaded = await uploadProfilePhoto(sessionUserId, input.file);
      if (uploaded.error || !uploaded.url) return uploaded.error || 'No se pudo subir la imagen.';
      imageUrl = uploaded.url;
    }

    const result = await createAd({
      title,
      body: input.body.trim(),
      linkUrl: input.linkUrl.trim(),
      imageUrl
    });
    if (result.error || !result.ad) {
      return authErrorMessage(result.error || 'No se pudo guardar el anuncio.');
    }
    setAds(prev => [result.ad!, ...prev.filter(ad => ad.id !== result.ad!.id)]);
    return null;
  };

  const removeAd = async (id: string) => {
    const error = await deleteAd(id);
    if (error) return authErrorMessage(error);
    setAds(prev => prev.filter(ad => ad.id !== id));
    return null;
  };

  const setVerification = (userId: string, status: VerificationStatus) => {
    setUsers(prev =>
      prev.map(user => (user.id === userId ? { ...user, verificationStatus: status } : user))
    );
    void setVerificationStatus(userId, status).then(error => {
      if (!error) return;
      console.error(error);
      // Revert local state if the server rejected the change.
      void loadCampy().then(snapshot => {
        if (!snapshot) return;
        setUsers(snapshot.profiles.map(withProfileDefaults));
      });
    });
  };

  const approveUser = (userId: string) => setVerification(userId, 'approved');
  const rejectUser = (userId: string) => setVerification(userId, 'rejected');
  const banUser = async (userId: string) => {
    const error = await banCampyAccount(userId);
    if (error) return authErrorMessage(error);
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? {
              ...user,
              name: 'Cuenta bloqueada',
              photoUrl: '',
              additionalPhotos: [],
              bio: '',
              interests: [],
              university: '',
              career: '',
              verificationStatus: 'banned',
              role: 'student'
            }
          : user
      )
    );
    setMatches(prev => prev.filter(match => match.user1Id !== userId && match.user2Id !== userId));
    return null;
  };

  const openChat = (roomId: string, type: ChatKind) => {
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

  const createMatch = (other: User, type: 'traditional' | 'blind') => {
    if (
      matches.some(
        match =>
          ((match.user1Id === currentUser.id && match.user2Id === other.id) ||
            (match.user2Id === currentUser.id && match.user1Id === other.id)) &&
          match.type === type
      )
    ) {
      setMatchCelebration({ isOpen: true, user: other, type });
      return;
    }

    const [user1Id, user2Id] = pairIds(currentUser.id, other.id);
    const matchId = mutualMatchId(currentUser.id, other.id, type);
    celebratedMatchIdsRef.current.add(matchId);
    const seen = loadSeenMatches();
    if (seen) {
      seen.add(matchId);
      saveSeenMatches(seen);
    }

    const match: Match = {
      id: matchId,
      user1Id,
      user2Id,
      type,
      matchedAt: new Date().toISOString(),
      lastMessage:
        type === 'traditional' ? '¡Hicieron match universitario!' : 'Cita a ciegas activada',
      lastMessageTime: 'Recién',
      unreadCount: 0
    };

    setMatches(prev => (prev.some(item => item.id === match.id) ? prev : [match, ...prev]));
    void saveMatch(match);

    if (type === 'blind') {
      const systemMessage: ChatMessage = {
        id: `sys_${matchId}`,
        roomId: matchId,
        senderId: 'system',
        senderName: 'Campy Seguridad',
        content:
          'Este chat fue creado para encontrarse y tener una cita a ciegas. Por favor, acuerden verse en un lugar público dentro o fuera del campus para la seguridad de ambos.',
        timestamp: 'Ahora',
        isSystem: true
      };
      setMessages(prev => ({
        ...prev,
        [matchId]: prev[matchId]?.some(message => message.id === systemMessage.id)
          ? prev[matchId]
          : [systemMessage, ...(prev[matchId] ?? [])]
      }));
      void saveMessage(systemMessage);
    }

    setMatchCelebration({ isOpen: true, user: other, type });
  };

  const handleSwipe = (
    targetUserId: string,
    action: 'like' | 'pass' | 'superlike',
    mode: 'traditional' | 'blind'
  ) => {
    if (action === 'pass') {
      const row: PassRow = { from_id: currentUser.id, to_id: targetUserId, mode };
      lastPassRef.current = { toId: targetUserId, mode };
      setPasses(prev =>
        prev.some(
          item => item.from_id === row.from_id && item.to_id === row.to_id && item.mode === row.mode
        )
          ? prev
          : [...prev, row]
      );
      void savePass(currentUser.id, targetUserId, mode);
      return;
    }

    const like: LikeRow = { from_id: currentUser.id, to_id: targetUserId, mode };
    setLikes(prev =>
      prev.some(
        item => item.from_id === like.from_id && item.to_id === like.to_id && item.mode === like.mode
      )
        ? prev
        : [...prev, like]
    );
    void saveLike(currentUser.id, targetUserId, mode);

    if (currentUser.privateProfile) return;

    if (
      !likes.some(
        item => item.from_id === targetUserId && item.to_id === currentUser.id && item.mode === mode
      )
    ) {
      return;
    }

    const other = users.find(user => user.id === targetUserId);
    if (other && !other.privateProfile) createMatch(other, mode);
  };

  const respondToLike = (likerId: string, decision: 'match' | 'pass') => {
    if (decision === 'pass') {
      handleSwipe(likerId, 'pass', 'traditional');
      return;
    }
    handleSwipe(likerId, 'like', 'traditional');
  };

  const rewindLastPass = (mode: 'traditional' | 'blind') => {
    if (!hasPlus(currentUser)) return;
    const last = lastPassRef.current;
    if (!last || last.mode !== mode) return;
    lastPassRef.current = null;
    setPasses(prev =>
      prev.filter(
        row => !(row.from_id === currentUser.id && row.to_id === last.toId && row.mode === mode)
      )
    );
    void deletePass(currentUser.id, last.toId, mode);
  };

  const resetSwipes = (mode: 'traditional' | 'blind') => {
    lastPassRef.current = null;
    setLikes(prev => prev.filter(row => row.from_id !== currentUser.id || row.mode !== mode));
    setPasses(prev => prev.filter(row => row.from_id !== currentUser.id || row.mode !== mode));
    void clearSwipes(currentUser.id, mode);
  };

  const createGroup = async (groupData: {
    name: string;
    description: string;
    category: Group['category'];
    coverUrl: string;
    tags: string[];
  }) => {
    const group: Group = {
      id: `group_${crypto.randomUUID?.() ?? Date.now()}`,
      name: groupData.name,
      description: groupData.description,
      category: groupData.category,
      coverUrl:
        groupData.coverUrl ||
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      creatorId: currentUser.id,
      adminIds: [currentUser.id],
      memberIds: [currentUser.id],
      membersCount: 1,
      upvotesCount: 1,
      activeRecentCount: 1,
      createdAt: new Date().toISOString(),
      tags: groupData.tags,
      university: currentUser.university,
      inviteCode: makeInviteCode(),
      bannedIds: []
    };

    const error = await saveGroup(group);
    if (error) return error;

    setGroups(prev => [group, ...prev.filter(item => item.id !== group.id)]);
    setIsCreateGroupOpen(false);

    const welcome: ChatMessage = {
      id: `msg_${Date.now()}`,
      roomId: group.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderPhoto: currentUser.photoUrl,
      content: `¡Bienvenidos al grupo "${group.name}"! Código: ${group.inviteCode}`,
      timestamp: 'Ahora'
    };
    setMessages(prev => ({ ...prev, [group.id]: [welcome] }));
    void saveMessage(welcome);
    return null;
  };

  const updateGroup = async (
    groupId: string,
    patch: Partial<Pick<Group, 'name' | 'description' | 'coverUrl' | 'tags'>>
  ) => {
    const current = groups.find(item => item.id === groupId);
    if (!current) return 'Ese grupo no existe.';
    if (current.creatorId !== currentUser.id && !current.adminIds.includes(currentUser.id)) {
      return 'Solo un admin puede editar el grupo.';
    }
    const next = { ...current, ...patch };
    const error = await saveGroup(next);
    if (error) return error;
    setGroups(prev => prev.map(item => (item.id === groupId ? next : item)));
    return null;
  };

  const joinGroupByCode = async (code: string) => {
    const found = await findGroupByCode(code);
    if (!found) return { error: 'No encontramos un grupo con ese código.', group: null };
    if (found.bannedIds?.includes(currentUser.id)) {
      return { error: 'Te bloquearon de este grupo. Ya no puedes entrar.', group: null };
    }
    if (found.memberIds.includes(currentUser.id)) {
      setGroups(prev => (prev.some(group => group.id === found.id) ? prev : [found, ...prev]));
      return { error: null, group: found };
    }
    const error = await joinGroupRemote(found.id, currentUser.id);
    if (error) return { error, group: null };
    const joined: Group = {
      ...found,
      memberIds: [...found.memberIds, currentUser.id],
      membersCount: found.membersCount + 1
    };
    setGroups(prev => [joined, ...prev.filter(group => group.id !== joined.id)]);
    return { error: null, group: joined };
  };

  const upvoteGroup = (groupId: string) => {
    setGroups(prev =>
      prev.map(group => {
        if (group.id !== groupId) return group;
        const next = group.upvotesCount + 1;
        void bumpGroupUpvote(groupId, next);
        return { ...group, upvotesCount: next };
      })
    );
  };

  const joinGroup = (groupId: string) => {
    const target = groups.find(group => group.id === groupId);
    if (target?.bannedIds?.includes(currentUser.id)) return;
    void joinGroupRemote(groupId, currentUser.id);
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId && !group.memberIds.includes(currentUser.id)
          ? {
              ...group,
              memberIds: [...group.memberIds, currentUser.id],
              membersCount: group.membersCount + 1
            }
          : group
      )
    );
  };

  const leaveGroup = (groupId: string) => {
    void leaveGroupRemote(groupId, currentUser.id);
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              memberIds: group.memberIds.filter(id => id !== currentUser.id),
              adminIds: group.adminIds.filter(id => id !== currentUser.id),
              membersCount: Math.max(0, group.membersCount - 1)
            }
          : group
      )
    );
  };

  const deleteGroup = (groupId: string) => {
    void deleteGroupRemote(groupId);
    setGroups(prev => prev.filter(group => group.id !== groupId));
    if (activeChatRoomId === groupId) closeChat();
  };

  const assignGroupAdmin = (groupId: string, memberId: string) => {
    void setGroupMemberAdmin(groupId, memberId, true);
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId && !group.adminIds.includes(memberId)
          ? { ...group, adminIds: [...group.adminIds, memberId] }
          : group
      )
    );
  };

  const removeGroupAdmin = (groupId: string, memberId: string) => {
    void setGroupMemberAdmin(groupId, memberId, false);
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? { ...group, adminIds: group.adminIds.filter(id => id !== memberId) }
          : group
      )
    );
  };

  const kickGroupMember = (groupId: string, memberId: string) => {
    void kickGroupMemberRemote(groupId, memberId);
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              memberIds: group.memberIds.filter(id => id !== memberId),
              adminIds: group.adminIds.filter(id => id !== memberId),
              membersCount: Math.max(0, group.membersCount - 1)
            }
          : group
      )
    );
  };

  const banGroupMember = (groupId: string, memberId: string) => {
    void banGroupMemberRemote(groupId, memberId, currentUser.id);
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              memberIds: group.memberIds.filter(id => id !== memberId),
              adminIds: group.adminIds.filter(id => id !== memberId),
              bannedIds: [...new Set([...(group.bannedIds ?? []), memberId])],
              membersCount: Math.max(0, group.membersCount - 1)
            }
          : group
      )
    );
  };

  const canSeeProfile = (userId: string) => {
    const user = users.find(item => item.id === userId);
    if (!user) return false;
    return canSeeRealIdentity(currentUser.id, user, matches);
  };

  const sendSuperLike = async (toId: string) => {
    if (!hasPlus(currentUser)) return plusGateMessage('superlike');
    if (toId === currentUser.id) return 'No puedes enviártelo a ti.';
    const id = `out_superlike_${currentUser.id}_${toId}`;
    if (outreach.some(item => item.id === id)) return null;
    const row: Outreach = {
      id,
      fromId: currentUser.id,
      toId,
      kind: 'superlike',
      createdAt: new Date().toISOString()
    };
    return (
      (await saveOutreach(row)) ||
      (setOutreach(prev => (prev.some(item => item.id === id) ? prev : [row, ...prev])), null)
    );
  };

  const sendNote = async (toId: string, body: string) => {
    const trimmed = body.trim();
    if (!hasPlus(currentUser)) return plusGateMessage('note');
    if (trimmed.length < 1 || trimmed.length > 280) {
      return 'Escribe un mensaje de hasta 280 caracteres.';
    }
    if (toId === currentUser.id) return 'No puedes escribirte a ti.';
    const id = `out_note_${currentUser.id}_${toId}`;
    if (outreach.some(item => item.id === id)) return 'Ya le enviaste tu mensaje.';
    const row: Outreach = {
      id,
      fromId: currentUser.id,
      toId,
      kind: 'note',
      body: trimmed,
      createdAt: new Date().toISOString()
    };
    return (
      (await saveOutreach(row)) ||
      (setOutreach(prev => (prev.some(item => item.id === id) ? prev : [row, ...prev])),
      setMessages(prev => ({
        ...prev,
        [id]: [
          {
            id: `${id}_open`,
            roomId: id,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderPhoto: currentUser.photoUrl,
            content: trimmed,
            timestamp: 'Ahora'
          },
          ...(prev[id] ?? [])
        ]
      })),
      null)
    );
  };

  const replyToNote = async (outreachId: string, body: string) => {
    const trimmed = body.trim();
    if (!trimmed) return null;
    const row = outreach.find(item => item.id === outreachId && item.kind === 'note');
    if (!row) return 'Ese chat no existe.';

    const room = messages[outreachId] ?? [];
    const recipientReplied = room.some(
      message => message.senderId === row.toId && message.id !== `${row.id}_open`
    );
    const isSender = row.fromId === currentUser.id;
    if (isSender && !recipientReplied) return 'Solo puedes enviar un mensaje hasta que responda.';
    if (!isSender && row.toId !== currentUser.id) return 'No puedes escribir en este chat.';

    const replyId = `orep_${Date.now()}`;
    return (
      (await saveOutreachReply(replyId, outreachId, currentUser.id, trimmed)) ||
      (setMessages(prev => ({
        ...prev,
        [outreachId]: [
          ...(prev[outreachId] ?? []),
          {
            id: replyId,
            roomId: outreachId,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderPhoto: currentUser.photoUrl,
            content: trimmed,
            timestamp: 'Ahora'
          }
        ]
      })),
      null)
    );
  };

  const requestUnblind = async (matchId: string) => {
    const error = await requestUnblindRemote(matchId);
    if (error) return error;
    const now = new Date().toISOString();
    setMatches(prev =>
      prev.map(match =>
        match.id === matchId
          ? {
              ...match,
              revealRequestedBy: currentUser.id,
              revealRequestedAt: now,
              revealAskUser1At: match.user1Id === currentUser.id ? now : match.revealAskUser1At,
              revealAskUser2At: match.user2Id === currentUser.id ? now : match.revealAskUser2At,
              lastMessage: `${currentUser.name.split(' ')[0]} quiere quitar ciegas`,
              lastMessageTime: 'Recién'
            }
          : match
      )
    );
    return null;
  };

  const respondUnblind = async (matchId: string, accept: boolean) => {
    const error = await respondUnblindRemote(matchId, accept);
    if (error) return error;
    const now = new Date().toISOString();
    setMatches(prev =>
      prev.map(match =>
        match.id === matchId
          ? {
              ...match,
              revealedAt: accept ? now : match.revealedAt,
              revealRequestedBy: undefined,
              revealRequestedAt: undefined,
              lastMessage: accept ? 'Ya pueden verse el perfil' : 'Esta vez no quitaron ciegas',
              lastMessageTime: 'Recién'
            }
          : match
      )
    );
    return null;
  };

  const sendMessage = (roomId: string, content: string) => {
    if (!content.trim()) return;
    const message: ChatMessage = {
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
      [roomId]: [...(prev[roomId] || []), message]
    }));
    void saveMessage(message);
    setMatches(prev =>
      prev.map(match =>
        match.id === roomId
          ? { ...match, lastMessage: content.trim(), lastMessageTime: 'Recién' }
          : match
      )
    );
    void touchMatchPreview(roomId, content.trim());
  };

  const deleteMessage = (roomId: string, messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).map(message =>
        message.id === messageId
          ? {
              ...message,
              isDeleted: true,
              content: 'Este mensaje fue eliminado por un administrador.'
            }
          : message
      )
    }));
  };

  const resetToDefaults = () => {
    setUsers([]);
    setGroups([]);
    setMatches([]);
    setOutreach([]);
    setMessages({});
    setLikes([]);
    setPasses([]);
  };

  const swipedUserIds = useMemo(
    () =>
      new Set([
        ...likes
          .filter(row => row.from_id === currentUserId && row.mode === 'traditional')
          .map(row => row.to_id),
        ...passes
          .filter(row => row.from_id === currentUserId && row.mode === 'traditional')
          .map(row => row.to_id),
        ...blockedIds
      ]),
    [likes, passes, currentUserId, blockedIds]
  );

  const blindSwipedUserIds = useMemo(
    () =>
      new Set([
        ...likes
          .filter(row => row.from_id === currentUserId && row.mode === 'blind')
          .map(row => row.to_id),
        ...passes
          .filter(row => row.from_id === currentUserId && row.mode === 'blind')
          .map(row => row.to_id),
        ...blockedIds
      ]),
    [likes, passes, currentUserId, blockedIds]
  );

  const incomingLikes = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const like of likes) {
      if (like.mode !== 'traditional') continue;
      const passed = passes.some(
        pass =>
          pass.from_id === like.to_id &&
          pass.to_id === like.from_id &&
          pass.mode === 'traditional'
      );
      const matched = matches.some(
        match =>
          (match.user1Id === like.to_id && match.user2Id === like.from_id) ||
          (match.user2Id === like.to_id && match.user1Id === like.from_id)
      );
      if (passed || matched) continue;
      map[like.to_id] = [...(map[like.to_id] ?? []), like.from_id];
    }
    return map;
  }, [likes, passes, matches]);

  const metrics = {
    totalStudents: users.length,
    pendingCount: users.filter(user => user.verificationStatus === 'pending').length,
    approvedCount: users.filter(user => user.verificationStatus === 'approved').length,
    totalMatches: matches.filter(match => match.type === 'traditional').length,
    blindMatchesCount: matches.filter(match => match.type === 'blind').length,
    totalGroups: groups.length
  };

  const value: AppContextType = {
    currentUser,
    users,
    groups,
    matches,
    outreach,
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
    isCreateGroupOpen,
    setIsCreateGroupOpen,
    authReady,
    remoteReady,
    sessionUserId,
    sessionEmail,
    signIn,
    signUp,
    signOut,
    approveUser,
    rejectUser,
    banUser,
    grantAdmin,
    revokeAdmin,
    deleteAccount,
    reportUser,
    reportAndBlock,
    reports,
    blockedIds,
    isBlocked,
    universities,
    addUniversity: addUniversityName,
    removeUniversityName,
    renameUniversityName,
    ads,
    publishAd,
    deleteAd: removeAd,
    swipedUserIds,
    blindSwipedUserIds,
    handleSwipe,
    rewindLastPass,
    resetSwipes,
    incomingLikes,
    respondToLike,
    discovery: withDiscoveryPrefs(discoveryByUser[currentUserId]),
    setDiscovery: prefs => {
      setDiscoveryByUser(prev => ({ ...prev, [currentUserId]: prefs }));
      updateProfile({
        interestIn: prefs.interestIn,
        seeking: prefs.seeking,
        languages: prefs.languages,
        zodiac: prefs.zodiac,
        family: prefs.family,
        communication: prefs.communication,
        love: prefs.love,
        pets: prefs.pets,
        drinking: prefs.drinking,
        smoking: prefs.smoking,
        socials: prefs.socials
      });
    },
    updateProfile,
    createGroup,
    updateGroup,
    joinGroupByCode,
    upvoteGroup,
    joinGroup,
    leaveGroup,
    deleteGroup,
    assignGroupAdmin,
    removeGroupAdmin,
    kickGroupMember,
    banGroupMember,
    canSeeProfile,
    sendMessage,
    requestUnblind,
    respondUnblind,
    sendSuperLike,
    sendNote,
    replyToNote,
    deleteMessage,
    metrics,
    resetToDefaults
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
