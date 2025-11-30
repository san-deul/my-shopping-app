import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndLevel = async () => {
      setLoading(true);

      // 1️⃣ 현재 세션 가져오기
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      // 2️⃣ 로그인 상태라면 member 테이블에서 level 조회
      if (currentUser?.email) {
        const { data, error } = await supabase
          .from("member")
          .select("email,name,level")
          .eq("email", currentUser.email)
          .single();

        if (!error && data) {
          setMember(data);
        } else {
          setMember(null);
        }
      } else {
        setMember(null);
      }

      setLoading(false);
    };


    getSessionAndLevel();

    // 3️⃣ 로그인 / 로그아웃 상태 감시
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        // 상태 변경 시 level 다시 불러오기
        supabase
          .from("member")
          .select("name, level")
          .eq("email", session.user.email)
          .single()
          .then(({ data, error }) => {
            if (!error && data) setMember(data);
            else setMember(null);
          });
      } else {
        setUser(null);
        setMember(null);
      }
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe(); // 정리코드
  }, []);

  // ✅ user, memer, loading 반환
  return { user, member, loading };
}
