import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=1000")
      .then(res => res.json())
      .then(data => setProducts(data.products));
  }, []);

  let filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (sort === "low") filtered.sort((a,b) => a.price - b.price);
  if (sort === "high") filtered.sort((a,b) => b.price - a.price);

  return (
    <div className="container">
      <div className="controls">
        <input placeholder="Search..." onChange={e => setSearch(e.target.value)} />
        <select onChange={e => setSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="low">Price Low → High</option>
          <option value="high">Price High → Low</option>
        </select>
      </div>

      {filtered.length === 0 && <h3>No products found</h3>}

      <div className="grid">
        {filtered.map(p => (
          <div className="card" key={p.id}>
            <img src={p.thumbnail} />
            <h4>{p.title}</h4>
            <p>${p.price}</p>
            <p>{"⭐".repeat(Math.round(p.rating))}</p>
          </div>
        ))}
      </div>
    </div>
  );
}