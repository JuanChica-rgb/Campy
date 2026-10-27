import type { ChatMessage, Group, Match, Outreach, User, VerificationStatus } from '../types';
import { supabase } from './supabase';

export const PROFILE_COLUMNS =
  'id,name,age,university,career,semester,photo_url,additional_photos,bio,interests,verification_status,role,gender,interest_in,seeking,languages,zodiac,family,communication,love,pets,drinking,smoking,socials,blind_bio,blind_ideal_spot,adult_confirmed,plus_until,private_profile,updated_at';

function statusFromRow(value: string): VerificationStatus {
  return value === 'approved' || value === 'rejected' || value === 'banned' || value === 'pending'
    ? value
    : 'pending';
}

export function matchFromRow(row: Record<string, unknown>): Match {
  return {
    id: String(row.id),
    user1Id: String(row.user1_id),
    user2Id: String(row.user2_id),
    type: row.type as Match['type'],
    matchedAt: String(row.matched_at ?? ''),
    lastMessage: row.last_message ? String(row.last_message) : undefined,
    lastMessageTime: row.last_message_time ? String(row.last_message_time) : undefined,
    unreadCount: 0,
    revealedAt: row.revealed_at ? String(row.revealed_at) : undefined,
    revealRequestedBy: row.reveal_requested_by ? String(row.reveal_requested_by) : undefined,
    revealRequestedAt: row.reveal_requested_at ? String(row.reveal_requested_at) : undefined,
    revealAskUser1At: row.reveal_ask_user1_at ? String(row.reveal_ask_user1_at) : undefined,
    revealAskUser2At: row.reveal_ask_user2_at ? String(row.reveal_ask_user2_at) : undefined
  };
}

export function askedUnblindToday(match: Match, userId: string) {
  const last = match.user1Id === userId ? match.revealAskUser1At : match.revealAskUser2At;
  if (!last) return false;
  const bogota = (value: string | Date) =>
    new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date(value));
  return bogota(last) === bogota(new Date());
}

export function isBlindLocked(match: Match | undefined) {
  return !!match && match.type === 'blind' && !match.revealedAt;
}

export async function requestUnblindRemote(matchId: string) {
  if (!supabase) return 'No hay conexión con el servidor.';
  const { data, error } = await supabase.rpc('campy_request_unblind', { p_match_id: matchId });
  if (error) return error.message;
  return typeof data === 'string' && data ? data : null;
}

export async function respondUnblindRemote(matchId: string, accept: boolean) {
  if (!supabase) return 'No hay conexión con el servidor.';
  const { data, error } = await supabase.rpc('campy_respond_unblind', {
    p_match_id: matchId,
    p_accept: accept
  });
  if (error) return error.message;
  return typeof data === 'string' && data ? data : null;
}

export function userFromRow(row: Record<string, unknown>, phone = ''): User {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    age: Number(row.age ?? 18),
    phone,
    email: row.email ? String(row.email) : undefined,
    adultConfirmed: !!row.adult_confirmed,
    university: String(row.university ?? ''),
    career: String(row.career ?? ''),
    semester: Number(row.semester ?? 1),
    photoUrl: String(row.photo_url ?? ''),
    additionalPhotos: Array.isArray(row.additional_photos)
      ? row.additional_photos.map(String)
      : [],
    bio: String(row.bio ?? ''),
    interests: Array.isArray(row.interests) ? row.interests.map(String) : [],
    verificationStatus: statusFromRow(String(row.verification_status ?? 'pending')),
    registeredAt: String(row.updated_at ?? new Date().toISOString()),
    role: row.role === 'admin' ? 'admin' : 'student',
    gender: row.gender === 'mujer' || row.gender === 'hombre' ? row.gender : undefined,
    interestIn:
      row.interest_in === 'mujeres' || row.interest_in === 'hombres' || row.interest_in === 'todos'
        ? row.interest_in
        : undefined,
    seeking: typeof row.seeking === 'string' ? (row.seeking as User['seeking']) : undefined,
    languages: Array.isArray(row.languages) ? row.languages.map(String) : [],
    zodiac: String(row.zodiac ?? ''),
    family: String(row.family ?? ''),
    communication: Array.isArray(row.communication) ? row.communication.map(String) : [],
    love: Array.isArray(row.love) ? row.love.map(String) : [],
    pets: Array.isArray(row.pets) ? row.pets.map(String) : [],
    drinking: String(row.drinking ?? ''),
    smoking: String(row.smoking ?? ''),
    socials: String(row.socials ?? ''),
    blindBio: row.blind_bio ? String(row.blind_bio) : undefined,
    blindIdealSpot: row.blind_ideal_spot ? String(row.blind_ideal_spot) : undefined,
    plusUntil: row.plus_until ? String(row.plus_until) : undefined,
    privateProfile: !!row.private_profile
  };
}

