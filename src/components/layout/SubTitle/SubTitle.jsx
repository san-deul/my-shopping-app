import { useMatches } from "react-router-dom"
import "./SubTitle.css"

export default function SubTitle(){
  const matches = useMatches();
  //console.log('matches ==> ', matches)

  const currentMatch = matches[matches.length - 1]; 
  const title = currentMatch?.handle?.title;

  // title이 있을 때만 서브 타이틀 영역을 렌더링 (메인 페이지는 title이 없음)
  if (!title) {
    return null; 
  }
  return(

    
      <div className="sub-title-area"> 
        <h4 className="sub-title">{title}</h4>
      </div>


  )
    


  

}