# Frontend Permission System Updates

## Overview

The frontend has been updated to support the new 4-tier permission hierarchy:
- **admin** (level 4) - Full system access
- **trusted** (level 3) - Enhanced user with access to trusted applications  
- **user** (level 2) - Standard user access
- **disableduser** (level 1) - Minimal access, restricted

## Changes Made

### 1. Type Definitions (`src/types/api.ts`)
- Updated `User.status` to include `'trusted'` and `'disableduser'`
- Updated `App.required_permission_level` to include `'trusted'`
- Updated all related interfaces (`CreateUserRequest`, `CreateAppRequest`, etc.)

### 2. Permission Utilities (`src/lib/permissions.ts`)
- Created `PermissionUtils` with hierarchy checking functions
- Added `hasPermission()` for comparing permission levels
- Added `getPermissionLevelName()` for display names
- Added `getPermissionLevelColor()` for UI styling
- Added helper functions for filtering accessible apps

### 3. Permission Components (`src/components/PermissionGuard.tsx`)
- Created `PermissionGuard` component for conditional rendering
- Created `PermissionBadge` component for displaying permission levels
- Automatic color coding: admin=purple, trusted=blue, user=green, disableduser=red

### 4. Auth Context Updates (`src/contexts/AuthContext.tsx`)
- Added `isTrusted` and `hasPermission()` helper functions
- Enhanced authentication context with permission checking

### 5. Admin Dashboard (`src/components/AdminDashboard.tsx`)
- Updated Zod schemas to include new permission levels
- Added `'trusted'` option to all user and app forms
- Replaced manual status badges with `PermissionBadge` component
- Updated dropdown options in create/edit forms

### 6. User Dashboard (`src/components/UserDashboard.tsx`)
- Replaced plain text status with `PermissionBadge` component

### 7. Dashboard Page (`src/pages/DashboardPage.tsx`)
- Updated header to show user's permission level badge instead of just admin badge

## Usage Examples

### Permission Checking
```tsx
import { PermissionUtils } from '../lib/permissions';

// Check if user can access feature
const canAccess = PermissionUtils.hasPermission(userLevel, 'trusted');

// Filter apps by user permission
const accessibleApps = PermissionUtils.getAccessibleApps(allApps, userLevel);
```

### Permission Guard Component
```tsx
import { PermissionGuard } from '../components/PermissionGuard';

<PermissionGuard userLevel={user.status} requiredLevel="trusted">
  <TrustedUserFeature />
</PermissionGuard>
```

### Permission Badge
```tsx
import { PermissionBadge } from '../components/PermissionGuard';

<PermissionBadge level={user.status} />
```

### Auth Context Usage
```tsx
import { useAuth } from '../contexts/AuthContext';

const { hasPermission, isTrusted } = useAuth();

// Check permission
if (hasPermission('trusted')) {
  // Show trusted features
}
```

## Migration Notes

- All existing `'disabled'` status values should be updated to `'disableduser'` in the backend
- The frontend now displays proper permission level names and colors
- Form validation includes the new permission levels
- Permission checking is centralized in the utility functions

## Network Access

The development server is now configured to be accessible from other devices on the network:
- Local: http://localhost:5174/
- Network: http://192.168.1.6:5174/ (and other network interfaces)

This allows testing from mobile devices and other computers on the same network.
