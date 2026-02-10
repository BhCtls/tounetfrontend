import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { authApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { AuthPageLayout } from '../components/AuthPageLayout';
import { Alert } from '../components/ui/Alert';
import { FormField } from '../components/ui/FormField';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      login(response.data.token);
      navigate('/');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      setError(error.response?.data?.message || 'Login failed');
    },
  });

  const onSubmit = (data: LoginForm) => {
    setError('');
    loginMutation.mutate(data);
  };

  return (
    <AuthPageLayout
      icon={<LogIn className="h-12 w-12" />}
      title="登录到TouNet"
      subtitle={
        <>
          Or{' '}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            创建新账号
          </Link>
        </>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>登录</CardTitle>
          <CardDescription>
            输入您的凭据
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="error">{error}</Alert>
            )}

            <FormField
              label="Username"
              {...register('username')}
              error={errors.username?.message}
              placeholder="Enter your username"
            />

            <FormField
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Default Admin Credentials
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              开什么玩笑: <code className="bg-gray-100 px-1 rounded">怎么会有admin示例账户呢</code>
              <br />
              Password: <code className="bg-gray-100 px-1 rounded">只是css不想删掉了</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </AuthPageLayout>
  );
}
