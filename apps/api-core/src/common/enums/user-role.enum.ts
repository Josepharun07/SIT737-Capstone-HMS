/**
 * User Role Enumeration
 * Defines access levels throughout Blueberry HMS
 */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',  // IT/Mattel Group - Full system access
  OWNER = 'OWNER',                // Resort Manager - Operational control
  MANAGER = 'MANAGER',            // Department managers
  FRONT_DESK = 'FRONT_DESK',      // Reception staff
  HOUSEKEEPING = 'HOUSEKEEPING',  // Cleaning staff
  KITCHEN = 'KITCHEN',            // Restaurant/kitchen staff
  MAINTENANCE = 'MAINTENANCE',    // Technical staff
  GUEST = 'GUEST',                // Portal/mobile users
}

/**
 * Role hierarchy for permission checks
 * Higher number = more permissions
 */
export const RoleHierarchy: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 100,
  [UserRole.OWNER]: 90,
  [UserRole.MANAGER]: 70,
  [UserRole.FRONT_DESK]: 50,
  [UserRole.HOUSEKEEPING]: 30,
  [UserRole.KITCHEN]: 30,
  [UserRole.MAINTENANCE]: 30,
  [UserRole.GUEST]: 10,
};
