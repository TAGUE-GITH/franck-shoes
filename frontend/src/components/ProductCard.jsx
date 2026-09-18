import { Link } from 'react-router-dom'

import './ProductCard.css'

function ProductCard({ product }) {
  return (
    <article className="product-card">

      <Link
        to={`/products/${product.id}`}
        className="product-image-container"
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />

        <span
          className={
            product.stock === 0
              ? 'product-badge out'
              : 'product-badge'
          }
        >
          {product.stock === 0 ? 'Épuisé' : 'Disponible'}
        </span>
      </Link>

      <div className="product-content">

        <p className="product-brand">
          {product.brand}
        </p>

        <Link
          to={`/products/${product.id}`}
          className="product-name-link"
        >
          <h3>{product.name}</h3>
        </Link>

        <div className="product-info">
          <p className="product-price">
            {product.price} €
          </p>

          <p className={product.stock === 0 ? 'stock out' : 'stock'}>
            {product.stock === 0
              ? 'Rupture de stock'
              : `${product.stock} en stock`}
          </p>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="product-view-button"
        >
          Voir le produit
        </Link>

      </div>

    </article>
  )
}

export default ProductCard