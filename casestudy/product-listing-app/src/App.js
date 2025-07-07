import React, { useEffect, useState } from "react";
import "./index.css";

const COLORS = [
  { key: "yellow", label: "Yellow Gold" },
  { key: "white", label: "White Gold" },
  { key: "rose", label: "Rose Gold" }
];

function StarRating({ score }) {
  //  yıldız gösterimi gözükecek
  const fullStars = Math.floor(score);
  const halfStar = score - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="star-rating">
      {[...Array(fullStars)].map((_, i) => (
        <span className="star" key={"full" + i}>★</span>
      ))}
      {halfStar && <span className="star">☆</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span className="star inactive" key={"empty" + i}>★</span>
      ))}
      <span style={{marginLeft: 6, fontWeight: 500, color: "#444"}}>{score.toFixed(1)}</span>
    </div>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/products")
      .then(res => res.json())
      .then(data => setProducts(data.products));
  }, []);

  // renk seçimi yap
  const handleColorSelect = (productName, colorKey) => {
    setSelectedColors(prev => ({ ...prev, [productName]: colorKey }));
  };

  return (
    <div>
      <h2 className="product-list-title">Product List</h2>
      <div className="product-carousel">
        {products.map(product => {
          const selectedColor = selectedColors[product.name] || "yellow";
          const popularity5 = product.popularityScore * 5;
          return (
            <div className="product-card" key={product.name}>
              <img
                className="product-image"
                src={product.images[selectedColor]}
                alt={product.name}
              />
              <div className="product-title">{product.name}</div>
              <div className="product-price">
                {product.price ? <b>${product.price} USD</b> : "Fiyat Yok"}
              </div>
              {/* Renk seçici */}
              <div className="color-picker">
                {COLORS.map(c => (
                  <span
                    key={c.key}
                    className={`color-dot ${c.key} ${selectedColor === c.key ? "selected" : ""}`}
                    title={c.label}
                    onClick={() => handleColorSelect(product.name, c.key)}
                  />
                ))}
              </div>
              {/* Yıldızlı popülerlik */}
              <StarRating score={popularity5} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;