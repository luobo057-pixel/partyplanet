/**
 * 设计规范 Tokens
 *
 * 统一全 App 的间距、圆角、字号，解决"间距不符合标准"的问题。
 * Tailwind 默认的 spacing scale (1=4px) 已经够用，
 * 这里补充业务语义化的命名，让组件代码自解释。
 *
 * 使用方式（在 className 中直接用 Tailwind 默认值即可）：
 *   间距: p-3 (12px) / p-4 (16px) / gap-2 (8px)
 *   圆角: rounded-xl (12px) / rounded-2xl (16px)
 *
 * 以下常量供需要 JS 计算的场景使用（如 inline style、动画）。
 */

export const SPACE = {
  xs: 4, // 元素内紧凑间距（如图标和文字）
  sm: 8, // 组件内元素间距
  md: 12, // 卡片内 padding
  lg: 16, // 页面水平 padding、卡片间距
  xl: 24, // 区块间距
  '2xl': 32, // 大区块间距
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

/** 手机端 App 标准内容区宽度 */
export const APP_MAX_WIDTH = 480;

/**
 * 标准页面水平 padding（Tailwind class）
 * 所有页面主体统一用这个
 */
export const PAGE_PADDING_X = 'px-4'; // 16px
