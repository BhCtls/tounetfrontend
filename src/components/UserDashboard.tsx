import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userApi, nkeyApi, adminApi } from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Loading } from './ui/Loading';
import { PermissionBadge } from './PermissionGuard';
import { Key, Smartphone, Users, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { formatDate, copyToClipboard } from '../lib/utils';

const updateProfileSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
  pushdeer_token: z.string().optional(),
});

const generateNKeySchema = z.object({
  username: z.string().min(1, 'Username is required'),
  app_ids: z.string().min(1, 'At least one app must be selected'),
});

type UpdateProfileForm = z.infer<typeof updateProfileSchema>;
type GenerateNKeyForm = z.infer<typeof generateNKeySchema>;

export function UserDashboard() {
  const queryClient = useQueryClient();
  const [copiedNKey, setCopiedNKey] = useState<string>('');
  const [generatedNKey, setGeneratedNKey] = useState<string>('');
  const [accessingApp, setAccessingApp] = useState<string>('');
  const [appStatus, setAppStatus] = useState<Record<string, 'checking' | 'online' | 'offline'>>({});

  const { data: apps, isLoading: appsLoading } = useQuery({
    queryKey: ['user', 'apps'],
    queryFn: async () => {
      const response = await userApi.getMyApps();
      return response.data;
    },
  });

  // Check app statuses when apps data is loaded
  useEffect(() => {
    if (apps && Array.isArray(apps)) {
      apps.forEach(app => {
        if (app.url) {
          checkAppStatus(app.app_id, app.url);
        }
      });
    }
  }, [apps]);

  const { data: user } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const response = await userApi.getMe();
      return response.data;
    },
  });

  const updateProfileForm = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      phone: user?.phone || '',
      pushdeer_token: user?.pushdeer_token || '',
    },
  });

  const generateNKeyForm = useForm<GenerateNKeyForm>({
    resolver: zodResolver(generateNKeySchema),
    defaultValues: {
      username: user?.username || '',
      app_ids: '',
    },
  });

  // Reset form when user data changes (especially when user status changes)
  useEffect(() => {
    if (user) {
      const isTrusted = user.status === 'trusted' || user.status === 'admin';
      generateNKeyForm.reset({
        username: isTrusted ? '' : user.username,
        app_ids: '',
      });
    }
  }, [user, generateNKeyForm]);

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });

  const generateNKeyMutation = useMutation({
    mutationFn: nkeyApi.generate,
    onSuccess: (response) => {
      setGeneratedNKey(response.data.nkey);
      generateNKeyForm.reset();
    },
  });

  const onUpdateProfile = (data: UpdateProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  const onGenerateNKey = async (data: GenerateNKeyForm) => {
    // Check if user is trusted and can generate NKeys for others
    const isTrusted = user?.status === 'trusted' || user?.status === 'admin';
    
    try {
      let response;
      if (isTrusted) {
        // Use admin API for trusted users to generate NKeys for others
        response = await adminApi.generateNKey({
          username: data.username, // Use the input username directly
          app_ids: data.app_ids.split(',').map(id => id.trim()),
        });
      } else {
        // Regular user API for non-trusted users
        response = await nkeyApi.generate({
          username: [data.username],
          app_ids: data.app_ids.split(',').map(id => id.trim()),
        });
      }
      
      setGeneratedNKey(response.data.nkey);
      generateNKeyForm.reset({
        username: isTrusted ? '' : user?.username || '',
        app_ids: '',
      });
    } catch (error) {
      console.error('Failed to generate NKey:', error);
      alert('Failed to generate NKey. Please check the username and try again.');
    }
  };

  const handleCopyNKey = async (nkey: string) => {
    await copyToClipboard(nkey);
    setCopiedNKey(nkey);
    setTimeout(() => setCopiedNKey(''), 2000);
  };

  const pingUrl = async (url: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(url, {
        method: 'HEAD', // Use HEAD to minimize data transfer
        mode: 'cors', // Use cors mode to get actual response status
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // Consider only 2xx and 3xx status codes as online
      // All 4xx and 5xx status codes are treated as offline
      // but 401 403 is online
      return response.status >= 200 && response.status < 404;
    } catch (error) {
      console.log(`App unreachable: ${url}`, error);
      return false;
    }
  };

  const checkAppStatus = async (appId: string, url: string) => {
    setAppStatus(prev => ({ ...prev, [appId]: 'checking' }));
    
    const isOnline = await pingUrl(url);
    
    setAppStatus(prev => ({ 
      ...prev, 
      [appId]: isOnline ? 'online' : 'offline' 
    }));
  };

  const handleAppAccess = async (appId: string, appUrl?: string) => {
    if (!appUrl || !user?.username) {
      return;
    }

    setAccessingApp(appId);
    
    try {
      // Generate NKey for this specific app
      const response = await nkeyApi.generate({
        username: [user.username],
        app_ids: [appId],
      });

      const nkey = response.data.nkey;
      
      // Create URL with nkey as parameter
      const urlWithNkey = `${appUrl}${appUrl.includes('?') ? '&' : '?'}nkey=${nkey}`;
      
      // Navigate in current window
      window.location.href = urlWithNkey;
    } catch (error) {
      console.error('Failed to generate NKey for app access:', error);
      alert('Failed to access application. Please try again.');
    } finally {
      setAccessingApp('');
    }
  };

  const handleCopyAppLink = async (appId: string, appUrl?: string) => {
    if (!appUrl || !user?.username) {
      return;
    }

    try {
      // Generate NKey for this specific app
      const response = await nkeyApi.generate({
        username: [user.username],
        app_ids: [appId],
      });

      const nkey = response.data.nkey;
      
      // Create URL with nkey as parameter (backup method)
      const urlWithNkey = `${appUrl}${appUrl.includes('?') ? '&' : '?'}nkey=${nkey}`;
      
      await copyToClipboard(urlWithNkey);
      setCopiedNKey(appId + '_link'); // Use app_id to identify copied link
      setTimeout(() => setCopiedNKey(''), 3000);
    } catch (error) {
      console.error('Failed to generate link for app access:', error);
      alert('Failed to generate app link. Please try again.');
    }
  };

  if (appsLoading) {
    return <Loading text="Loading your dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Welcome, {user?.username}!
          </CardTitle>
          <CardDescription>
            Manage your profile and generate NKeys for application access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{apps?.length || 0}</div>
              <div className="text-sm text-gray-600">Available Apps</div>
            </div>
            <div className="text-center">
              <PermissionBadge level={user?.status || 'disableduser'} />
              <div className="text-sm text-gray-600 mt-1">Account Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatDate(user?.created_at || '')}</div>
              <div className="text-sm text-gray-600">Member Since</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="w-5 h-5 mr-2" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Update your contact information and notification settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateProfileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
              <Input
                label="Phone Number"
                {...updateProfileForm.register('phone')}
                error={updateProfileForm.formState.errors.phone?.message}
              />
              <Input
                label="PushDeer Token (Optional)"
                {...updateProfileForm.register('pushdeer_token')}
                error={updateProfileForm.formState.errors.pushdeer_token?.message}
                placeholder="PUSHDEER_XXXXXXXXX"
              />
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
              </Button>
              {updateProfileMutation.isSuccess && (
                <p className="text-sm text-green-600">Profile updated successfully!</p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* NKey Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Generate NKey
              {(user?.status === 'trusted' || user?.status === 'admin') && (
                <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                  Trusted Access
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {(user?.status === 'trusted' || user?.status === 'admin') 
                ? 'Generate temporary access keys for any user and their applications.'
                : 'Generate temporary access keys for your applications.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={generateNKeyForm.handleSubmit(onGenerateNKey)} className="space-y-4">
              <Input
                label={
                  (user?.status === 'trusted' || user?.status === 'admin') 
                    ? "Target Username" 
                    : "Username"
                }
                {...generateNKeyForm.register('username')}
                error={generateNKeyForm.formState.errors.username?.message}
                readOnly={!(user?.status === 'trusted' || user?.status === 'admin')}
                placeholder={
                  (user?.status === 'trusted' || user?.status === 'admin') 
                    ? "Enter any username" 
                    : user?.username
                }
              />
              <Input
                label="App IDs (comma-separated)"
                {...generateNKeyForm.register('app_ids')}
                error={generateNKeyForm.formState.errors.app_ids?.message}
                placeholder="searchall, CardPreview"
              />
              <Button
                type="submit"
                disabled={generateNKeyMutation.isPending}
              >
                {generateNKeyMutation.isPending ? 'Generating...' : 'Generate NKey'}
              </Button>
            </form>

            {(user?.status === 'trusted' || user?.status === 'admin') && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-md border border-yellow-200">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Trusted User Privileges:</h4>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• You can generate NKeys for any user in the system</li>
                  <li>• Enter the target username in the field above</li>
                  <li>• Ensure the target user has access to the specified applications</li>
                  <li>• Generated NKeys will be valid for the target user's account</li>
                </ul>
              </div>
            )}

            {generatedNKey && (
              <div className="mt-4 p-3 bg-green-50 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">NKey Generated:</p>
                    <code className="text-sm text-green-700 break-all">{generatedNKey}</code>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyNKey(generatedNKey)}
                  >
                    {copiedNKey === generatedNKey ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  This key expires in 15 minutes. Copy it now!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Available Apps */}
      <Card>
        <CardHeader>
          <CardTitle>Available Applications</CardTitle>
          <CardDescription>
            Applications you have access to with your current account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps?.map((app) => (
              <div
                key={app.id}
                className={`border rounded-lg p-4 transition-all ${
                  app.url && accessingApp !== app.app_id
                    ? 'hover:shadow-md hover:border-blue-300 cursor-pointer'
                    : 'hover:shadow-sm'
                } ${accessingApp === app.app_id ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => app.url && accessingApp !== app.app_id && handleAppAccess(app.app_id, app.url)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{app.name}</h3>
                      {app.url && (
                        <ExternalLink className="w-4 h-4 text-blue-500" />
                      )}
                      {accessingApp === app.app_id && (
                        <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{app.description}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {app.app_id}
                      </span>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    !app.url 
                      ? 'bg-gray-400' // No URL configured
                      : appStatus[app.app_id] === 'checking' 
                        ? 'bg-yellow-400 animate-pulse' // Checking status
                        : appStatus[app.app_id] === 'online' 
                          ? 'bg-green-400' // Online
                          : 'bg-red-400' // Offline
                  }`} />
                </div>
                
                {app.url && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-gray-600">
                          {accessingApp === app.app_id ? 'Generating access key...' : 'Click to login with 15-minute access key'}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            if (app.url) {
                              checkAppStatus(app.app_id, app.url);
                            }
                          }}
                          title="Refresh status"
                          disabled={appStatus[app.app_id] === 'checking'}
                        >
                          <RefreshCw className={`w-3 h-3 ${appStatus[app.app_id] === 'checking' ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            handleCopyAppLink(app.app_id, app.url);
                          }}
                          title="Copy link with access key"
                        >
                          {copiedNKey === app.app_id + '_link' ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {!app.url && (
                  <div className="mt-4 text-center text-sm text-gray-500">
                    No direct access URL configured
                  </div>
                )}
              </div>
            ))}
          </div>
          {!apps?.length && (
            <div className="text-center py-8 text-gray-500">
              No applications available for your account.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
