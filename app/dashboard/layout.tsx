'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { tokenManager } from '@/services/auth';
import { getRoutesByRole, getSidebarLabel } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X, User } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Add a small delay to ensure localStorage is ready
    const checkAuth = () => {
      const currentUser = tokenManager.getUser();
      const token = tokenManager.getToken();
      
      console.log('Dashboard layout - checking auth');
      console.log('User:', currentUser);
      console.log('Token:', token);
      
      if (!currentUser || !token) {
        console.log('No user or token found, redirecting to login');
        router.push('/login');
      } else {
        console.log('User authenticated:', currentUser);
        setUser(currentUser);
      }
    };
    
    // Small delay to ensure localStorage is ready
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router]);

  const handleLogout = () => {
    tokenManager.logout();
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const routes = getRoutesByRole(user.role);
  const sidebarLabel = getSidebarLabel(user.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white shadow-xl w-72`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">{sidebarLabel}</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Info Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
                  <p className="text-xs text-blue-100 truncate">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded-full">
                    {user.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-2">
              {routes.map((route, index) => (
                <li key={index}>
                  {route.href ? (
                    <Link
                      href={route.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        pathname === route.href
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <route.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{route.name}</span>
                    </Link>
                  ) : (
                    <div>
                      <div className="flex items-center gap-3 px-4 py-3 text-gray-900 font-semibold">
                        <route.icon className="w-5 h-5 flex-shrink-0" />
                        <span>{route.name}</span>
                      </div>
                      {route.children && (
                        <ul className="mt-2 space-y-1 ml-4">
                          {route.children.map((child, childIndex) => (
                            <li key={childIndex}>
                              <Link
                                href={child.href}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                                  pathname === child.href
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                              >
                                {child.icon && <child.icon className="w-4 h-4 flex-shrink-0" />}
                                <span className="text-sm font-medium">{child.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-3 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : ''}`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{user.full_name}</p>
                  <p className="text-xs text-gray-500">{getSidebarLabel(user.role)}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
