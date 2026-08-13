import { memo } from 'react';
import type { Player } from '@/types';
import { SimpleAvatar, type SimpleAvatarProps } from './SimpleAvatar';

/**
 * 玩家头像：根据 Player 对象渲染
 * 是 SimpleAvatar 的便捷封装，调用方传 player 即可
 */
export interface PlayerAvatarProps extends Omit<SimpleAvatarProps, 'nickname' | 'config'> {
  player: Player;
}

function PlayerAvatarImpl({ player, ...rest }: PlayerAvatarProps) {
  return <SimpleAvatar nickname={player.nickname} config={player.avatar} {...rest} />;
}

export const PlayerAvatar = memo(PlayerAvatarImpl);
