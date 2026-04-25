// Role-Based Access Control (RBAC) utilities

export type UserRole = 'store_staff' | 'store_manager' | 'purchase_staff' | 'purchase_manager';

export type Permission = 
  | 'pr:read' | 'pr:create' | 'pr:update' | 'pr:update_status'
  | 'po:read' | 'po:create' | 'po:update' | 'po:update_status'
  | 'vendor:read' | 'vendor:create' | 'vendor:update' | 'vendor:update_status'
  | 'item:read' | 'item:create' | 'item:update' | 'item:delete';

// Role permissions matrix based on backend AUTH_GUIDE.md
const rolePermissions: Record<UserRole, Permission[]> = {
  store_staff: [
    'pr:read', 'pr:create', 'pr:update',
    'po:read',
    'item:read',
    'vendor:read',
  ],
  store_manager: [
    'pr:read', 'pr:create', 'pr:update', 'pr:update_status',
    'po:read',
    'item:read', 'item:create', 'item:update',
    'vendor:read',
  ],
  purchase_staff: [
    'pr:read',
    'po:read', 'po:create', 'po:update',
    'vendor:read', 'vendor:create', 'vendor:update',
    'item:read',
  ],
  purchase_manager: [
    'pr:read',
    'po:read', 'po:create', 'po:update', 'po:update_status',
    'vendor:read', 'vendor:create', 'vendor:update', 'vendor:update_status',
    'item:read', 'item:create', 'item:update',
  ],
};

// Check if user has specific permission
export const hasPermission = (role: UserRole | null, permission: Permission): boolean => {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) || false;
};

// Check if user has any of the permissions
export const hasAnyPermission = (role: UserRole | null, permissions: Permission[]): boolean => {
  if (!role) return false;
  return permissions.some(permission => hasPermission(role, permission));
};

// Check if user has all permissions
export const hasAllPermissions = (role: UserRole | null, permissions: Permission[]): boolean => {
  if (!role) return false;
  return permissions.every(permission => hasPermission(role, permission));
};

// Get all permissions for a role
export const getRolePermissions = (role: UserRole): Permission[] => {
  return rolePermissions[role] || [];
};

// Check if user can access a route based on role
export const canAccessRoute = (role: UserRole | null, routePath: string): boolean => {
  if (!role) return false;

  // Define route access rules
  const routeAccess: Record<string, UserRole[]> = {
    '/dashboard/store-staff': ['store_staff', 'store_manager'],
    '/dashboard/store-manager': ['store_manager'],
    '/dashboard/purchase-staff': ['purchase_staff', 'purchase_manager'],
    '/dashboard/purchase-manager': ['purchase_manager'],
  };

  // Check if route has specific access rules
  for (const [route, allowedRoles] of Object.entries(routeAccess)) {
    if (routePath.startsWith(route)) {
      return allowedRoles.includes(role);
    }
  }

  // Default: allow access if user has a valid role
  return true;
};
