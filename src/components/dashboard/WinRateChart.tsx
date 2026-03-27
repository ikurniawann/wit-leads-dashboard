'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { leadsApi } from '../../lib/api/leads';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface WinRateData {
  name: string;
  value: number;
  color: string;
}

export default function WinRateChart() {
  const [loading, setLoading] = useState(true);
  const [winRate, setWinRate] = useState({ total: 0, won: 0, winRate: 0 });
  const [data, setData] = useState<WinRateData[]>([]);

  useEffect(() => {
    loadWinRate();
  }, []);

  const loadWinRate = async () => {
    try {
      setLoading(true);
      const stats = await leadsApi.getWinRate();
      setWinRate(stats);

      const chartData: WinRateData[] = [
        { name: 'Won', value: stats.won, color: '#22c55e' },
        { name: 'Lost', value: stats.total - stats.won, color: '#ef4444' },
      ];

      setData(chartData);
    } catch (error) {
      console.error('Error loading win rate:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#22c55e', '#ef4444'];

  return (
    <div className="glass border border-wit-border rounded-xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-wit-text mb-1">Win Rate</h2>
        <p className="text-wit-muted text-sm">Success Rate & Conversion</p>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #222222',
                    borderRadius: '8px',
                    color: '#000000',
                  }}
                  labelStyle={{ color: '#000000', fontWeight: 'bold' }}
                  itemStyle={{ color: '#000000' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="p-4 bg-wit-darker rounded-lg">
              <p className="text-sm text-wit-muted mb-1">Win Rate</p>
              <div className="flex items-center space-x-2">
                <p className="text-4xl font-bold text-wit-text">
                  {winRate.winRate}%
                </p>
                {winRate.winRate >= 50 ? (
                  <TrendingUp className="w-6 h-6 text-green-500" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-500" />
                )}
              </div>
            </div>

            <div className="p-4 bg-wit-darker rounded-lg">
              <p className="text-sm text-wit-muted mb-1">Total Leads</p>
              <p className="text-2xl font-bold text-wit-text">{winRate.total}</p>
            </div>

            <div className="p-4 bg-wit-darker rounded-lg">
              <p className="text-sm text-wit-muted mb-1">Won Deals</p>
              <p className="text-2xl font-bold text-green-500">{winRate.won}</p>
            </div>

            <div className="p-4 bg-wit-darker rounded-lg">
              <p className="text-sm text-wit-muted mb-1">Lost Deals</p>
              <p className="text-2xl font-bold text-red-500">{winRate.total - winRate.won}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
