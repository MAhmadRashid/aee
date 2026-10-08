"use client";

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartProps {
  data: { name: string; revenue: number }[];
}

export default function RevenueChart({ data }: ChartProps) {
  return (
    <div className="w-full h-64 mt-4 relative z-10">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#666" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tickMargin={10} 
          />
          <YAxis 
            stroke="#666" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `$${value}`} 
            width={40}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px' }}
            itemStyle={{ color: '#D4AF37' }}
            formatter={(value) => [`$${value}`, 'Revenue']}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#D4AF37" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
