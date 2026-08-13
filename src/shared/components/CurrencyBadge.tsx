import { Icon, type IconName } from './Icon';

/**
 * Currency badge — shows coins / gems with an icon.
 *
 * Used in the top bar of Home, Profile, etc.
 */

export interface CurrencyBadgeProps {
  icon: IconName;
  value: number;
  /** Tailwind text color class for the icon */
  iconColor?: string;
}

export function CurrencyBadge({
  icon,
  value,
  iconColor = 'text-amber-400',
}: CurrencyBadgeProps) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
      <Icon name={icon} size={14} className={iconColor} />
      <span className="text-xs font-semibold tabular-nums">{formatNum(value)}</span>
    </div>
  );
}

/** 1234 → 1.2k, 1200000 → 1.2M */
function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}