export function pairIds(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export function mutualMatchId(userA: string, userB: string, mode: 'traditional' | 'blind') {
  const [left, right] = pairIds(userA, userB);
  return `match_${mode}_${left}_${right}`;
}

/** Never writes plus_until — DB trigger owns that field. */
export function profileRow(user: User) {
  return {
    id: user.id,
    name: user.name,
    age: user.age,
    email: user.email ?? null,
    phone: user.phone ?? null,
    adult_confirmed: !!user.adultConfirmed,
    university: user.university,
    career: user.career,
    semester: user.semester,
    photo_url: user.photoUrl,
    additional_photos: user.additionalPhotos ?? [],
    bio: user.bio,
    interests: user.interests ?? [],
    verification_status: user.verificationStatus,
    role: user.role,
    gender: user.gender ?? null,
    interest_in: user.interestIn ?? null,
    seeking: user.seeking ?? null,
    languages: user.languages ?? [],
    zodiac: user.zodiac ?? '',
    family: user.family ?? '',
    communication: user.communication ?? [],
    love: user.love ?? [],
    pets: user.pets ?? [],
    drinking: user.drinking ?? '',
    smoking: user.smoking ?? '',
    socials: user.socials ?? '',
    blind_bio: user.blindBio ?? null,
    blind_ideal_spot: user.blindIdealSpot ?? null,
    private_profile: !!user.privateProfile,
    updated_at: new Date().toISOString()
  };
}

export async function saveProfiles(users: User[]) {
  if (!supabase || users.length === 0) return null;
  const { error } = await supabase.from('profiles').upsert(users.map(profileRow)).select('id');
  if (error) console.error(error);
  return error?.message ?? null;
}

export async function saveProfile(user: User) {
  return saveProfiles([user]);
}

export async function setVerificationStatus(
  userId: string,
  status: 'pending' | 'approved' | 'rejected' | 'banned'
) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase.rpc('campy_set_verification', {
    target_id: userId,
    new_status: status
  });
  return error?.message ?? null;
}

export type LikeRow = { from_id: string; to_id: string; mode: string };
export type PassRow = { from_id: string; to_id: string; mode: string };
export type ReportRow = {
  id: string;
  reporterId: string;
  reportedId: string;
  reason: string;
  createdAt: string;
};

export type CampySnapshot = {
  profiles: User[];
  reports: ReportRow[];
  likes: LikeRow[];
  passes: PassRow[];
  matches: Match[];
  messages: Record<string, ChatMessage[]>;
  outreach: Outreach[];
  blockedIds: string[];
  groups: Group[];
};

function groupFromRows(
  row: Record<string, unknown>,
  members: { user_id: string; is_admin: boolean }[],
  bannedIds: string[] = []
): Group {
  const memberIds = members.map(member => member.user_id);
  const adminIds = members.filter(member => member.is_admin).map(member => member.user_id);
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    description: String(row.description ?? ''),
    category: (row.category as Group['category']) || 'Integración Campus',
    coverUrl: String(row.cover_url ?? ''),
    creatorId: String(row.creator_id),
    adminIds: adminIds.length ? adminIds : [String(row.creator_id)],
    memberIds,
    membersCount: memberIds.length,
    upvotesCount: Number(row.upvotes_count ?? 0),
    activeRecentCount: Math.min(memberIds.length, 3),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    university: String(row.university ?? ''),
    inviteCode: String(row.invite_code ?? ''),
    bannedIds
  };
}

export function makeInviteCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

