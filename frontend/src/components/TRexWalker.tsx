import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface TRexWalkerProps {
  onComplete?: () => void;
}

export default function TRexWalker({ onComplete }: TRexWalkerProps) {
  const { darkMode } = useTheme();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-8 left-0 z-50 pointer-events-none animate-trex-walk motion-reduce:hidden"
      aria-hidden="true"
    >
      <div className="animate-trex-step" style={{ transform: 'scaleX(-1)' }}>
        <span
          className={`text-9xl select-none ${
            darkMode
              ? 'drop-shadow-[0_0_8px_rgba(118,184,82,0.6)]'
              : 'drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]'
          }`}
        >
          🦖
        </span>
      </div>
    </div>
  );
}
