import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { userApi, nkeyApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { StatusPage } from '../components/StatusPage';

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function AppLauncherPage() {
  const { appId } = useParams<{ appId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Initializing...');
  const isLaunchedRef = useRef(false);

  // Redirect if no appId
  useEffect(() => {
    if (!appId) {
      navigate('/desktop');
    }
  }, [appId, navigate]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !appId) {
      navigate('/login');
    }
  }, [user, appId, navigate]);

  // Fetch user apps to find the target app URL
  const { data: apps, isLoading: isLoadingApps } = useQuery({
    queryKey: ['apps', user?.username],
    queryFn: async () => {
      const response = await userApi.getMyApps();
      return response.data;
    },
    enabled: !!user && !!appId,
  });

  useEffect(() => {
    // Prevent duplicate launches
    if (isLaunchedRef.current) return;

    const launchApp = async () => {
      if (!appId || !user || !apps) return;

      const app = apps.find(a => a.app_id === appId);

      if (!app) {
        setError('Application not found or you do not have permission to access it.');
        return;
      }

      if (!app.url) {
        setError('Application URL is not configured.');
        return;
      }

      try {
        setStatus(`Authenticating with ${app.name}...`);

        const response = await nkeyApi.generate({
          username: [user.username], // Note: API expects array
          app_ids: [app.app_id],
        });

        const nkey = response.data.nkey;
        const separator = app.url.includes('?') ? '&' : '?';
        const urlWithNkey = `${app.url}${separator}ntoken=${nkey}`;

        setStatus('Redirecting...');
        isLaunchedRef.current = true;

        // Small delay to show the success state
        setTimeout(() => {
          window.location.href = urlWithNkey;
        }, 500);

      } catch (err) {
        const apiError = err as ApiError;
        console.error('Failed to launch app:', apiError);
        setError(apiError.response?.data?.message || 'Failed to generate access token.');
      }
    };

    if (!isLoadingApps && apps) {
      launchApp();
    }
  }, [appId, user, apps, isLoadingApps]);

  const handleBack = () => {
    navigate('/desktop');
  };

  // Show loading if user or appId not ready
  if (!user || !appId) {
    return (
      <StatusPage
        status="loading"
        loadingText="Checking authentication..."
      />
    );
  }

  if (error) {
    return (
      <StatusPage
        status="error"
        title="Launch Failed"
        message={error}
        onBack={handleBack}
        backText="Return to Dashboard"
      />
    );
  }

  return (
    <StatusPage
      status="loading"
      title="Launching Application"
      loadingText={status}
    />
  );
}
