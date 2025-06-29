import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { authApi } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number is required'),
  pushdeer_token: z.string().optional(),
  invite_code: z.string().min(1, 'Invite code is required'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      setSuccess('Account created successfully! Please login.');
      setTimeout(() => navigate('/login'), 2000);
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Registration failed');
    },
  });

  const onSubmit = (data: RegisterForm) => {
    setError('');
    setSuccess('');
    registerMutation.mutate({
      ...data,
      pushdeer_token: data.pushdeer_token || '',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Create a new account to access TouNetCore
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="text-sm text-green-700">{success}</div>
                </div>
              )}

              <Input
                label="Username"
                {...register('username')}
                error={errors.username?.message}
                placeholder="Enter your username"
              />

              <Input
                label="Password"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                placeholder="Enter your password"
              />

              <Input
                label="Phone Number"
                {...register('phone')}
                error={errors.phone?.message}
                placeholder="13800138000"
              />

              <Input
                label="PushDeer Token (Optional)"
                {...register('pushdeer_token')}
                error={errors.pushdeer_token?.message}
                placeholder="PUSHDEER_XXXXXXXXX"
              />

              <Input
                label="Invite Code"
                {...register('invite_code')}
                error={errors.invite_code?.message}
                placeholder="Enter your invite code"
              />

              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Sample Invite Codes
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                <code className="bg-gray-100 px-1 rounded">METzuzFY8KSudQOnvpS-Qw</code>
                <br />
                <code className="bg-gray-100 px-1 rounded">Wh9iukC14-VXTnDHwaeiQw</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
