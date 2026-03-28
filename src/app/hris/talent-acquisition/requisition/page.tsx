'use client';

import Header from '../../components/Header';
import Sidebar from '../../../../components/Sidebar';
import { TrendingUp } from 'lucide-react';

export default function RequisitionTrackerPage() {
  return (
    <div className="min-h-screen theme-content">
      <Sidebar />
      <Header />
      <main className="md:ml-72 pt-16 pb-12 px-4 md:px-6">
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-wit-muted mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-wit-text mb-2">Requisition Tracker</h1>
          <p className="text-wit-muted mb-4">Track all open positions</p>
          <p className="text-sm text-wit-muted">Coming soon in next update!</p>
        </div>
      </main>
    </div>
  );
}
