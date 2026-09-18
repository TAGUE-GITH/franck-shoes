import ProductCard from './ProductCard'
import products from '../data/products'

import './Products.css'

function Products({ onAddToCart }) {
  return (
    <section className="products" id="products">

      <div className="products-heading">
        <span>Notre sélection</span>
        <h2>Nos chaussures</h2>
      </div>

      <div className="products-list">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => onAddToCart(product)}
          />
        ))}

      </div>

    </section>
  )
}

export default Products