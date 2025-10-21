
import myIcon from "../assets/images/pc_my.png";
import cartIcon from "../assets/images/pc_cart.png";


// 상단 Nav메뉴
export const navMenus = [
  {
    key: "glowly",
    label: "GLOWLY",
    to:"/brandstory",
    children: [
      { to: "/brandstory", label: "브랜드소개" },

    ],
  },
  {
    key: "shop",
    label: "상품구매",
    to:"/shop/all",
    children: [
      { to: "/shop/all", label: "전체상품" },
      { to: "/shop/10", label: "스킨케어" },
      { to: "/shop/20", label: "메이크업" },
      { to: "/shop/30", label: "헤어케어" },
      { to: "/shop/40", label: "바디케어" },
    ],
  },
  { key: "review", label: "사용후기", to: "/review" },
  { key: "membership", label: "멤버십", to: "/membership" },
  { key: "event", label: "이벤트", to: "/event" },
  {
    key: "support",
    label: "고객센터",
    to:"/notice",
    children: [
      { to: "/notice", label: "공지사항" },
      { to: "/qa", label: "1:1문의" },
    ],
  },
];

//유틸메뉴
export const utilMenus = [
  {
    key: "my",
    icon: myIcon,
    to: "#",
    children: [
      { key: 1, label: "회원가입", to: "/join" },
      { key: 2, label: "로그인", to: "/login" },
      { key: 3, label: "마이페이지", to: "/mypage" },
    ],
  },
  {
    key: "cart",
    icon: cartIcon,
    to: "/cart",
    badge: 0, // 장바구니 갯수
  },

];


// 버튼 누르면 열리는 AllMenus
export const allMenus = [
  {
    key: "all",
    label: "전체상품보기",
    to: "/shop/all",
  },
  {
    key: 2,
    label: "GLOWLY",
    to: "/",
    children: [{ label: "브랜드소개", to: "" }, { label: "인증사항", to: "" }]
  },
  {
    key: "shop10",
    label: "스킨케어",
    to: "/shop/10",
    children: [{ label: "스킨/토너", to: "/shop/1010" }, { label: "로션", to: "/shop/1020" }, { label: "크림", to: "/shop/1030" }]
  },
  {
    key: "shop20",
    label: "메이크업",
    to: "/shop/20",
    children: [{ label: "베이스", to: "/shop/2010" }, { label: "아이", to: "/shop/2020" }, { label: "립", to: "/shop/2030" }]
  },
  {
    key: "shop30",
    label: "헤어케어",
    to: "/shop/30",
    children: [{ label: "샴푸", to: "/shop/3010" }, { label: "린스", to: "/shop/3020" }, { label: "트리트먼트", to: "/shop/3030" }]
  },
  {
    key: "shop40",
    label: "바디케어",
    to: "/shop/40",
    children: [{ label: "로션", to: "/shop/4010" }, { label: "핸드케어", to: "/shop/4020" }, { label: "풋케어", to: "/shop/4030" }]
  },
  {
    key: "support",
    label: "고객센터",
    to: "/",
    children: [{ label: "공지사항", to: "/" }]
  },

]


// 모바일메뉴
export const mobileMenus = [
  {
    key: "all",
    to:"/shop/all",
    label: "전체상품",
  },
  {
    key: "glowly",
    label: "GLOWLY",
    children: [
      { to: "/brandstory", label: "브랜드소개" },

    ],
  },
  {
    key: "shop10",
    label: "스킨케어",
    children: [{ label: "스킨/토너", to: "/shop/1010" }, { label: "로션", to: "/shop/1020" }, { label: "크림", to: "/shop/1030" }]
  },
  {
    key: "shop20",
    label: "메이크업",
    to: "/shop/20",
    children: [{ label: "베이스", to: "/shop/2010" }, { label: "아이", to: "/shop/2020" }, { label: "립", to: "/shop/2030" }]
  },
  {
    key: "shop30",
    label: "헤어케어",
    to: "/shop/30",
    children: [{ label: "샴푸", to: "/shop/3010" }, { label: "린스", to: "/shop/3020" }, { label: "트리트먼트", to: "/shop/3030" }]
  },
  {
    key: "shop40",
    label: "바디케어",
    to: "/shop/40",
    children: [{ label: "로션", to: "/shop/4010" }, { label: "핸드케어", to: "/shop/4020" }, { label: "풋케어", to: "/shop/4030" }]
  },
  { key: "review", label: "사용후기", to: "/review" },

  {
    key: "support",
    label: "고객센터",
    children: [
      { to: "/notice", label: "공지사항" },
      { to: "/qa", label: "1:1문의" },

    ],
  },
];