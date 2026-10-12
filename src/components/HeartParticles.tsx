import React, { useMemo } from 'react';

interface HeartParticlesProps {
  enabled: boolean;
  count?: number;
}

export const HeartParticles: React.FC<HeartParticlesProps> = ({ enabled, count = 20 }) => {
  if (!enabled) return null;

  const particles = useMemo(() => {
    const items = [];
    const symbols = ['❤️', '💖', '🌸', '✨', '💕', '🌹', '✨'];
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        symbol: symbols[i % symbols.length],
        left: `${(i * 17 + 5) % 95}%`,
        animationDuration: `${6 + (i % 6) * 2}s`,
        animationDelay: `${(i * 0.7) % 5}s`,
        size: 14 + (i % 4) * 6,
        opacity: 0.25 + (i % 3) * 0.15,
      });
    }
    return items;
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute select-none"
          style={{
            left: p.left,
            top: '-20px',
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animation: `petalFall ${p.animationDuration} linear infinite`,
            animationDelay: p.animationDelay,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
};
