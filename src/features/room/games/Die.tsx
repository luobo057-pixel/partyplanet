import { motion } from 'framer-motion';

/**
 * Die — a single dice rendered as pure SVG.
 *
 * Faces 1-6 with classic pip layouts; `hidden` shows the back side
 * (opponents' dice); `highlight` rings dice that count in a reveal.
 */

const PIPS: Record<number, Array<[number, number]>> = {
  1: [[50, 50]],
  2: [
    [30, 30],
    [70, 70],
  ],
  3: [
    [30, 30],
    [50, 50],
    [70, 70],
  ],
  4: [
    [30, 30],
    [70, 30],
    [30, 70],
    [70, 70],
  ],
  5: [
    [30, 30],
    [70, 30],
    [50, 50],
    [30, 70],
    [70, 70],
  ],
  6: [
    [30, 27],
    [70, 27],
    [30, 50],
    [70, 50],
    [30, 73],
    [70, 73],
  ],
};

export interface DieProps {
  face: number;
  size?: number;
  /** Show the back side (opponent dice) */
  hidden?: boolean;
  /** Ring this die (counted in reveal) */
  highlight?: boolean;
  /** Wiggle while rolling */
  shaking?: boolean;
  dim?: boolean;
}

export function Die({ face, size = 40, hidden, highlight, shaking, dim }: DieProps) {
  return (
    <motion.div
      animate={shaking ? { rotate: [0, -12, 10, -8, 6, 0], y: [0, -3, 2, -2, 0] } : {}}
      transition={shaking ? { duration: 0.5, repeat: Infinity } : {}}
      style={{ width: size, height: size }}
      className={dim ? 'opacity-40' : ''}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {hidden ? (
          <>
            <rect x="4" y="4" width="92" height="92" rx="20" fill="#312E58" stroke="#4B4680" strokeWidth="3" />
            <circle cx="50" cy="50" r="16" fill="#4B4680" />
            <text x="50" y="57" textAnchor="middle" fontSize="22" fill="#8B87C2" fontWeight="bold">
              ?
            </text>
          </>
        ) : (
          <>
            <rect
              x="4"
              y="4"
              width="92"
              height="92"
              rx="20"
              fill="#FFFFFF"
              stroke={highlight ? '#F43F5E' : '#D9D6EE'}
              strokeWidth={highlight ? 6 : 3}
            />
            {PIPS[face]?.map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={8.5} fill="#312E58" />
            ))}
          </>
        )}
      </svg>
    </motion.div>
  );
}
