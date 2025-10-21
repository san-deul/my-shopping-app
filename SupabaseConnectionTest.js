import { useEffect, useState } from 'react';
import { supabase } from './src/lib/supabase'; // 본인의 supabase 클라이언트 경로

function SupabaseConnectionTest() {
  const [status, setStatus] = useState('확인 중...');
  const [dbInfo, setDbInfo] = useState(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      // 1. Supabase URL 확인
      const supabaseUrl = supabase.supabaseUrl;
      
      // 2. 간단한 쿼리로 연결 테스트
      const { data, error } = await supabase
        .from('_tableName_') // 실제 테이블명으로 변경
        .select('count')
        .limit(1);

      if (error) throw error;

      setStatus('✅ 연결 성공!');
      setDbInfo({
        url: supabaseUrl,
        환경: supabaseUrl.includes('localhost') ? '로컬' : '실서버',
        프로젝트ID: supabaseUrl.split('//')[1]?.split('.')[0]
      });
    } catch (error) {
      setStatus('❌ 연결 실패');
      console.error('Supabase 연결 오류:', error);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h3>Supabase 연결 상태</h3>
      <p><strong>상태:</strong> {status}</p>
      {dbInfo && (
        <>
          <p><strong>URL:</strong> {dbInfo.url}</p>
          <p><strong>환경:</strong> {dbInfo.환경}</p>
          <p><strong>프로젝트 ID:</strong> {dbInfo.프로젝트ID}</p>
        </>
      )}
    </div>
  );
}