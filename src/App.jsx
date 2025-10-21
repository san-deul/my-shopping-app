// src/App.js
import { useEffect } from 'react';
import { testSupabaseConnection } from './supabaseClient'; // import 추가

function App() {
  useEffect(() => {
    // 앱 시작할 때 한 번 실행
    testSupabaseConnection();
  }, []);

  return (
    <div className="App">
      {/* 기존 코드 */}
    </div>
  );
}

export default App;