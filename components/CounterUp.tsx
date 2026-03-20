// components/CounterUp.tsx
import { useState, useEffect } from 'react';

interface CounterUpProps {
  end: number;
  suffix?: string;
  duration?: number; // in ms
  prefix?: string;
}
const CounterUp: React.FC<CounterUpProps> = ({
  end,
  suffix = '',
  prefix = '',
  duration = 2000
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(easeOut * end);

      setCount(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [end, duration]);

  const displayValue =
    count >= 1000 ? `${(count / 1000).toFixed(0)}K` : count;

  return (
    <span>
      {prefix}
      {end}
      {suffix}
    </span>
  );
};
export default CounterUp;