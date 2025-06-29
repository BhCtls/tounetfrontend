import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adminApi } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Loading } from './ui/Loading';
import { 
  Users, 
  Settings, 
  Key, 
  Plus, 
  Trash2, 
  UserPlus,
  Copy,
  Check,
  Shield
} from 'lucide-react';
import { formatDate, copyToClipboard } from '../lib/utils';

const createUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number is required'),
  pushdeer_token: z.string().optional(),
  status: z.enum(['admin', 'user', 'disabled']),
});

const createAppSchema = z.object({
  app_id: z.string().min(1, 'App ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  required_permission_level: z.enum(['admin', 'user']),
  is_active: z.boolean(),
});

type CreateUserForm = z.infer<typeof createUserSchema>;
type CreateAppForm = z.infer<typeof createAppSchema>;

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'users' | 'apps' | 'invites'>('users');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateApp, setShowCreateApp] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string>('');

  // Queries
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await adminApi.getUsers(1, 50);
      return response.data;
    },
  });

  const { data: apps, isLoading: appsLoading } = useQuery({
    queryKey: ['admin', 'apps'],
    queryFn: async () => {
      const response = await adminApi.getApps();
      return response.data;
    },
  });

  const { data: inviteCodes, isLoading: inviteCodesLoading } = useQuery({
    queryKey: ['admin', 'invite-codes'],
    queryFn: async () => {
      const response = await adminApi.getInviteCodes();
      return response.data;
    },
  });

  // Forms
  const createUserForm = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      status: 'user',
    },
  });

  const createAppForm = useForm<CreateAppForm>({
    resolver: zodResolver(createAppSchema),
    defaultValues: {
      required_permission_level: 'user',
      is_active: true,
    },
  });

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setShowCreateUser(false);
      createUserForm.reset();
    },
  });

  const createAppMutation = useMutation({
    mutationFn: adminApi.createApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'apps'] });
      setShowCreateApp(false);
      createAppForm.reset();
    },
  });

  const generateInviteCodeMutation = useMutation({
    mutationFn: adminApi.generateInviteCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'invite-codes'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  const deleteAppMutation = useMutation({
    mutationFn: adminApi.deleteApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'apps'] });
    },
  });

  // Handlers
  const onCreateUser = (data: CreateUserForm) => {
    createUserMutation.mutate({
      ...data,
      pushdeer_token: data.pushdeer_token || '',
    });
  };

  const onCreateApp = (data: CreateAppForm) => {
    createAppMutation.mutate(data);
  };

  const handleCopyInviteCode = async (code: string) => {
    await copyToClipboard(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const users = usersData?.items || [];
  const totalUsers = usersData?.total || 0;

  return (
    <div className="space-y-6">
      {/* Admin Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Admin Dashboard
          </CardTitle>
          <CardDescription>
            Manage users, applications, and system settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{apps?.length || 0}</div>
              <div className="text-sm text-gray-600">Active Apps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{inviteCodes?.length || 0}</div>
              <div className="text-sm text-gray-600">Invite Codes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {inviteCodes?.filter(code => !code.is_used).length || 0}
              </div>
              <div className="text-sm text-gray-600">Unused Codes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'users', label: 'Users', icon: Users },
            { key: 'apps', label: 'Applications', icon: Settings },
            { key: 'invites', label: 'Invite Codes', icon: Key },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">User Management</h2>
            <Button onClick={() => setShowCreateUser(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </div>

          {showCreateUser && (
            <Card>
              <CardHeader>
                <CardTitle>Create New User</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={createUserForm.handleSubmit(onCreateUser)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Username"
                      {...createUserForm.register('username')}
                      error={createUserForm.formState.errors.username?.message}
                    />
                    <Input
                      label="Password"
                      type="password"
                      {...createUserForm.register('password')}
                      error={createUserForm.formState.errors.password?.message}
                    />
                    <Input
                      label="Phone"
                      {...createUserForm.register('phone')}
                      error={createUserForm.formState.errors.phone?.message}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        {...createUserForm.register('status')}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>
                  </div>
                  <Input
                    label="PushDeer Token (Optional)"
                    {...createUserForm.register('pushdeer_token')}
                    error={createUserForm.formState.errors.pushdeer_token?.message}
                  />
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={createUserMutation.isPending}>
                      {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateUser(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              {usersLoading ? (
                <Loading text="Loading users..." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{user.username}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.status === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.status === 'user' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteUserMutation.mutate(user.id)}
                              disabled={deleteUserMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Apps Tab */}
      {activeTab === 'apps' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Application Management</h2>
            <Button onClick={() => setShowCreateApp(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create App
            </Button>
          </div>

          {showCreateApp && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Application</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={createAppForm.handleSubmit(onCreateApp)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="App ID"
                      {...createAppForm.register('app_id')}
                      error={createAppForm.formState.errors.app_id?.message}
                    />
                    <Input
                      label="Name"
                      {...createAppForm.register('name')}
                      error={createAppForm.formState.errors.name?.message}
                    />
                  </div>
                  <Input
                    label="Description"
                    {...createAppForm.register('description')}
                    error={createAppForm.formState.errors.description?.message}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Permission Level
                      </label>
                      <select
                        {...createAppForm.register('required_permission_level')}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...createAppForm.register('is_active')}
                        className="h-4 w-4 text-primary-600 rounded border-gray-300"
                      />
                      <label className="ml-2 text-sm text-gray-700">Active</label>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={createAppMutation.isPending}>
                      {createAppMutation.isPending ? 'Creating...' : 'Create App'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateApp(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appsLoading ? (
              <Loading text="Loading applications..." />
            ) : (
              apps?.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{app.name}</CardTitle>
                        <CardDescription>{app.app_id}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAppMutation.mutate(app.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">{app.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        app.required_permission_level === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {app.required_permission_level}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${app.is_active ? 'bg-green-400' : 'bg-gray-400'}`} />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Invite Codes Tab */}
      {activeTab === 'invites' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Invite Code Management</h2>
            <Button
              onClick={() => generateInviteCodeMutation.mutate()}
              disabled={generateInviteCodeMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-2" />
              {generateInviteCodeMutation.isPending ? 'Generating...' : 'Generate Code'}
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {inviteCodesLoading ? (
                <Loading text="Loading invite codes..." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Used By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inviteCodes?.map((code) => (
                        <tr key={code.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <code className="text-sm font-mono text-gray-900">{code.code}</code>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              code.is_used ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {code.is_used ? 'Used' : 'Available'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {code.used_by || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(code.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyInviteCode(code.code)}
                            >
                              {copiedCode === code.code ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