export async function loadCampy(): Promise<CampySnapshot | null> {
  if (!supabase) return null;
  const [
    likesRes,
    passesRes,
    matchesRes,
    messagesRes,
    profilesRes,
    phonesRes,
    reportsRes,
    outreachRes,
    repliesRes,
    blocksRes,
    groupsRes,
    groupMembersRes,
    groupBansRes
  ] = await Promise.all([
    supabase.from('likes').select('from_id,to_id,mode'),
    supabase.from('passes').select('from_id,to_id,mode'),
    supabase.from('matches').select('*').order('matched_at', { ascending: false }),
    supabase.from('messages').select('*').order('created_at', { ascending: true }),
    supabase.from('profiles').select(PROFILE_COLUMNS),
    supabase.rpc('profile_phones'),
    supabase.from('reports').select('id,reporter_id,reported_id,reason,created_at').order('created_at', {
      ascending: false
    }),
    supabase.from('outreach').select('id,from_id,to_id,kind,body,created_at').order('created_at', {
      ascending: false
    }),
    supabase
      .from('outreach_replies')
      .select('id,outreach_id,sender_id,body,created_at')
      .order('created_at', { ascending: true }),
    supabase.from('blocks').select('blocked_id'),
    supabase.from('groups').select('*').order('created_at', { ascending: false }),
    supabase.from('group_members').select('group_id,user_id,is_admin'),
    supabase.from('group_bans').select('group_id,user_id')
  ]);

  if (profilesRes.error) {
    console.error(profilesRes.error);
    return null;
  }
  if (likesRes.error) console.error(likesRes.error);
  if (passesRes.error) console.error(passesRes.error);
  if (matchesRes.error) console.error(matchesRes.error);
  if (messagesRes.error) console.error(messagesRes.error);
  if (phonesRes.error) console.error(phonesRes.error);
  if (reportsRes.error) console.error(reportsRes.error);
  if (outreachRes.error) console.error(outreachRes.error);
  if (repliesRes.error) console.error(repliesRes.error);
  if (blocksRes.error) console.error(blocksRes.error);
  if (groupsRes.error) console.error(groupsRes.error);
  if (groupMembersRes.error) console.error(groupMembersRes.error);
  if (groupBansRes.error) console.error(groupBansRes.error);

  const membersByGroup = new Map<string, { user_id: string; is_admin: boolean }[]>();
  for (const row of groupMembersRes.data ?? []) {
    const list = membersByGroup.get(row.group_id) ?? [];
    list.push({ user_id: row.user_id, is_admin: !!row.is_admin });
    membersByGroup.set(row.group_id, list);
  }

  const bansByGroup = new Map<string, string[]>();
  for (const row of groupBansRes.data ?? []) {
    const list = bansByGroup.get(row.group_id) ?? [];
    list.push(row.user_id);
    bansByGroup.set(row.group_id, list);
  }

  const groups = (groupsRes.data ?? []).map(row =>
    groupFromRows(
      row as Record<string, unknown>,
      membersByGroup.get(String(row.id)) ?? [],
      bansByGroup.get(String(row.id)) ?? []
    )
  );

  const messages: Record<string, ChatMessage[]> = {};
  for (const row of messagesRes.data ?? []) {
    const msg: ChatMessage = {
      id: row.id,
      roomId: row.room_id,
      senderId: row.sender_id,
      senderName: row.sender_name ?? '',
      senderPhoto: row.sender_photo ?? undefined,
      content: row.content,
      timestamp: row.timestamp_label ?? '',
      isSystem: row.is_system,
      isDeleted: row.is_deleted
    };
    messages[msg.roomId] = [...(messages[msg.roomId] ?? []), msg];
  }

  const outreachRows = (outreachRes.error ? [] : outreachRes.data) ?? [];
  for (const row of outreachRows) {
    if (row.kind === 'note' && row.body) {
      messages[row.id] = [
        {
          id: `${row.id}_open`,
          roomId: row.id,
          senderId: row.from_id,
          senderName: '',
          content: row.body,
          timestamp: ''
        },
        ...(messages[row.id] ?? [])
      ];
    }
  }
  for (const row of (repliesRes.error ? [] : repliesRes.data) ?? []) {
    messages[row.outreach_id] = [
      ...(messages[row.outreach_id] ?? []),
      {
        id: row.id,
        roomId: row.outreach_id,
        senderId: row.sender_id,
        senderName: '',
        content: row.body,
        timestamp: ''
      }
    ];
  }

  const phones = new Map<string, string>();
  for (const row of phonesRes.data ?? []) {
    if (row.phone) phones.set(row.id, row.phone);
  }

  return {
    profiles: (profilesRes.data ?? []).map(row =>
      userFromRow(row as Record<string, unknown>, phones.get(String(row.id)) ?? '')
    ),
    reports: (reportsRes.data ?? []).map(row => ({
      id: row.id,
      reporterId: row.reporter_id,
      reportedId: row.reported_id,
      reason: row.reason,
      createdAt: row.created_at
    })),
    blockedIds: (blocksRes.data ?? []).map(row => String(row.blocked_id)),
    likes: likesRes.data ?? [],
    passes: passesRes.data ?? [],
    matches: (matchesRes.data ?? []).map(row => matchFromRow(row as Record<string, unknown>)),
    messages,
    outreach: outreachRows.map(row => ({
      id: String(row.id),
      fromId: String(row.from_id),
      toId: String(row.to_id),
      kind: row.kind === 'note' ? 'note' : 'superlike',
      body: row.body ? String(row.body) : undefined,
      createdAt: String(row.created_at)
    })),
    groups
  };
}

