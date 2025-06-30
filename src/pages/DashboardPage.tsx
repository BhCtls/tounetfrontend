import { useAuth } from '../contexts/AuthContext';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PermissionBadge } from '../components/PermissionGuard';
import { User, LogOut } from 'lucide-react';
import { Loading } from '../components/ui/Loading';
import { UserDashboard } from '../components/UserDashboard';
import { AdminDashboard } from '../components/AdminDashboard';

export function DashboardPage() {
  const { user, logout, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return <Loading text="Loading dashboard..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to access the dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">TouNetCore</h1>
              <div className="ml-3">
                <PermissionBadge level={user.status} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-700">
                <User className="w-4 h-4 mr-2" />
                {user.username}
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isAdmin ? <AdminDashboard /> : <UserDashboard />}
      </main>
    </div>
  );
}
