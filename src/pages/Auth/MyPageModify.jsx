import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useLoading } from "../../context/LoadingContext";

import "../../components/Auth/MyModify.css";
import MyModify from "../../components/Auth/MyModify";

export default function MyPageModify() {
  const [user, setUser] = useState(null);
  const [member, setMember] = useState(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    fetchUserData();
  }, []);

  /** ✅ 현재 로그인한 사용자 정보 가져오기 */
  const fetchUserData = async () => {
    try {
      setLoading(true);

      // 1. 현재 로그인 사용자 가져오기
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
        return;
      }
      setUser(user);

      // 2. member 테이블에서 추가 정보 가져오기
      const { data: memberData, error: memberError } = await supabase
        .from("member")
        .select("*")
        .eq("id", user.id)
        .single();

      if (memberError) throw memberError;
      setMember(memberData);
    } catch (error) {
      console.error("회원정보 불러오기 오류:", error);
      alert("회원정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  /** ✅ 회원정보 수정 */
  const handleUpdateProfile = async (formData) => {
    try {
      setLoading(true);

      // 1. 비밀번호 변경이 있는 경우
      if (formData.newPassword) {
        const { error: pwError } = await supabase.auth.updateUser({
          password: formData.newPassword,
        });
        if (pwError) throw pwError;
      }

      // 2. member 테이블 정보 업데이트
      const { error: updateError } = await supabase
        .from("member")
        .update({
          name: formData.name,
          phone: formData.phone,
          zipcode: formData.zipcode,
          basic_address: formData.basic_address,
          detail_address: formData.detail_address,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      alert("✅ 회원정보가 수정되었습니다!");
      fetchUserData(); // 수정 후 정보 새로고침
    } catch (error) {
      console.error("정보 수정 오류:", error);
      alert("정보 수정 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  /** ✅ 현재 비밀번호 확인 */
  const verifyCurrentPassword = async (currentPassword) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      return !error;
    } catch (error) {
      console.error("비밀번호 확인 오류:", error);
      return false;
    }
  };

  if (!user || !member) return null;

  return (
    <div className="mypage-modify-container">
      <MyModify
        userData={{
          userId: user.id,
          email: user.email,
          ...member,
        }}
        onSubmit={handleUpdateProfile}
        onVerifyPassword={verifyCurrentPassword}
      />
    </div>
  );
}
