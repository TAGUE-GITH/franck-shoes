import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import products from '../data/products'

import './ProductPage.css'

function ProductPage({ onAddToCart }) {
  const { id } = useParams()

  const [selectedSize, setSelectedSize] = useState(null)
  const [message, setMessage] = useState('')

  const product = products.find(
    (item) => item.id === Number(id)
  )

  if (!product) {
    return (
      <main className="product-not-found">

        <h1>Produit introuvable</h1>

        <Link to="/products">
          Retour aux chaussures
        </Link>

      </main>
    )
  }

  function handleAddToCart() {
    if (!selectedSize) {
      setMessage('Choisissez une pointure.')
      return
    }

    onAddToCart(product, selectedSize)

    setMessage('Produit ajouté au panier.')
  }

  return (
    <main className="product-page">

      <Link
        to="/products"
        className="back-link"
      >
        ← Retour aux chaussures
      </Link>

      <div className="product-detail">

        <div className="product-detail-image">

          <img
            src={product.image}
            alt={product.name}
          />

        </div>

        <div className="product-detail-content">

          <span className="product-detail-brand">
            {product.brand}
          </span>

          <h1>
            {product.name}
          </h1>

          <p className="product-detail-price">
            {product.price} €
          </p>

          <p className="product-detail-description">
            {product.description}
          </p>

          <div className="size-section">

            <div className="size-header">

              <strong>
                Choisir une pointure
              </strong>

              {selectedSize && (
                <span>
                  Sélectionnée : {selectedSize}
                </span>
              )}

            </div>

            <div className="size-list">

              {product.sizes.map((size) => (

                <button
                  key={size}
                  type="button"
                  className={
                    selectedSize === size
                      ? 'size-button selected'
                      : 'size-button'
                  }
                  onClick={() => {
                    setSelectedSize(size)
                    setMessage('')
                  }}
                >
                  {size}
                </button>

              ))}

            </div>

          </div>

          <p
            className={
              product.stock === 0
                ? 'product-detail-stock out'
                : 'product-detail-stock'
            }
          >
            {product.stock === 0
              ? 'Rupture de stock'
              : `${product.stock} produits disponibles`}
          </p>

          {message && (
            <p className="product-message">
              {message}
            </p>
          )}

          <button
            type="button"
            className="add-cart-button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0
              ? 'Produit indisponible'
              : 'Ajouter au panier'}
          </button>

        </div>

      </div>

    </main>
  )
}

export default ProductPage