import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, PlayerId } from '@/types';

/**
 * Friends store — persisted to localStorage.
 *
 * MVP semantics: adding a friend takes effect immediately (NPC auto-accepts).
 * Real backend later: pending → accepted handshake via RoomSyncProvider.
 */

export interface FriendEntry {
  player: Player;
  /** ISO timestamp when friendship started */
  since: string;
}

interface FriendsStore {
  friends: FriendEntry[];
  addFriend: (player: Player) => void;
  removeFriend: (playerId: PlayerId) => void;
  isFriend: (playerId: PlayerId) => boolean;
}

export const useFriendsStore = create<FriendsStore>()(
  persist(
    (set, get) => ({
      friends: [],

      addFriend: (player) => {
        if (get().friends.some((f) => f.player.id === player.id)) return;
        set((state) => ({
          friends: [...state.friends, { player, since: new Date().toISOString() }],
        }));
      },

      removeFriend: (playerId) =>
        set((state) => ({
          friends: state.friends.filter((f) => f.player.id !== playerId),
        })),

      isFriend: (playerId) => get().friends.some((f) => f.player.id === playerId),
    }),
    { name: 'partyplanet-friends' },
  ),
);

/** 便捷选择器：好友数 */
export const useFriendCount = (): number =>
  useFriendsStore((s) => s.friends.length);
