// Hand-drawn marks as SVG strokes. Every path carries pathLength="1" and
// data-draw so it can be traced with stroke-dashoffset on scroll.
// These are placeholder strokes until real pen marks are traced.

const shapes = {
  underline: {
    viewBox: '0 0 300 18',
    paths: ['M3 9 C 48 3, 92 14, 140 7 S 236 3, 297 9', 'M286 13 C 232 16, 170 12, 96 15'],
  },
  underlineLong: {
    viewBox: '0 0 420 22',
    paths: ['M4 12 C 60 4, 118 18, 190 9 S 330 4, 372 11 C 392 14, 408 8, 416 6'],
  },
  arrow: {
    viewBox: '0 0 120 90',
    paths: ['M8 10 C 44 6, 86 26, 100 74', 'M82 60 L 101 77 L 110 52'],
  },
  arrowDown: {
    viewBox: '0 0 40 70',
    paths: ['M20 4 C 14 22, 26 38, 19 62', 'M8 50 L 19 64 L 32 51'],
  },
  circle: {
    viewBox: '0 0 220 80',
    paths: ['M112 8 C 46 4, 6 22, 10 44 C 14 70, 96 78, 150 72 C 204 66, 222 40, 200 22 C 176 4, 104 6, 70 14'],
  },
  scribble: {
    viewBox: '0 0 80 70',
    paths: ['M14 40 C 10 16, 44 6, 54 26 C 62 44, 30 62, 22 44 C 16 28, 50 14, 62 32 C 72 48, 42 66, 30 52 C 20 40, 46 24, 58 38'],
  },
  star: {
    viewBox: '0 0 50 50',
    paths: ['M25 5 L 26 45', 'M7 14 L 44 37', 'M43 13 L 8 38'],
  },
  doubleUnderline: {
    viewBox: '0 0 100 16',
    paths: ['M2 6 C 30 3, 62 4, 96 2', 'M22 13 C 50 10, 72 11, 98 9'],
  },
  sparks: {
    viewBox: '0 0 40 40',
    paths: ['M5 31 L 14 35', 'M15 14 L 22 23', 'M32 5 L 34 17'],
  },
  cherries: {
    viewBox: '0 0 62 72',
    paths: [
      'M50 5 C 32 19, 18 34, 13 48',
      'M50 5 C 47 22, 47 38, 47 52',
      'M13 48 c -9 0 -11 13 -2 15 c 10 2 13 -13 2 -15',
      'M47 52 c -9 0 -11 13 -2 15 c 10 2 13 -13 2 -15',
      'M50 5 c 6 -5 11 -1 7 5 c -3 4 -7 1 -7 -5',
    ],
  },
  pin: {
    viewBox: '0 0 24 34',
    paths: ['M12 32 C 5 21, 2 16, 2 11 C 2 -1, 22 -1, 22 11 C 22 16, 19 21, 12 32', 'M12 8 c -4 0 -4 6 0 6 c 4 0 4 -6 0 -6'],
  },
  hatch: {
    viewBox: '0 0 30 26',
    paths: ['M3 6 L 27 2 L 25 22 L 4 24 Z', 'M6 20 L 16 6', 'M12 22 L 22 5', 'M19 21 L 26 9'],
  },
  flower: {
    viewBox: '0 0 90 90',
    paths: ['M46 44 C 30 20, 62 8, 62 30 C 62 50, 30 52, 24 36 C 18 18, 50 14, 54 34 C 58 56, 30 70, 22 54 C 14 38, 44 26, 56 40 C 70 56, 52 78, 40 68 C 26 56, 52 34, 66 44 C 82 56, 66 76, 54 66 C 42 54, 60 30, 72 36 C 84 42, 78 60, 64 56'],
  },
  bracket: {
    viewBox: '0 0 24 160',
    paths: ['M20 4 C 6 6, 12 60, 4 80 C 12 100, 6 154, 20 156'],
  },
};

export function Mark({ type = 'underline', className = '', group, ...rest }) {
  const shape = shapes[type];
  return (
    <svg className={className} viewBox={shape.viewBox} fill="none" aria-hidden="true" preserveAspectRatio="none" data-mark={group || ''} {...rest}>
      {shape.paths.map((d) => (
        <path key={d} d={d} pathLength="1" data-draw="" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

export function PaperClip({ className = '', color = '#b3392c' }) {
  return (
    <svg className={className} viewBox="0 0 44 110" fill="none" aria-hidden="true">
      <path
        d="M30 34 L 30 84 C 30 100, 8 100, 8 84 L 8 22 C 8 2, 38 2, 38 22 L 38 76 C 38 86, 22 86, 22 76 L 22 36"
        stroke={color}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
