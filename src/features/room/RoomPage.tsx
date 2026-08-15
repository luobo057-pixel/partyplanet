import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useRoomStore, makeMessageId } from '@/stores/useRoomStore';
import { getMockRoomById } from '@/services/mocks/roomData';
import { randomDialogue } from '@/services/mocks/npcDialogue';
import type { NpcProfile } from '@/services/mocks/npcData';
import { PlayerStrip } from './PlayerStrip';
import { GameStage } from './GameStage';
import { ChatOverlay, ChatInputBar } from './ChatOverlay';
import { GiftPanel } from './GiftPanel';
import { GiftFx, type GiftEffect } from './GiftFx';
import type { GiftItem } from './giftCatalog';
import { PlayerCardSheet } from '@/features/social/PlayerCardSheet';
import { Icon } from '@/shared/components/Icon';
import type { Player } from '@/types';

/**
 * Room page (core scene) — game-center layout for big rooms.
 */
export default function RoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const currentPlayer = usePlayerStore((s) => s.player);
  const coins = usePlayerStore((s) => s.player?.coins ?? 0);
  const spendCoins = usePlayerStore((s) => s.spendCoins);
  const {
    room,
    messages,
    speakingPlayerId,
    enterRoom,
    leaveRoom,
    addMessage,
    setSpeaking,
    setPlaying,
  } = useRoomStore();

  const [draft, setDraft] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftFx, setGiftFx] = useState<GiftEffect | null>(null);

  /** All pending timeouts (speaking reset etc.) — cleared on unmount */
  const pendingTimers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const trackTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      pendingTimers.current.delete(id);
      fn();
    }, ms);
    pendingTimers.current.add(id);
    return id;
  };
  useEffect(() => {
    const timers = pendingTimers.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, []);

  // Enter room: load mock data, real player takes over as host (MVP rule)
  useEffect(() => {
    const mockRoom = roomId ? getMockRoomById(roomId) : undefined;
    if (mockRoom) {
      if (currentPlayer) {
        const withMe: typeof mockRoom = {
          ...mockRoom,
          // MVP: the entering real player becomes host → can start games.
          // Reset the mock "in progress" state so the host sees Start Game.
          hostId: currentPlayer.id,
          host: currentPlayer,
          isPlaying: false,
          players: [currentPlayer, ...mockRoom.players.filter((p) => p.id !== currentPlayer.id)],
        };
        enterRoom(withMe);
      } else {
        enterRoom(mockRoom);
      }
    }
    return () => leaveRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, currentPlayer?.id]);

  // NPC auto-chat loop: one NPC speaks every 2.5-5s
  useEffect(() => {
    if (!room) return;
    const npcs = room.players.filter((p): p is NpcProfile => p.isNpc === true);
    if (npcs.length === 0) return;

    let chainTimer: ReturnType<typeof setTimeout> | undefined;
    let active = true;
    const inner = new Set<ReturnType<typeof setTimeout>>();

    const scheduleNext = () => {
      chainTimer = setTimeout(() => {
        if (!active || !room) return;
        const npc = npcs[Math.floor(Math.random() * npcs.length)];
        const text = randomDialogue(npc.personality);

        setSpeaking(npc.id);

        // message appears shortly after "speaking" starts
        const t1 = setTimeout(() => {
          if (!active) return;
          addMessage({
            id: makeMessageId(),
            roomId: room.id,
            senderId: npc.id,
            text,
            createdAt: Date.now(),
          });
        }, 600);
        inner.add(t1);

        const t2 = setTimeout(() => {
          if (active) setSpeaking(null);
        }, 1800);
        inner.add(t2);

        scheduleNext();
      }, 2500 + Math.random() * 2500);
    };

    scheduleNext();
    return () => {
      active = false;
      if (chainTimer) clearTimeout(chainTimer);
      inner.forEach(clearTimeout);
      inner.clear();
    };
  }, [room, addMessage, setSpeaking]);

  const playersById = useMemo(() => {
    const map = new Map();
    room?.players.forEach((p) => map.set(p.id, p));
    return map;
  }, [room]);

  if (!room) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-white/40">
        Loading room...
      </div>
    );
  }

  const isHost = currentPlayer ? room.hostId === currentPlayer.id : false;
  const shownCount = Math.min(room.displayCount ?? room.players.length, room.maxPlayers);

  /** Highlight my own avatar briefly after I send anything */
  const highlightMe = () => {
    if (!currentPlayer) return;
    setSpeaking(currentPlayer.id);
    trackTimeout(() => setSpeaking(null), 1500);
  };

  const handleSend = () => {
    if (!draft.trim() || !currentPlayer || !room) return;
    addMessage({
      id: makeMessageId(),
      roomId: room.id,
      senderId: currentPlayer.id,
      text: draft.trim(),
      createdAt: Date.now(),
    });
    setDraft('');
    highlightMe();
  };

  const handleEmoji = (emoji: string) => {
    if (!currentPlayer || !room) return;
    addMessage({
      id: makeMessageId(),
      roomId: room.id,
      senderId: currentPlayer.id,
      text: emoji,
      createdAt: Date.now(),
    });
    highlightMe();
  };

  /** Send a gift: pay, post to chat, trigger tier effect */
  const handleGiftSend = (gift: GiftItem) => {
    if (!currentPlayer || !room || !spendCoins(gift.price)) return;
    addMessage({
      id: makeMessageId(),
      roomId: room.id,
      senderId: currentPlayer.id,
      text: `${gift.emoji} ${gift.name}`,
      createdAt: Date.now(),
    });
    setGiftFx({
      id: Date.now(),
      gift,
      fromNickname: currentPlayer.nickname,
    });
    highlightMe();
    setGiftOpen(false);
  };

  const handleLeave = () => {
    leaveRoom();
    navigate('/lobby');
  };

  return (
    <div className="relative flex h-full flex-col">
      {/* Top bar */}
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
          {shownCount}
        </div>
      </header>

      {/* Player strip */}
      <PlayerStrip
        players={room.players}
        hostId={room.hostId}
        currentUserId={currentPlayer?.id ?? null}
        speakingPlayerId={speakingPlayerId}
        onSelectPlayer={(p) => setSelectedPlayer(p)}
      />

      {/* Game stage + chat overlay */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <GameStage
          gameType={room.gameType}
          isPlaying={room.isPlaying}
          roomName={room.name}
          isHost={isHost}
          // While idle the stage (incl. Start Game) stays put — NPC chatter
          // must never play whack-a-mole with the host's button.
          // Once playing, speech takes the stage.
          active={!room.isPlaying || speakingPlayerId === null}
          onStartGame={() => setPlaying(true)}
        />
        <ChatOverlay
          messages={messages}
          playersById={playersById}
          currentUserId={currentPlayer?.id ?? null}
        />
      </div>

      {/* Input bar */}
      <ChatInputBar
        value={draft}
        onChange={setDraft}
        onSend={handleSend}
        onEmoji={handleEmoji}
        onGift={() => setGiftOpen(true)}
      />

      {/* Gift panel (input bar gift button) */}
      {giftOpen && (
        <GiftPanel coins={coins} onClose={() => setGiftOpen(false)} onSend={handleGiftSend} />
      )}

      {/* Gift send effect (tier-driven) */}
      {giftFx && <GiftFx effect={giftFx} onDone={() => setGiftFx(null)} />}

      {/* Player card sheet (avatar tap → add friend) */}
      {selectedPlayer && (
        <PlayerCardSheet player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      )}
    </div>
  );
}
