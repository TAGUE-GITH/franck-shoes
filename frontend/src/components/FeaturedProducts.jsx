import {
  useEffect,
  useState
} from 'react'

import { Link } from 'react-router-dom'

import ProductCard from './ProductCard'

import {
  getProducts
} from '../services/productService'

import './FeaturedProducts.css'


function FeaturedProducts() {
  const [products, setProducts] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')


  useEffect(() => {
    loadProducts()
  }, [])


  async function loadProducts() {
    try {
      setLoading(true)

      setError('')

      const data =
        await getProducts()

      setProducts(
        data.slice(0, 3)
      )
    } catch (error) {
      setError(
        error.message
      )
    } finally {
      setLoading(false)
    }
  }


  return (
    <section className="featured-products">

      <div className="featured-header">

        <div>

          <span>
            Notre sélection
          </span>

          <h2>
            Les incontournables
          </h2>

        </div>


        <Link
          to="/products"
          className="view-all-link"
        >
          Voir toutes les chaussures

          <span>
            →
          </span>
        </Link>

      </div>


      {loading ? (

        <p>
          Chargement des produits...
        </p>

      ) : error ? (

        <p>
          {error}
        </p>

      ) : products.length === 0 ? (

        <p>
          Aucun produit disponible pour le moment.
        </p>

      ) : (

        <div className="featured-grid">

          {products.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )
          )}

        </div>

      )}

    </section>
  )
}


export default FeaturedProducts