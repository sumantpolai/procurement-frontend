'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, ShoppingCart, Home, Package, Users, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    name: 'Purchase Requests',
    href: '/pr',
    icon: FileText,
  },
  {
    name: 'Purchase Orders',
    href: '/po',
    icon: ShoppingCart,
  },
  {
    name: 'Item Master',
    href: '/items',
    icon: Box,
  },
  {
    name: 'Vendor Master',
    href: '/vendors',
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col fixed left-0 top-0 bg-gray-900 text-white">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-6">
        <Package className="h-8 w-8 text-blue-400" />
        <div>
          <h1 className="text-lg font-bold">Procurement</h1>
          <p className="text-xs text-gray-400">Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 p-4">
        <div className="text-xs text-gray-400">
          <p>Version 1.0.0</p>
          <p className="mt-1">© 2026 Procurement System</p>
        </div>
      </div>
    </div>
  );
}
