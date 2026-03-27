'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface MonthlyTrendData {
  month: string;
  revenue: number;
  leads: number;
  won: number;
}

interface MonthlyTrendChartProps {
  data?: MonthlyTrendData[];
}

export default function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  // Sample data (will be replaced with real Supabase data)
  const sampleData: MonthlyTrendData[] = data || [
    { month: 'Jan 2026', revenue: 0, leads: 5, won: 0 },
    { month: 'Feb 2026', revenue: 0, leads: 8, won: 0 },
    { month: 'Mar 2026', revenue: 1318400000, leads: 14, won: 4 },
  ];

  const formatCurrency = (value: number) => {
    if (value === 0) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="month" 
            stroke="#888"
            tick={{ fill: '#888' }}
          />
          <YAxis 
            yAxisId="left"
            stroke="#888"
            tick={{ fill: '#888' }}
            tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(0)}M`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#888"
            tick={{ fill: '#888' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1a1a1a', 
              border: '1px solid #333',
              borderRadius: '8px'
            }}
            labelStyle={{ color: '#fff' }}
            formatter={(value: number, name: string) => {
              if (name === 'Revenue') {
                return [formatCurrency(value), name];
              }
              return [value, name];
            }}
          />
          <Legend />
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="revenue" 
            name="Revenue"
            stroke="#c00000"
            fill="#c00000"
            fillOpacity={0.3}
          />
          <Area 
            yAxisId="right"
            type="monotone" 
            dataKey="leads" 
            name="Leads"
            stroke="#4CAF50"
            fill="#4CAF50"
            fillOpacity={0.3}
          />
          <Area 
            yAxisId="right"
            type="monotone" 
            dataKey="won" 
            name="Won Deals"
            stroke="#2196F3"
            fill="#2196F3"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