export async function saveGroup(group: Group) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase.from('groups').upsert({
    id: group.id,
    name: group.name,
    description: group.description,
    category: group.category,
    cover_url: group.coverUrl,
    creator_id: group.creatorId,
    university: group.university,
    invite_code: group.inviteCode,
    tags: group.tags,
    upvotes_count: group.upvotesCount,
    created_at: group.createdAt
  });
  if (error) return error.message;

  const members = group.memberIds.map(userId => ({
    group_id: group.id,
    user_id: userId,
    is_admin: group.adminIds.includes(userId) || userId === group.creatorId
  }));
  const { error: membersError } = await supabase.from('group_members').upsert(members);
  return membersError?.message ?? null;
}

export async function joinGroupRemote(groupId: string, userId: string) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase.from('group_members').upsert({
    group_id: groupId,
    user_id: userId,
    is_admin: false
  });
  return error?.message ?? null;
}

export async function leaveGroupRemote(groupId: string, userId: string) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId);
  return error?.message ?? null;
}

export async function deleteGroupRemote(groupId: string) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase.from('groups').delete().eq('id', groupId);
  return error?.message ?? null;
}

export async function setGroupMemberAdmin(groupId: string, userId: string, isAdmin: boolean) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase
    .from('group_members')
    .update({ is_admin: isAdmin })
    .eq('group_id', groupId)
    .eq('user_id', userId);
  return error?.message ?? null;
}

export async function kickGroupMemberRemote(groupId: string, userId: string) {
  return leaveGroupRemote(groupId, userId);
}

export async function findGroupByCode(code: string) {
  if (!supabase) return null;
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .ilike('invite_code', normalized)
    .maybeSingle();
  if (error || !data) return null;
  const { data: members } = await supabase
    .from('group_members')
    .select('user_id,is_admin')
    .eq('group_id', data.id);
  const { data: bans } = await supabase.from('group_bans').select('user_id').eq('group_id', data.id);
  return groupFromRows(
    data as Record<string, unknown>,
    members ?? [],
    (bans ?? []).map(row => String(row.user_id))
  );
}

export async function banGroupMemberRemote(groupId: string, userId: string, bannedBy: string) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const kickError = await kickGroupMemberRemote(groupId, userId);
  if (kickError) return kickError;
  const { error } = await supabase.from('group_bans').upsert({
    group_id: groupId,
    user_id: userId,
    banned_by: bannedBy
  });
  return error?.message ?? null;
}

export async function bumpGroupUpvote(groupId: string, nextCount: number) {
  if (!supabase) return;
  await supabase.from('groups').update({ upvotes_count: nextCount }).eq('id', groupId);
}

export async function saveOutreach(row: Outreach) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase.from('outreach').insert({
    id: row.id,
    from_id: row.fromId,
    to_id: row.toId,
    kind: row.kind,
    body: row.body ?? null
  });
  return error?.message ?? null;
}

export async function saveOutreachReply(
  id: string,
  outreachId: string,
  senderId: string,
  body: string
) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase.from('outreach_replies').insert({
    id,
    outreach_id: outreachId,
    sender_id: senderId,
    body
  });
  return error?.message ?? null;
}

export async function saveLike(fromId: string, toId: string, mode: string) {
  if (!supabase) return;
  const { error } = await supabase.from('likes').upsert({ from_id: fromId, to_id: toId, mode });
  if (error) console.error(error);
}

export async function savePass(fromId: string, toId: string, mode: string) {
  if (!supabase) return;
  const { error } = await supabase.from('passes').upsert({ from_id: fromId, to_id: toId, mode });
  if (error) console.error(error);
}

export async function deletePass(fromId: string, toId: string, mode: string) {
  if (!supabase) return;
  const { error } = await supabase.from('passes').delete().eq('from_id', fromId).eq('to_id', toId).eq('mode', mode);
  if (error) console.error(error);
}

