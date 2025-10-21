import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "../../components/Auth/MyPage.css";
import MyPageMenu from "../../components/Auth/MyPageMenu";
import MyPageInfo from "../../components/Auth/MyPageInfo";




export default function MyPage() {
  const [user, setUser] = useState(null);
  const [member, setMember] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      // 1️⃣ 인증 유저 가져오기
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("인증 정보 가져오기 실패:", error);
        return;
      }
      setUser(user);

      // 2️⃣ member 정보 가져오기
      const { data: memberData, error: memberError } = await supabase
        .from("member")
        .select("*")
        .eq("id", user.id)
        .single();

      if (memberError) console.error("멤버 정보 오류:", memberError);
      else setMember(memberData);
    };

    fetchUserData();
  }, []);

  if (!user || !member) return <div>로딩 중...</div>;

  return (
    <div className="mypage">
      <MyPageInfo user={user} member={member} />
      <MyPageMenu />
    </div>
  );
}
