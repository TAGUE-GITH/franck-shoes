import ProductCard from '../components/ProductCard'
import products from '../data/products'

import './ProductsPage.css'

function ProductsPage({ onAddToCart }) {
  return (
    <main className="products-page">

      <header className="products-page-header">
        <span>Collection</span>

        <h1>Toutes nos chaussures</h1>

        <p>
          Explore notre collection et trouve la paire
          qui correspond à ton style.
        </p>
      </header>

      <div className="products-page-grid">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => onAddToCart(product)}
          />
        ))}

      </div>

    </main>
  )
}

export default ProductsPage