export async function clearSwipes(fromId: string, mode: string) {
  if (!supabase) return;
  await supabase.from('likes').delete().eq('from_id', fromId).eq('mode', mode);
  await supabase.from('passes').delete().eq('from_id', fromId).eq('mode', mode);
}

export async function saveMatch(match: Match) {
  if (!supabase) return;
  const { error } = await supabase.from('matches').upsert({
    id: match.id,
    user1_id: match.user1Id,
    user2_id: match.user2Id,
    type: match.type,
    matched_at: match.matchedAt,
    last_message: match.lastMessage ?? null,
    last_message_time: match.lastMessageTime ?? null
  });
  if (error) console.error(error);
}

export async function saveMessage(message: ChatMessage) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase.from('messages').upsert({
    id: message.id,
    room_id: message.roomId,
    sender_id: message.senderId,
    sender_name: message.senderName,
    sender_photo: message.senderPhoto ?? null,
    content: message.content,
    timestamp_label: message.timestamp,
    is_system: !!message.isSystem,
    is_deleted: !!message.isDeleted
  });
  if (error) {
    console.error(error);
    return error.message;
  }
  return null;
}

export async function touchMatchPreview(matchId: string, lastMessage: string) {
  if (!supabase) return;
  await supabase
    .from('matches')
    .update({ last_message: lastMessage, last_message_time: 'Recién' })
    .eq('id', matchId);
}

export async function saveReport(reporterId: string, reportedId: string, reason: string) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase.from('reports').insert({
    reporter_id: reporterId,
    reported_id: reportedId,
    reason
  });
  return error?.message ?? null;
}

export async function reportAndBlockUser(reportedId: string, reason: string) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase.rpc('campy_report_and_block', {
    reported_id: reportedId,
    report_reason: reason
  });
  return error?.message ?? null;
}

export async function setUserRole(userId: string, role: 'admin' | 'student') {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase.rpc('campy_set_role', {
    target_id: userId,
    new_role: role
  });
  return error?.message ?? null;
}

export async function banCampyAccount(userId: string) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase.rpc('campy_ban_account', { target_id: userId });
  return error?.message ?? null;
}

export async function deleteCampyAccount(targetId: string) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase.rpc('delete_campy_account', { target_id: targetId });
  return error?.message ?? null;
}

export async function listUniversities() {
  if (!supabase) return [];
  const { data, error } = await supabase.from('universities').select('name').order('name');
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []).map(row => String(row.name));
}

export async function addUniversity(name: string) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase.from('universities').insert({ name });
  return error?.message ?? null;
}

export async function removeUniversity(name: string) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase.from('universities').delete().eq('name', name);
  return error?.message ?? null;
}

export async function renameUniversity(oldName: string, newName: string) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase.from('universities').update({ name: newName }).eq('name', oldName);
  return error?.message ?? null;
}

export type AdRow = {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
  linkUrl?: string;
  active: boolean;
};

function adFromRow(row: Record<string, unknown>): AdRow {
  return {
    id: String(row.id),
    title: String(row.title ?? ''),
    body: String(row.body ?? ''),
    imageUrl: row.image_url ? String(row.image_url) : undefined,
    linkUrl: row.link_url ? String(row.link_url) : undefined,
    active: !!row.active
  };
}

export async function listAds() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('ads')
    .select('id,title,body,image_url,link_url,active,created_at')
    .order('created_at', { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []).map(row => adFromRow(row as Record<string, unknown>));
}

export async function createAd(input: {
  title: string;
  body: string;
  imageUrl?: string;
  linkUrl?: string;
}) {
  if (!supabase) return { error: 'Sin conexión con el servidor.' };
  const { data, error } = await supabase
    .from('ads')
    .insert({
      title: input.title,
      body: input.body,
      image_url: input.imageUrl || null,
      link_url: input.linkUrl || null,
      active: true
    })
    .select('id,title,body,image_url,link_url,active')
    .single();
  if (error || !data) return { error: error?.message ?? 'No se pudo guardar el anuncio.' };
  return { ad: adFromRow(data as Record<string, unknown>) };
}

export async function deleteAd(id: string) {
  if (!supabase) return 'Sin conexión con el servidor.';
  const { error } = await supabase.from('ads').delete().eq('id', id);
  return error?.message ?? null;
}
