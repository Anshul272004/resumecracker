import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 33 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) return { hours: 0, minutes: 0, seconds: 0 };
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="inline-flex items-center gap-3 bg-destructive/10 border border-destructive/20 rounded-xl px-5 py-3">
      <Timer className="w-4 h-4 text-destructive" />
      <span className="font-body text-xs text-destructive font-semibold">Offer ends in:</span>
      <div className="flex items-center gap-1">
        {[
          { val: pad(timeLeft.hours), label: "H" },
          { val: pad(timeLeft.minutes), label: "M" },
          { val: pad(timeLeft.seconds), label: "S" },
        ].map((unit, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="bg-destructive/20 text-destructive font-display text-sm font-bold px-2 py-1 rounded-md min-w-[28px] text-center">
              {unit.val}
            </span>
            <span className="font-body text-[10px] text-destructive/60">{unit.label}</span>
            {i < 2 && <span className="text-destructive/40 font-bold mx-0.5">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
