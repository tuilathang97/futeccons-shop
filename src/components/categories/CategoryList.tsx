export default function CategoryList({ categories }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id} className="mb-2">
            <div>
            {category.name} (Parent ID: {category.parentId || 'None'})
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}