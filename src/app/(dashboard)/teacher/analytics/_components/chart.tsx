"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

import { Card } from "@/components/ui/card";

interface ChartProps {
  data: {
    name: string;
    total: number;
  }[];
}

export const Chart = ({
  data
}: ChartProps) => {
  return (
    <Card className="glass-card border-white/10 p-6 mt-8 rounded-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10 w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.05)'}}
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar
              dataKey="total"
              fill="url(#colorUv)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6f00ff" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6f00ff" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
