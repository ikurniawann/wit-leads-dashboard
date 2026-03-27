'use client';

import { TrendingUp, CheckCircle, XCircle, Briefcase, DollarSign } from 'lucide-react';
import { formatCurrency } from '../lib/supabase';

interface StatsCardsProps {
  stats: {
    total: number;
    new: number;
    approved: number;
    inProgress: number;
    done: number;
    cancelled: number;
    totalValue: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Leads',
      value: stats.total.toString(),
      icon: Briefcase,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'Leads Aktif',
      value: (stats.new + stats.approved + stats.inProgress).toString(),
      icon: TrendingUp,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
    {
      title: 'Won (Done)',
      value: stats.done.toString(),
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      title: 'Lost (Cancelled)',
      value: stats.cancelled.toString(),
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
    },
  ];

  const valueCard = {
    title: 'Total Pipeline Value',
    value: formatCurrency(stats.totalValue),
    icon: DollarSign,
    color: 'text-wit-red',
    bgColor: 'bg-wit-red/10',
    borderColor: 'border-wit-red/30',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`glass ${card.bgColor} border ${card.borderColor} rounded-xl p-6 card-hover animate-fade-in`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
              {card.title === 'Leads Aktif' && (
                <TrendingUp className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            <h3 className="text-wit-muted text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-wit-text">{card.value}</p>
          </div>
        );
      })}

      {/* Total Value Card - Full width on mobile */}
      <div className="md:col-span-2 lg:col-span-1">
        <div
          className={`glass ${valueCard.bgColor} border ${valueCard.borderColor} rounded-xl p-6 card-hover animate-fade-in h-full`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${valueCard.bgColor}`}>
              <valueCard.icon className={`w-6 h-6 ${valueCard.color}`} />
            </div>
          </div>
          <h3 className="text-wit-muted text-sm font-medium mb-1">{valueCard.title}</h3>
          <p className="text-2xl font-bold text-wit-text">{valueCard.value}</p>
        </div>
      </div>
    </div>
  );
}
