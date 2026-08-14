import { type SVGProps } from 'react';

/**
 * 统一 SVG 图标库
 *
 * 设计规范：
 * - 线条风（stroke-based），24x24 viewBox，描边 2px
 * - 继承 currentColor，可通过 className/text-* 控制颜色
 * - 通过 size prop 控制尺寸（默认 24）
 *
 * 用法：
 *   <Icon name="home" size={24} className="text-white/70" />
 */

export type IconName =
  // 导航 & 通用
  | 'home'
  | 'game'
  | 'user'
  | 'bell'
  | 'search'
  | 'back'
  | 'close'
  | 'settings'
  | 'bolt' // 闪电（快速匹配）
  // 游戏类型
  | 'dice' // 真心话大冒险
  | 'spy' // 谁是卧底
  | 'brain' // 抢答题
  | 'chat' // 纯聊天
  // 房间状态
  | 'fire' // 热门
  | 'crown' // 房主
  | 'send' // 发送
  | 'coin' // 金币
  | 'gem' // 游戏币（钻石）
  // 其他
  // 社交关系
  | 'pen' // 签名
  | 'heart-handshake' // 亲密关系
  | 'users' // 家族
  | 'gift' // 礼物
  | 'star' // 星星
  | 'trophy' // 战绩/奖杯
  | 'image' // 动态图片
  | 'shopping-bag' // 资产/购物
  | 'more'; // 更多（三点菜单）

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

const PATHS: Record<IconName, JSX.Element> = {
  // ============ 导航 & 通用 ============
  home: (
    <>
      {/* 屋顶：人字线 */}
      <path d="M3 10.5 12 3l9 7.5" strokeLinejoin="round" />
      {/* 房身：U 形，与屋顶留 2 单位间隙（半透明描边相交会叠出亮点） */}
      <path d="M6 12v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7" />
    </>
  ),
  game: (
    <>
      {/* 2×2 房间网格：格子间留 2 单位描边间隙，小尺寸下不粘连 */}
      <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="2" />
      <rect x="14" y="3.5" width="6.5" height="6.5" rx="2" />
      <rect x="3.5" y="14" width="6.5" height="6.5" rx="2" />
      <rect x="14" y="14" width="6.5" height="6.5" rx="2" />
    </>
  ),
  user: (
    <>
      {/* 头部上移，与肩膀描边带留 1 单位间隙（避免半透明叠点） */}
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </>
  ),
  bell: (
    <>
      <path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5 2 6H4c.5-1 2-2 2-6Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </>
  ),
  back: <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />,
  close: <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" strokeLinecap="round" />
    </>
  ),
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" strokeLinejoin="round" />,

  // ============ 游戏类型 ============
  dice: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="16" cy="16" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  spy: (
    <>
      {/* 帽檐 */}
      <path d="M3 13c0-1 1-2 2-2h14c1 0 2 1 2 2v1H3v-1Z" />
      {/* 帽顶 */}
      <path d="M5 11c0-4 3-7 7-7s7 3 7 7" />
      {/* 眼睛 */}
      <circle cx="9.5" cy="15" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="15" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  brain: (
    <>
      <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3V4Z" />
      <path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3V4Z" />
      <path d="M9 9h2M13 9h2M9 14h2M13 14h2" strokeLinecap="round" />
    </>
  ),
  chat: (
    <>
      <path d="M21 12c0 4-4 7-9 7-1.3 0-2.5-.2-3.6-.6L3 20l1.5-4C3.5 15 3 13.5 3 12c0-4 4-7 9-7s9 3 9 7Z" />
    </>
  ),

  // ============ 房间状态 ============
  fire: (
    <path
      d="M12 2c1 3-1 4-2 6s0 4 2 4 3-1 3-3c2 1 3 3 3 5a6 6 0 1 1-12 0c0-3 2-4 3-6 1-3 3-4 3-6Z"
      strokeLinejoin="round"
    />
  ),
  crown: (
    <path
      d="M3 18h18M4 8l4 4 4-6 4 6 4-4-1.5 10h-13L4 8Z"
      strokeLinejoin="round"
    />
  ),
  send: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" strokeLinejoin="round" />,
  coin: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.5" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" strokeLinecap="round" />
    </>
  ),
  gem: (
    <path
      d="M6 3h12l4 6-10 12L2 9l4-6Z M6 3l4 6h4l4-6 M2 9h20 M10 9l2 12 2-12"
      strokeLinejoin="round"
    />
  ),

  // ============ 其他 ============

  // ============ Social relations ============
  pen: (
    <>
      <path d="M12 19l7-7 3 3-7 7-3-3Z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z M2 2l7.586 7.586" strokeLinejoin="round" />
      <circle cx="11" cy="11" r="2" />
    </>
  ),
  'heart-handshake': (
    <>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06" />
      <path d="M12 5.67l-1.06-1.06" />
      <path d="M8 14c2-3 5-3 7-1l1 1-3 3-1-1c-1-1-3-1-4 0l-2 2 1 1c2 2 5 2 7 0l4-4" strokeLinejoin="round" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M4 12v9h16v-9" strokeLinejoin="round" />
      <path d="M12 8v13" />
      <path d="M12 8S10.5 3 8 3a2.5 2.5 0 0 0 0 5h4Z M12 8s1.5-5 4-5a2.5 2.5 0 0 1 0 5h-4Z" strokeLinejoin="round" />
    </>
  ),
  star: (
    <path
      d="M12 2l3 7h7l-5.5 4.5L18 22l-6-4-6 4 1.5-8.5L2 9h7l3-7Z"
      strokeLinejoin="round"
    />
  ),
  trophy: (
    <>
      <path d="M6 4h12v6a6 6 0 0 1-12 0V4Z" strokeLinejoin="round" />
      <path d="M6 6H4a2 2 0 0 0 0 4h2 M18 6h2a2 2 0 0 1 0 4h-2" strokeLinejoin="round" />
      <path d="M12 16v4 M9 22h6" strokeLinecap="round" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" strokeLinejoin="round" />
    </>
  ),
  'shopping-bag': (
    <>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" strokeLinejoin="round" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" strokeLinecap="round" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
};

export function Icon({ name, size = 24, className = '', ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
