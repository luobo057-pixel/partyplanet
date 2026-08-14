import { create } from 'zustand';
import type { ChatMessage, PlayerId } from '@/types';
import type { RoomWithHost } from '@/services/mocks/roomData';

/**
 * Room store — current room, chat messages, speaking highlight.
 *
 * Mock-only data source for MVP; swap for RoomSyncProvider pushes
 * when the real backend lands.
 */

/** Cap on retained chat messages (memory guard for long sessions) */
const MAX_MESSAGES = 100;

interface RoomStore {
  /** Current room (null = not in a room) */
  room: RoomWithHost | null;
  /** Chat messages, chronological */
  messages: ChatMessage[];
  /** Currently speaking player id (avatar highlight) */
  speakingPlayerId: PlayerId | null;

  enterRoom: (room: RoomWithHost) => void;
  leaveRoom: () => void;
  addMessage: (msg: ChatMessage) => void;
  setSpeaking: (playerId: PlayerId | null) => void;
  /** Toggle in-room game state (single source of truth lives here) */
  setPlaying: (playing: boolean) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  messages: [],
  speakingPlayerId: null,

  enterRoom: (room) =>
    set({
      room,
      messages: [],
      speakingPlayerId: null,
    }),

  leaveRoom: () =>
    set({
      room: null,
      messages: [],
      speakingPlayerId: null,
    }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg].slice(-MAX_MESSAGES),
    })),

  setSpeaking: (playerId) => set({ speakingPlayerId: playerId }),

  setPlaying: (playing) =>
    set((state) =>
      state.room ? { room: { ...state.room, isPlaying: playing } } : {},
    ),
}));

/** Generate a message id */
export function makeMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}
