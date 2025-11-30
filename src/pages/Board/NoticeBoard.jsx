import { useEffect, useState } from "react";
import Notice from "../../components/Board/Notice";
import axios from "axios";
import { supabase } from "../../lib/supabase";
import { useLoading } from "../../context/LoadingContext";

export default function NoticeBoard() {
  const [lists, setLists] = useState([]);
  const { setLoading } = useLoading();
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        
        const { data, error} = await supabase
        .from("notices")
        .select("*")
        .order("id", { ascending: false })

        if(error) throw error;

        
        setLists(data);
        setLoading(false);
      } catch (error) {
        console.error("공지사항 불러오기 오류:", error);
      }
    };
    fetchNotices();
  }, []);

  return <Notice lists={lists} />;
}
