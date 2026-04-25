'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenManager } from '@/services/auth';
import { canAccessRoute } from '@/lib/rbac';

export default function StoreStaffDashboard() {
  const router = useRouter();

  useEffect(() => {
    const user = tokenManager.getUser();
    if (!user || !canAccessRoute(user.role, '/dashboard/store-staff')) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Store Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Purchase Requisitions</h2>
          <p className="text-gray-600">Create and manage purchase requisitions</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Purchase Orders</h2>
          <p className="text-gray-600">View purchase orders</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Items</h2>
          <p className="text-gray-600">View item master data</p>
        </div>
      </div>
    </div>
  );
}
