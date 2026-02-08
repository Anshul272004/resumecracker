import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ATSGaugeProps {
  score: number;
  label: string;
  color: string;
}

const ATSGauge = ({ score, label, color }: ATSGaugeProps) => {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    let start = 0;
    const timer = setInterval(() => {
      start += 1;
      if (start >= score) { setAnimated(score); clearInterval(timer); }
      else setAnimated(start);
    }, 20);
    return () => clearInterval(timer);
  }, [score]);

  const data = [{ value: animated }, { value: 100 - animated }];
  return (
    <div className="text-center">
      <div className="w-40 h-40 mx-auto relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} innerRadius={55} outerRadius={70} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
              <Cell fill={color} />
              <Cell fill="hsl(0 0% 15%)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-3xl font-bold text-foreground">{animated}%</span>
        </div>
      </div>
      <p className="font-body text-sm text-muted-foreground mt-2">{label}</p>
    </div>
  );
};

export default ATSGauge;
