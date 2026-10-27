import type { Match, User } from '../types';

export function hasOpenConversation(viewerId: string, otherId: string, matches: Match[]) {
  return matches.some(
    match =>
      (match.user1Id === viewerId && match.user2Id === otherId) ||
      (match.user2Id === viewerId && match.user1Id === otherId)
  );
}

export function canSeeRealIdentity(viewerId: string, user: User, matches: Match[]) {
  if (!user.privateProfile) return true;
  if (user.id === viewerId) return true;
  return hasOpenConversation(viewerId, user.id, matches);
}

export function publicName(viewerId: string, user: User, matches: Match[]) {
  return canSeeRealIdentity(viewerId, user, matches) ? user.name : 'Anónimo';
}

export function publicPhoto(viewerId: string, user: User, matches: Match[]) {
  return canSeeRealIdentity(viewerId, user, matches) ? user.photoUrl : '';
}
