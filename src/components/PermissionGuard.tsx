import React from 'react';
import type { PermissionLevel } from '../lib/permissions';
import { PermissionUtils } from '../lib/permissions';

interface PermissionGuardProps {
  userLevel: PermissionLevel;
  requiredLevel: PermissionLevel;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user permissions
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  userLevel,
  requiredLevel,
  children,
  fallback = null
}) => {
  const hasAccess = PermissionUtils.hasPermission(userLevel, requiredLevel);
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

interface PermissionBadgeProps {
  level: PermissionLevel;
  className?: string;
}

/**
 * Component that displays a permission level badge
 */
export const PermissionBadge: React.FC<PermissionBadgeProps> = ({
  level,
  className = ''
}) => {
  const color = PermissionUtils.getPermissionLevelColor(level);
  const name = PermissionUtils.getPermissionLevelName(level);
  
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[color as keyof typeof colorClasses]} ${className}`}>
      {name}
    </span>
  );
};
