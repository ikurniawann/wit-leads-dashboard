'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueByPICData {
  pic_name: string;
  revenue: number;
  deals: number;
}

interface RevenueByPICChartProps {
  data?: RevenueByPICData[];
}

export default function RevenueByPICChart({ data }: RevenueByPICChartProps) {
  // Sample data (will be replaced with real Supabase data)
  const sampleData: RevenueByPICData[] = data || [
    { pic_name: 'Ilham', revenue: 488400000, deals: 1 },
    { pic_name: 'Irfan', revenue: 450000000, deals: 1 },
    { pic_name: 'Dimas', revenue: 200000000, deals: 1 },
    { pic_name: 'Banu', revenue: 180000000, deals: 1 },
  ];

  const formatCurrency = (value: number) => {
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
        <BarChart data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="pic_name" 
            stroke="#888"
            tick={{ fill: '#888' }}
          />
          <YAxis 
            stroke="#888"
            tick={{ fill: '#888' }}
            tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1a1a1a', 
              border: '1px solid #333',
              borderRadius: '8px'
            }}
            labelStyle={{ color: '#fff' }}
            formatter={(value: number) => [formatCurrency(value), 'Revenue']}
          />
          <Bar 
            dataKey="revenue" 
            fill="#c00000"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
