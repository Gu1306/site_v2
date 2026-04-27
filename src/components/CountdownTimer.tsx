import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 inline-block mb-8">
      <p className="text-white/80 text-sm font-semibold mb-2 uppercase tracking-wider">Faltam:</p>
      <div className="flex items-center gap-2 md:gap-4 text-white font-bold">
        <div className="text-center">
          <span className="text-3xl md:text-5xl">{formatNumber(timeLeft.days)}</span>
          <p className="text-xs text-white/60 uppercase">Dias</p>
        </div>
        <span className="text-2xl md:text-4xl text-[#E8933D]">:</span>
        <div className="text-center">
          <span className="text-3xl md:text-5xl">{formatNumber(timeLeft.hours)}</span>
          <p className="text-xs text-white/60 uppercase">Horas</p>
        </div>
        <span className="text-2xl md:text-4xl text-[#E8933D]">:</span>
        <div className="text-center">
          <span className="text-3xl md:text-5xl">{formatNumber(timeLeft.minutes)}</span>
          <p className="text-xs text-white/60 uppercase">Min</p>
        </div>
        <span className="text-2xl md:text-4xl text-[#E8933D]">:</span>
        <div className="text-center">
          <span className="text-3xl md:text-5xl">{formatNumber(timeLeft.seconds)}</span>
          <p className="text-xs text-white/60 uppercase">Seg</p>
        </div>
      </div>
    </div>
  );
};
