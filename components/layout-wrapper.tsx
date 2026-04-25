'use client';

import { usePathname } from 'next/navigation';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide sidebar on login and auth callback pages
  const isAuthPage = pathname === '/login' || pathname?.startsWith('/auth/');
  
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  return <>{children}</>;
}
