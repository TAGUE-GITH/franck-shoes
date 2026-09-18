import {
  useEffect,
  useState
} from 'react'

import {
  Link,
  useParams
} from 'react-router-dom'

import {
  getProduct
} from '../services/productService'

import {
  formatPrice
} from '../utils/formatPrice'

import './ProductPage.css'


function ProductPage({
  onAddToCart
}) {
  const {
    id
  } = useParams()


  const [product, setProduct] =
    useState(null)

  const [
    selectedSize,
    setSelectedSize
  ] = useState(null)

  const [message, setMessage] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')


  useEffect(() => {
    loadProduct()
  }, [id])


  async function loadProduct() {
    try {
      setLoading(true)

      setError('')

      const data =
        await getProduct(id)

      setProduct(data)
    } catch (error) {
      setError(
        error.message
      )
    } finally {
      setLoading(false)
    }
  }


  function handleAddToCart() {
    if (selectedSize === null) {
      setMessage(
        'Choisissez une pointure.'
      )

      return
    }


    const variant =
      product.sizes.find(
        (item) =>
          Number(item.size) ===
          Number(selectedSize)
      )


    if (
      !variant ||
      variant.stock <= 0
    ) {
      setMessage(
        'Cette pointure est indisponible.'
      )

      return
    }


    onAddToCart(
      product,
      selectedSize
    )


    setMessage(
      'Produit ajouté au panier.'
    )
  }


  if (loading) {
    return (
      <main className="product-not-found">
        <h1>
          Chargement...
        </h1>
      </main>
    )
  }


  if (
    error ||
    !product
  ) {
    return (
      <main className="product-not-found">

        <h1>
          Produit introuvable
        </h1>

        {error && (
          <p>
            {error}
          </p>
        )}

        <Link to="/products">
          Retour aux chaussures
        </Link>

      </main>
    )
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

          {product.image ? (

            <img
              src={product.image}
              alt={product.name}
            />

          ) : (

            <div className="product-detail-placeholder">
              👟
            </div>

          )}

        </div>


        <div className="product-detail-content">

          <span className="product-detail-brand">
            {product.brand}
          </span>


          <h1>
            {product.name}
          </h1>


          <p className="product-detail-price">
            {formatPrice(
              product.price
            )}
          </p>


          <p className="product-detail-description">
            {product.description ||
              'Aucune description disponible.'}
          </p>


          <div className="size-section">

            <div className="size-header">

              <strong>
                Choisir une pointure
              </strong>

              {selectedSize !== null && (
                <span>
                  Sélectionnée :
                  {' '}
                  {selectedSize}
                </span>
              )}

            </div>


            <div className="size-list">

              {product.sizes.map(
                (variant) => (

                  <button
                    key={variant.id}
                    type="button"
                    disabled={
                      variant.stock === 0
                    }
                    className={
                      [
                        'size-button',

                        Number(
                          selectedSize
                        ) ===
                        Number(
                          variant.size
                        )
                          ? 'selected'
                          : '',

                        variant.stock === 0
                          ? 'unavailable'
                          : ''
                      ]
                        .filter(Boolean)
                        .join(' ')
                    }
                    onClick={() => {
                      setSelectedSize(
                        variant.size
                      )

                      setMessage('')
                    }}
                  >
                    {variant.size}
                  </button>

                )
              )}

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
              : `${product.stock} articles disponibles`}
          </p>


          {message && (
            <p className="product-message">
              {message}
            </p>
          )}


          <button
            type="button"
            className="add-cart-button"
            onClick={
              handleAddToCart
            }
            disabled={
              product.stock === 0
            }
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