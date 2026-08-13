import { create } from 'zustand';
import type { ChatMessage, PlayerId } from '@/types';
import type { RoomWithHost } from '@/services/mocks/roomData';

/**
 * 房间状态 Store
 *
 * 管理当前所在房间的：
 * - 房间信息
 * - 聊天消息列表
 * - 当前正在发言的玩家（用于头像高亮动画）
 *
 * 注意：MVP 阶段所有状态都是本地的（NPC 模拟），
 * 未来接入 WebSocket 时，只需把这里的数据来源换成 RoomSyncProvider 推送即可。
 */

interface RoomStore {
  /** 当前房间（null 表示未在房间） */
  room: RoomWithHost | null;
  /** 聊天消息（按时间正序） */
  messages: ChatMessage[];
  /** 当前正在发言的玩家ID（头像高亮用） */
  speakingPlayerId: PlayerId | null;

  /** 进入房间 */
  enterRoom: (room: RoomWithHost) => void;
  /** 离开房间 */
  leaveRoom: () => void;
  /** 追加一条消息 */
  addMessage: (msg: ChatMessage) => void;
  /** 批量追加消息（NPC 模拟用） */
  addMessages: (msgs: ChatMessage[]) => void;
  /** 设置当前发言者 */
  setSpeaking: (playerId: PlayerId | null) => void;
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
    set((state) => ({ messages: [...state.messages, msg] })),

  addMessages: (msgs) =>
    set((state) => ({ messages: [...state.messages, ...msgs] })),

  setSpeaking: (playerId) => set({ speakingPlayerId: playerId }),
}));

/** 生成消息ID */
export function makeMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}
