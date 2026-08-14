import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useRoomStore, makeMessageId } from '@/stores/useRoomStore';
import { getMockRoomById } from '@/services/mocks/roomData';
import { randomDialogue } from '@/services/mocks/npcDialogue';
import { PlayerStrip } from './PlayerStrip';
import { GameStage } from './GameStage';
import { ChatOverlay, ChatInputBar } from './ChatOverlay';
import { Icon } from '@/shared/components/Icon';
import type { ChatMessage } from '@/types';

/**
 * 房间页（核心场景）
 *
 * 布局：游戏中心型 + 大房主导（8-20人）
 *
 * ┌─────────────────────────┐
 * │ 房名 公告      人数 ⚙️退出 │ ← 顶栏
 * ├─────────────────────────┤
 * │ ● ● ● ● ● ● ● ●  (横滑)  │ ← 玩家头像条
 * ├─────────────────────────┤
 * │                         │
 * │     游戏舞台（主视觉）     │ ← 中央：游戏/氛围
 * │     + 聊天浮层叠加         │
 * │                         │
 * ├─────────────────────────┤
 * │ 表情行 + [输入框] [发送]   │ ← 底部操作
 * └─────────────────────────┘
 */
export default function RoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const currentPlayer = usePlayerStore((s) => s.player);
  const { room, messages, speakingPlayerId, enterRoom, leaveRoom, addMessage, setSpeaking } =
    useRoomStore();

  const [draft, setDraft] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // 进入房间：加载 Mock 房间数据
  useEffect(() => {
    const mockRoom = roomId ? getMockRoomById(roomId) : undefined;
    if (mockRoom) {
      // 把当前用户加入玩家列表头部
      if (currentPlayer) {
        const withMe = {
          ...mockRoom,
          players: [currentPlayer, ...mockRoom.players.filter((p) => p.id !== currentPlayer.id)],
        };
        enterRoom(withMe);
        setIsPlaying(mockRoom.isPlaying);
      } else {
        enterRoom(mockRoom);
      }
    }
    // 离开时清理
    return () => leaveRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, currentPlayer?.id]);

  // NPC 自动发言循环：每 2.5-5 秒有一个 NPC 说话
  useEffect(() => {
    if (!room) return;
    const npcs = room.players.filter((p) => p.isNpc);
    if (npcs.length === 0) return;

    let timer: ReturnType<typeof setTimeout>;
    let active = true;

    const scheduleNext = () => {
      const delay = 2500 + Math.random() * 2500;
      timer = setTimeout(() => {
        if (!active || !room) return;
        const npc = npcs[Math.floor(Math.random() * npcs.length)];
        const text = randomDialogue(npc.personality!);

        // 发言者高亮
        setSpeaking(npc.id);

        // 稍延迟显示消息（模拟"说话中"）
        setTimeout(() => {
          if (!active) return;
          const msg: ChatMessage = {
            id: makeMessageId(),
            roomId: room.id,
            senderId: npc.id,
            text,
            createdAt: Date.now(),
          };
          addMessage(msg);
        }, 600);

        // 发言高亮持续 1.8 秒后熄灭
        setTimeout(() => {
          if (active) setSpeaking(null);
        }, 1800);

        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [room, addMessage, setSpeaking]);

  const playersById = useMemo(() => {
    const map = new Map();
    room?.players.forEach((p) => map.set(p.id, p));
    return map;
  }, [room]);

  if (!room) {
    return (
      <div className="flex h-full items-center justify-center text-white/40">
        房间加载中...
      </div>
    );
  }

  const isHost = currentPlayer ? room.hostId === currentPlayer.id : false;

  // 发送消息
  const handleSend = () => {
    if (!draft.trim() || !currentPlayer || !room) return;
    const msg: ChatMessage = {
      id: makeMessageId(),
      roomId: room.id,
      senderId: currentPlayer.id,
      text: draft.trim(),
      createdAt: Date.now(),
    };
    addMessage(msg);
    setDraft('');
    // 自己发言也高亮一下
    setSpeaking(currentPlayer.id);
    setTimeout(() => setSpeaking(null), 1500);
  };

  const handleEmoji = (emoji: string) => {
    if (!currentPlayer || !room) return;
    const msg: ChatMessage = {
      id: makeMessageId(),
      roomId: room.id,
      senderId: currentPlayer.id,
      text: emoji,
      createdAt: Date.now(),
    };
    addMessage(msg);
  };

  const handleLeave = () => {
    leaveRoom();
    navigate('/lobby');
  };

  return (
    <div className="flex h-full flex-col">
      {/* 顶栏 */}
      <header className="flex items-center justify-between px-4 py-2">
        <button
          onClick={handleLeave}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70"
        >
          <Icon name="back" size={18} />
        </button>
        <div className="flex-1 px-3 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="truncate font-semibold">{room.name}</h1>
            {room.isHot && <Icon name="fire" size={14} className="shrink-0 text-orange-400" />}
          </div>
          <p className="truncate text-xs text-white/40">{room.announcement}</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {room.players.length}
        </div>
      </header>

      {/* 玩家头像条 */}
      <PlayerStrip
        players={room.players}
        hostId={room.hostId}
        currentUserId={currentPlayer?.id ?? null}
        speakingPlayerId={speakingPlayerId}
      />

      {/* 游戏舞台 + 聊天浮层（相对定位容器） */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <GameStage
          gameType={room.gameType}
          isPlaying={isPlaying}
          roomName={room.name}
          isHost={isHost}
          onStartGame={() => setIsPlaying(true)}
        />
        {/* 聊天浮层叠加在游戏舞台下半部 */}
        <ChatOverlay
          messages={messages}
          playersById={playersById}
          currentUserId={currentPlayer?.id ?? null}
        />
      </div>

      {/* 底部输入栏 */}
      <ChatInputBar value={draft} onChange={setDraft} onSend={handleSend} onEmoji={handleEmoji} />
    </div>
  );
}
