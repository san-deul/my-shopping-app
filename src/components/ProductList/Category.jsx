import { Link } from "react-router-dom";
import "./Category.css";

export default function CategoryList({ categories, currentCategory }) {
  if (!categories.length || !currentCategory) return null;
  
  // 현재 카테고리가 상위인지 하위인지 구분
  const isParent = currentCategory.parent_id === null;

  // 상위 카테고리 id 구하기
  const parentId = isParent ? currentCategory.id : currentCategory.parent_id;

  // 하위 카테고리 필터링
  const subCategories = categories.filter(
    (cate) => Number(cate.parent_id) == parentId
  );

  console.log('subCategoriess-->' , subCategories)
  // 전체 탭 포함
  const allTabs = [
    { id: parentId, name: "전체" },
    ...subCategories,
  ];

   console.log("🟢 allTabs:", allTabs);

  return (
    <div className="category-list">
      {allTabs.map((cate) => (
        <div key={cate.id}>
          <Link
            to={`/shop/${cate.id}`}
            className={`category-tab ${
              cate.id === currentCategory.id ? "active" : ""
            }`}
          >
            {cate.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
