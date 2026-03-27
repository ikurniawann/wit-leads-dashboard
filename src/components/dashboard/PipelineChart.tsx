'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { leadsApi } from '@/lib/api/leads';

interface ChartData {
  month: string;
  revenue: number;
  leads: number;
}

export default function PipelineChart() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ChartData[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadPipelineData();
  }, [year]);

  const loadPipelineData = async () => {
    try {
      setLoading(true);
      const pipelineData = await leadsApi.getPipelineByMonth(year);
      
      const chartData = pipelineData.months.map((month, index) => ({
        month,
        revenue: pipelineData.revenue[index] || 0,
        leads: pipelineData.leads[index] || 0,
      }));

      setData(chartData);
    } catch (error) {
      console.error('Error loading pipeline data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `Rp ${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}M`;
    }
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  return (
    <div className="glass border border-wit-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-wit-text mb-1">Pipeline Analytics</h2>
          <p className="text-wit-muted text-sm">Revenue & Leads per Month</p>
        </div>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="input-dark"
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c00000" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c00000" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
              <XAxis dataKey="month" stroke="#888888" fontSize={12} />
              <YAxis
                yAxisId="left"
                stroke="#c00000"
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#3b82f6"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111111',
                  border: '1px solid #222222',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#ffffff' }}
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? formatCurrency(value) : value,
                  name === 'revenue' ? 'Revenue' : 'Leads'
                ]}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#c00000"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="leads"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorLeads)"
                name="Leads"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
