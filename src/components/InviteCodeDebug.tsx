import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../lib/api';

export function InviteCodeDebug() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['debug-invite-codes'],
    queryFn: async () => {
      console.log('Debug: Fetching invite codes...');
      const response = await adminApi.getInviteCodes(1, 5);
      console.log('Debug: Response:', response);
      return response;
    },
  });

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
      <h3 className="font-bold mb-2">Invite Codes Debug</h3>
      <div className="text-sm space-y-1">
        <p>Loading: {isLoading ? 'true' : 'false'}</p>
        <p>Error: {error ? error.message : 'none'}</p>
        <p>Token exists: {localStorage.getItem('token') ? 'true' : 'false'}</p>
        <p>Data: {data ? 'received' : 'none'}</p>
        {data && (
          <div>
            <p>Response code: {data.code}</p>
            <p>Response message: {data.message}</p>
            <p>Invite codes count: {data.data?.invite_codes?.length || 0}</p>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
