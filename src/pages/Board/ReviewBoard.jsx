import { useEffect, useState } from "react";
import Review from "../../components/Board/Review";
import axios from "axios";
import { supabase } from "../../lib/supabase";

export default function ReviewBoard() {
  console.log('g???')
  const [lists, setLists] = useState([]);

  useEffect(() => {

    const fetchLists = async () => {

      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          

        if (error) throw error;
        setLists(data)
      } catch (error) {
        console.error("데이터 불러오기 오류:", error);
      }
    }
    fetchLists()
  }, [])
  console.log('list!!!!s-->', lists)

  return (
    <Review lists={lists} />
  )

}
