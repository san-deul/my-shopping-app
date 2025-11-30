import { Link } from "react-router-dom";



import myIcon from "../../../assets/images/pc_my.png"
import cartIcon from "../../../assets/images/pc_cart.png"
import wishIcon from "../../../assets/images/wish.png"



export default function MobileUtil(closeMobileMenu ) {

  return (
    <div className="mobile_util">
      <div>
        <Link to="/login" onClick={closeMobileMenu}>
          <p><img src={myIcon} /></p>
          <p>로그인</p>
        </Link>
      </div>
      <div>
        <Link to="/join" onClick={closeMobileMenu}>
          <p><img src={myIcon} /></p>
          <p>회원가입</p>
        </Link>
      </div>
      <div>
        <Link to="/cart" onClick={closeMobileMenu}>
          <p><img src={cartIcon} /></p>
          <p>장바구니</p>
        </Link>
      </div>

    </div>
  )
}