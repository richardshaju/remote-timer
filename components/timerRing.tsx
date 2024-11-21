import React, { useEffect, useRef, useState } from 'react';

interface TimerRingProps {
  time: number;
  initialTime: number;
}

const TimerRing: React.FC<TimerRingProps> = ({ time, initialTime }) => {
  const radius = 55;
  const circumference = 2 * Math.PI * radius;

  const [smoothTime, setSmoothTime] = useState(time);
  const requestRef = useRef<number | null>(null);

  // Ensure animation updates smoothly
  useEffect(() => {
    const animate = () => {
      setSmoothTime((prev) => {
        // Gradually approach the target `time` value
        const delta = time - prev;
        if (Math.abs(delta) < 0.01) return time; // Close enough to stop interpolation
        return prev + delta * 0.1; // Smooth interpolation
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [time]);

  const progress = (smoothTime / initialTime) * circumference;

  return (
    <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 120 120">
      <circle
        className="text-yellow-900"
        strokeWidth="2"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="60"
        cy="60"
      />
      <circle
        className="text-yellow-600"
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="60"
        cy="60"
        style={{
          transition: "stroke-dashoffset 0.1s linear",
          transformOrigin: "center",
          transform: "rotate(-90deg)", // Rotate to start from the top
        }}
      />
    </svg>
  );
};

export default TimerRing;