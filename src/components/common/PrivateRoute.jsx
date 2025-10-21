import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth"


export default function PrivateRoute({ element }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!user) {
    // 로그인하지 않은 경우 → 로그인 페이지로 리다이렉트
    // state로 현재 위치를 전달해 로그인 후 돌아오게 함
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 로그인되어 있으면 해당 컴포넌트를 렌더링
  return element;
}
