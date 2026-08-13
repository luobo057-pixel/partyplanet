import { memo } from 'react';
import type { AvatarConfig } from '@/types';
import { Icon } from './Icon';

/**
 * 简洁占位头像
 *
 * 虚拟形象（捏脸）系统暂时移除，等待后续用专业方案（Live2D/Rive/美术资源）重做。
 * 当前用"渐变色块 + 昵称首字"作为头像，干净、零依赖、不失产品感。
 *
 * - AvatarConfig 仍保留在类型系统中，这里的 skinTone/hairColor 等字段
 *   被用来生成稳定的渐变色，保证同一个玩家每次头像颜色一致。
 * - 未来接入真实虚拟形象时，只需把此组件替换为新渲染器，
 *   调用方（房间、大厅、个人页）零改动。
 */

export interface SimpleAvatarProps {
  /** 昵称，取首字显示 */
  nickname: string;
  /** 头像配置（用于生成稳定的渐变色） */
  config?: AvatarConfig;
  size?: number;
  circle?: boolean;
  /** 状态环：active = 正在说话高亮，online = 绿点，idle = 无 */
  ring?: 'active' | 'online' | 'idle';
  /** 是否为房主（显示皇冠角标） */
  isHost?: boolean;
  className?: string;
}

// 预设的渐变色组合（派对风鲜亮配色）
const GRADIENTS = [
  ['#F43F5E', '#FB7185'], // 粉
  ['#8B5CF6', '#A78BFA'], // 紫
  ['#3B82F6', '#60A5FA'], // 蓝
  ['#10B981', '#34D399'], // 绿
  ['#F59E0B', '#FBBF24'], // 橙
  ['#EC4899', '#F472B6'], // 玫红
  ['#06B6D4', '#22D3EE'], // 青
  ['#8B5CF6', '#EC4899'], // 紫粉
];

/** 根据 AvatarConfig 生成稳定的渐变索引 */
function gradientIndex(config: AvatarConfig | undefined): number {
  if (!config) return 0;
  const sum =
    config.skinTone +
    config.hairColor * 3 +
    config.outfitColor * 5 +
    config.faceStyle * 7 +
    config.hairStyle * 11;
  return sum % GRADIENTS.length;
}

/** 取昵称首字（中文取第一个字，英文取首字母大写） */
function initialOf(nickname: string): string {
  const trimmed = nickname.trim();
  if (!trimmed) return '?';
  const first = trimmed[0];
  return /[a-z]/.test(first) ? first.toUpperCase() : first;
}

function SimpleAvatarImpl({
  nickname,
  config,
  size = 48,
  circle = true,
  ring = 'idle',
  isHost = false,
  className = '',
}: SimpleAvatarProps) {
  const [from, to] = GRADIENTS[gradientIndex(config)];
  const ringClass =
    ring === 'active'
      ? 'ring-4 ring-brand-400 ring-offset-2 ring-offset-night-900'
      : ring === 'online'
      ? 'ring-2 ring-emerald-400/70'
      : '';

  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <div
        className={`flex h-full w-full items-center justify-center font-bold text-white ${ringClass}`}
        style={{
          borderRadius: circle ? '9999px' : '20%',
          background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
          fontSize: size * 0.42,
          boxShadow: ring === 'active' ? `0 0 ${size * 0.3}px ${from}88` : 'none',
        }}
      >
        {initialOf(nickname)}
      </div>

      {/* 房主皇冠角标 */}
      {isHost && (
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-amber-400 text-night-900 shadow"
          style={{ width: size * 0.42, height: size * 0.42 }}
        >
          <Icon name="crown" size={size * 0.26} strokeWidth={2.5} />
        </span>
      )}

      {/* 在线绿点 */}
      {ring === 'online' && (
        <span
          className="absolute bottom-0 right-0 block rounded-full border-2 border-night-900 bg-emerald-400"
          style={{ width: size * 0.2, height: size * 0.2 }}
        />
      )}
    </div>
  );
}

export const SimpleAvatar = memo(SimpleAvatarImpl);
