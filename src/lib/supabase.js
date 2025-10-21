// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL과 ANON KEY를 .env 파일에 설정해주세요.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 개발 환경에서만 연결 확인
if (import.meta.env.DEV) {
  console.log('🔗 Supabase 연결 정보:');
  console.log('URL:', supabaseUrl);
  console.log('환경:', supabaseUrl.includes('localhost') ? '로컬' : '실서버');
}

// 연결 테스트 함수
/*
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('products') // 실제 테이블명으로 변경
      .select('id')
      .limit(1);
    
    if (error) throw error;
    
    console.log('✅ Supabase 연결 성공!');
    console.log('📊 프로젝트:', supabaseUrl.split('//')[1]?.split('.')[0]);
    return true;
  } catch (error) {
    console.error('❌ Supabase 연결 실패:', error.message);
    return false;
  }
};*/