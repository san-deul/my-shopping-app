import React from 'react';
import { useNavigate } from 'react-router-dom';



export default function NotFound() {
  const navigate = useNavigate();

  return(
    <div className="section">
      <p> 현재 준비중인 페이지입니다!</p>
      <p> 관리자에게 문의주세요! </p>
      <button onClick={() => navigate('/')} >
        홈으로 돌아가기
      </button>
    </div>
  )

}