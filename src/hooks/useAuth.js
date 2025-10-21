import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [level, setLevel] = useState(null); // 👈 level 추가
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
        const { data: member, error } = await supabase
          .from("member")
          .select("level")
          .eq("email", currentUser.email)
          .single();

        if (!error && member) {
          setLevel(member.level);
        } else {
          setLevel(null);
        }
      } else {
        setLevel(null);
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
          .select("level")
          .eq("email", session.user.email)
          .single()
          .then(({ data, error }) => {
            if (!error && data) setLevel(data.level);
            else setLevel(null);
          });
      } else {
        setUser(null);
        setLevel(null);
      }
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe(); // 정리코드
  }, []);

  // ✅ user, level, loading 반환
  return { user, level, loading };
}
