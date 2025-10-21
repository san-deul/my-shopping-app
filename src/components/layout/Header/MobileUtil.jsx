import { Link } from "react-router-dom";



import myIcon from "../../../assets/images/pc_my.png"
import cartIcon from "../../../assets/images/pc_cart.png"
import wishIcon from "../../../assets/images/wish.png"



export default function MobileUtil() {

  return (
    <div className="mobile_util">
      <div>
        <Link to="/login">
          <p><img src={myIcon} /></p>
          <p>로그인</p>
        </Link>
      </div>
      <div>
        <Link to="/join">
          <p><img src={myIcon} /></p>
          <p>회원가입</p>
        </Link>
      </div>
      <div>
        <Link to="">
          <p><img src={cartIcon} /></p>
          <p>장바구니</p>
        </Link>
      </div>
      <div>
        <Link to="">
          <p><img src={wishIcon} /></p>
          <p>위시리스트</p>
        </Link>
      </div>
    </div>
  )
}