import React from 'react';

interface AudioWaveformProps {
  isPlaying: boolean;
  barCount?: number;
  color?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isPlaying,
  barCount = 18,
  color = 'var(--accent-primary)'
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      height: 28,
      padding: '0 4px'
    }}>
      {Array.from({ length: barCount }).map((_, i) => {
        const randomHeight = isPlaying ? 25 + ((i * 17 + 23) % 75) : 15;
        const animDuration = 0.4 + ((i * 3) % 7) * 0.1;

        return (
          <div
            key={i}
            style={{
              width: 3,
              borderRadius: 3,
              background: isPlaying ? color : 'var(--border-color)',
              height: `${randomHeight}%`,
              transition: 'all 0.15s ease',
              animation: isPlaying ? `wavePulse ${animDuration}s ease-in-out infinite alternate` : 'none',
              animationDelay: `${i * 0.05}s`
            }}
          />
        );
      })}

      <style>{`
        @keyframes wavePulse {
          0% { height: 15%; opacity: 0.5; }
          50% { height: 95%; opacity: 1; }
          100% { height: 35%; opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};
