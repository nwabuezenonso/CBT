/**
 * Role-Based Access Control (RBAC) utilities
 */

export type UserRole = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'EXAMINER' | 'STUDENT';

export type Permission =
  | 'manage:organizations'
  | 'manage:teachers' // Keeping for backward compatibility or rename if strictly needed, but let's stick to key rename for now. Actually, let's rename the permission too if it makes sense, but permissions might be used in strings. Let's start with Role name.
  | 'manage:examiners' // Renamed from manage:teachers
  | 'manage:students'
  | 'manage:classes'
  | 'approve:students'
  | 'create:exams'
  | 'assign:exams'
  | 'view:results'
  | 'take:exams'
  | 'manage:questions';

/**
 * Role permission matrix
 */
const rolePermissions: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'manage:organizations',
    'manage:examiners',
    'manage:students',
    'manage:classes',
    'approve:students',
    'create:exams',
    'assign:exams',
    'view:results',
    'manage:questions',
  ],
  ORG_ADMIN: [
    'manage:examiners',
    'manage:students',
    'manage:classes',
    'approve:students',
    'view:results',
  ],
  EXAMINER: [
    'create:exams',
    'assign:exams',
    'view:results',
    'manage:questions',
  ],
  STUDENT: [
    'take:exams',
  ],
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return rolePermissions[role] ?? [];
}

/**
 * Check if user can access a resource based on organization
 */
export function canAccessOrganization(
  userOrgId: string | null,
  resourceOrgId: string,
  userRole: UserRole
): boolean {
  // Super admins can access all organizations
  if (userRole === 'SUPER_ADMIN') {
    return true;
  }
  
  // Other users can only access their own organization
  return userOrgId === resourceOrgId;
}

/**
 * Check if user status allows access
 */
export function isUserActive(status: string): boolean {
  return status === 'ACTIVE';
}

/**
 * Check if user can approve students
 */
export function canApproveStudents(role: UserRole): boolean {
  return hasPermission(role, 'approve:students');
}

/**
 * Check if user can create exams
 */
export function canCreateExams(role: UserRole): boolean {
  return hasPermission(role, 'create:exams');
}

/**
 * Check if user can take exams
 */
export function canTakeExams(role: UserRole, status: string): boolean {
  return hasPermission(role, 'take:exams') && isUserActive(status);
}
