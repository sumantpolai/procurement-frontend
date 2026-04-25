'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenManager } from '@/services/auth';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = tokenManager.getUser();
    const token = tokenManager.getToken();

    if (user && token) {
      // Redirect to role-specific dashboard
      const role = user.role;
      if (role === 'store_staff') {
        router.push('/dashboard/store-staff');
      } else if (role === 'store_manager') {
        router.push('/dashboard/store-manager');
      } else if (role === 'purchase_staff') {
        router.push('/dashboard/purchase-staff');
      } else if (role === 'purchase_manager') {
        router.push('/dashboard/purchase-manager');
      } else {
        router.push('/dashboard');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
