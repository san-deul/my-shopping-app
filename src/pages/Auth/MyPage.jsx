import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "../../components/Auth/MyPage.css";
import MyPageMenu from "../../components/Auth/MyPageMenu";
import MyPageInfo from "../../components/Auth/MyPageInfo";
import { useLoading } from "../../context/LoadingContext";




export default function MyPage() {
  const [user, setUser] = useState(null);
  const [member, setMember] = useState(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("인증 정보 가져오기 실패:", error);
          return;
        }
        setUser(user);


        const { data: memberData, error: memberError } = await supabase
          .from("member")
          .select("*")
          .eq("id", user.id)
          .single();

        if (memberError) throw memberError;
        setMember(memberData);

      } catch (error) {
        console.error("마이페이지 데이터 로드 오류:", err);
      }finally{
        setLoading(false);
      }

    };

    fetchUserData();
  }, [setLoading]);

  if (!user || !member) return null;

  return (
    <div className="mypage">
      <MyPageInfo user={user} member={member} />
      <MyPageMenu />
    </div>
  );
}
