/**
 * Permission utility functions for TouNetCore
 * Based on the hierarchical permission system: admin > trusted > user > disableduser
 */

export type PermissionLevel = 'admin' | 'trusted' | 'user' | 'disableduser';

export const PermissionUtils = {
  // Permission level hierarchy with numeric values
  PERMISSION_LEVELS: {
    'disableduser': 1,
    'user': 2,
    'trusted': 3,
    'admin': 4
  } as const,

  // Check if user has required permission level
  hasPermission: (userLevel: PermissionLevel, requiredLevel: PermissionLevel): boolean => {
    return PermissionUtils.PERMISSION_LEVELS[userLevel] >= PermissionUtils.PERMISSION_LEVELS[requiredLevel];
  },

  // Check if user can access specific application
  canAccessApp: (userLevel: PermissionLevel, appRequiredLevel: PermissionLevel): boolean => {
    return PermissionUtils.hasPermission(userLevel, appRequiredLevel);
  },

  // Get permission level display name
  getPermissionLevelName: (level: PermissionLevel): string => {
    const names = {
      'admin': 'Administrator',
      'trusted': 'Trusted User',
      'user': 'Standard User',
      'disableduser': 'Disabled User'
    };
    return names[level] || 'Unknown';
  },

  // Get permission level color for UI styling
  getPermissionLevelColor: (level: PermissionLevel): string => {
    const colors = {
      'admin': 'purple',
      'trusted': 'blue',
      'user': 'green',
      'disableduser': 'red'
    };
    return colors[level] || 'gray';
  },

  // Filter apps by user permission
  getAccessibleApps: <T extends { required_permission_level: PermissionLevel }>(
    allApps: T[], 
    userLevel: PermissionLevel
  ): T[] => {
    return allApps.filter(app => 
      PermissionUtils.hasPermission(userLevel, app.required_permission_level)
    );
  },

  // Get all permission levels lower than or equal to the current level
  getAvailableLevels: (currentLevel: PermissionLevel): PermissionLevel[] => {
    const currentPriority = PermissionUtils.PERMISSION_LEVELS[currentLevel];
    return Object.entries(PermissionUtils.PERMISSION_LEVELS)
      .filter(([_, priority]) => priority <= currentPriority)
      .map(([level, _]) => level as PermissionLevel)
      .sort((a, b) => PermissionUtils.PERMISSION_LEVELS[b] - PermissionUtils.PERMISSION_LEVELS[a]);
  }
};
