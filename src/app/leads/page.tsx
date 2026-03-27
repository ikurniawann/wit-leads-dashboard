'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';

export default function LeadsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard for now (leads are shown there)
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-wit-darker">
      <Sidebar />
      <main className="ml-72 pt-16 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-wit-muted">Redirecting to Dashboard...</p>
        </div>
      </main>
    </div>
  );
}
