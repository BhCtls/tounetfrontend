import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import pako from 'pako';

export function DownloadOrderPage() {
  const [gameId, setGameId] = useState('');
  const [version, setVersion] = useState('');
  const [serial, setSerial] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const validate = () => {
    if (!/^[A-Z0-9]{4}$/.test(gameId)) return '❌ 游戏ID格式错误 (4位大写字母或数字)';
    if (!/^\d+(\.\d+)?$/.test(version)) return '❌ 版本格式错误 (数字)';
    if (!/^[A-Z0-9]{11}$/.test(serial)) return '❌ 序列号格式错误 (11位大写字母或数字)';
    return null;
  };

  const handleSubmit = async () => {
    setError('');
    setResult(null);
    
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // 1. Construct query string
      const params = new URLSearchParams();
      params.append('game_id', gameId);
      params.append('ver', version);
      params.append('serial', serial);
      const queryString = params.toString();

      // 2. Compress (zlib)
      // PHP gzcompress uses ZLIB format (RFC 1950)
      const compressed = pako.deflate(queryString);

      // 3. Base64 encode
      // Convert Uint8Array to binary string
      let binary = '';
      for (let i = 0; i < compressed.length; i++) {
        binary += String.fromCharCode(compressed[i]);
      }
      const base64Data = btoa(binary);

      // 4. Send Request
      // Use proxy path /naominet to avoid CORS and Mixed Content
      const response = await fetch('/naominet/sys/servlet/DownloadOrder', {
        method: 'POST',
        headers: {
          'Pragma': 'DFI',
          'User-Agent': 'ALL.Net',
          'Content-Type': 'application/octet-stream',
        },
        body: base64Data
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const responseText = await response.text();
      if (!responseText) {
        throw new Error('❌ 请求失败: 空响应');
      }

      // 5. Base64 Decode
      const decodedBinaryString = atob(responseText);
      const decodedUint8Array = new Uint8Array(decodedBinaryString.length);
      for (let i = 0; i < decodedBinaryString.length; i++) {
        decodedUint8Array[i] = decodedBinaryString.charCodeAt(i);
      }

      // 6. Decompress
      let decompressedString;
      try {
        decompressedString = pako.inflate(decodedUint8Array, { to: 'string' });
      } catch (e) {
        throw new Error('❌ 解压失败');
      }

      // 7. Parse Response
      const parsedParams = new URLSearchParams(decompressedString);
      const parsedData: any = {};
      parsedParams.forEach((value, key) => {
        parsedData[key] = value;
      });

      setResult(parsedData);

    } catch (err: any) {
      console.error(err);
      setError(err.message || '请求发生未知错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4" style={{
      backgroundColor: '#f2f2f2',
      fontFamily: 'Arial, sans-serif'
    }}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Download Order 生成器</CardTitle>
          <CardDescription>输入游戏信息获取更新指示书</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <Input
              label="游戏ID (Game ID)"
              placeholder="例如: SDEZ"
              value={gameId}
              onChange={(e) => setGameId(e.target.value.toUpperCase())}
              maxLength={4}
            />
            <Input
              label="版本 (Version)"
              placeholder="例如: 1.00"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            />
            <Input
              label="序列号 (Serial)"
              placeholder="例如: A1234567890"
              value={serial}
              onChange={(e) => setSerial(e.target.value.toUpperCase())}
              maxLength={11}
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full"
          >
            {loading ? '请求中...' : '获取 Download Order'}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm whitespace-pre-wrap">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-4 border-t pt-4">
              <div className="text-center font-bold text-gray-500">
                ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
              </div>
              
              <div>
                <h3 className="font-bold mb-2">【请求参数】</h3>
                <div className="grid grid-cols-[100px_1fr] gap-1 text-sm">
                  <span className="text-gray-600">游戏ID:</span>
                  <span className="font-mono">{gameId}</span>
                  <span className="text-gray-600">版本:</span>
                  <span className="font-mono">{version}</span>
                  <span className="text-gray-600">序列号:</span>
                  <span className="font-mono">{serial}</span>
                </div>
              </div>

              <div className="text-center font-bold text-gray-500">
                ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
              </div>

              <div className={`flex items-center gap-2 font-bold ${result.stat == '1' ? 'text-green-600' : 'text-red-600'}`}>
                <span>{result.stat == '1' ? '✔' : '✘'}</span>
                <span>状态 : {result.stat == '1' ? '请求成功' : '请求失败'} (代码 {result.stat})</span>
              </div>

              {result.serial && (
                <div>
                  <h3 className="font-bold mb-2">【关联序列号】</h3>
                  <ul className="list-disc list-inside text-sm font-mono bg-gray-50 p-2 rounded">
                    {result.serial.split(',').map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="font-bold mb-2">【下载资源】</h3>
                {result.uri ? (
                  <ul className="space-y-2">
                    {result.uri.split('|').filter((u: string) => u).map((uri: string, i: number) => (
                      <li key={i} className="text-sm break-all bg-blue-50 p-2 rounded border border-blue-100">
                        <span className="font-bold mr-2">▸ {i + 1}.</span>
                        <a href={uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {uri}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 text-sm">⓪ 暂无可用链接</div>
                )}
              </div>

              <div className="text-center font-bold text-gray-500">
                ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
