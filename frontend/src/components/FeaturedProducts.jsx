import { Link } from 'react-router-dom'

import ProductCard from './ProductCard'
import products from '../data/products'

import './FeaturedProducts.css'

function FeaturedProducts({ onAddToCart }) {
  const featuredProducts = products.slice(0, 3)

  return (
    <section className="featured-products">

      <div className="featured-header">
        <div>
          <span>Notre sélection</span>

          <h2>Les incontournables</h2>
        </div>

        <Link
          to="/products"
          className="view-all-link"
        >
          Voir toutes les chaussures
          <span>→</span>
        </Link>
      </div>

      <div className="featured-grid">

        {featuredProducts.map((product) => (
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

export default FeaturedProducts