'use client';

import { useEffect, useState } from 'react';

type TimeParts = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const launchDate = new Date('2026-08-01T00:00:00');

function toTimeParts(diffMs: number): TimeParts {
  if (diffMs <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00' };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0')
  };
}

export function Countdown() {
  const [time, setTime] = useState<TimeParts>(() => toTimeParts(launchDate.getTime() - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(toTimeParts(launchDate.getTime() - Date.now()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown" aria-live="polite">
      <div>
        <span>{time.days}</span>
        <small>Days</small>
      </div>
      <div>
        <span>{time.hours}</span>
        <small>Hours</small>
      </div>
      <div>
        <span>{time.minutes}</span>
        <small>Minutes</small>
      </div>
      <div>
        <span>{time.seconds}</span>
        <small>Seconds</small>
      </div>
    </div>
  );
}
