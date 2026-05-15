import { useAuth } from '../contexts/AuthContext';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PermissionBadge } from '../components/PermissionGuard';
import { User, LogOut, Home } from 'lucide-react';
import { Loading } from '../components/ui/Loading';
import { UserDashboard } from '../components/UserDashboard';
import { AdminDashboard } from '../components/AdminDashboard';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { PageHeader } from '../components/PageHeader';

export function DashboardPage() {
  const { user, logout, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/desktop');
  };

  if (isLoading) {
    return <Loading text="Loading dashboard..." />;
  }

  if (!user) {
    return (
      <PageLayout backgroundImage="bg6.png">
        <div className="min-h-screen flex items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>Please log in to access the dashboard.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout backgroundImage="bg6.png">
      <PageHeader
        title="TouNetCore"
        subtitle={user.username}
        showBack={false}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/desktop')}>
              <Home className="w-4 h-4 mr-2" />
              返回主页
            </Button>
            <div className="flex items-center text-sm text-gray-700">
              <User className="w-4 h-4 mr-2" />
              <PermissionBadge level={user.status} />
              <span className="ml-1">{user.username}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        }
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isAdmin ? <AdminDashboard /> : <UserDashboard />}
      </main>
    </PageLayout>
  );
}
