import {
  useEffect,
  useState
} from 'react'

import {
  Link
} from 'react-router-dom'

import {
  deleteProduct,
  getAdminProducts
} from '../services/productService'

import {
  formatPrice
} from '../utils/formatPrice'

import './AdminProductsPage.css'


function AdminProductsPage() {
  const [products, setProducts] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [search, setSearch] =
    useState('')


  useEffect(() => {
    loadProducts()
  }, [])


  async function loadProducts() {
    try {
      setLoading(true)

      setError('')

      const data =
        await getAdminProducts()

      setProducts(data)
    } catch (error) {
      setError(
        error.message
      )
    } finally {
      setLoading(false)
    }
  }


  async function handleDelete(
    product
  ) {
    const confirmed =
      window.confirm(
        `Supprimer "${product.name}" ?`
      )

    if (!confirmed) {
      return
    }

    try {
      await deleteProduct(
        product.id
      )

      setProducts(
        (currentProducts) =>
          currentProducts.filter(
            (item) =>
              item.id !== product.id
          )
      )
    } catch (error) {
      setError(
        error.message
      )
    }
  }


  const filteredProducts =
    products.filter(
      (product) => {
        const value =
          search
            .trim()
            .toLowerCase()

        if (!value) {
          return true
        }

        return (
          product.name
            .toLowerCase()
            .includes(value) ||

          product.brand
            .toLowerCase()
            .includes(value)
        )
      }
    )


  return (
    <main className="admin-products-page">

      <header className="admin-page-header">

        <div>

          <span>
            Catalogue
          </span>

          <h1>
            Produits
          </h1>

          <p>
            Gérez les chaussures,
            les prix, les images,
            les pointures et les stocks.
          </p>

        </div>


        <Link
          to="/admin/products/new"
          className="admin-add-product"
        >
          + Ajouter un produit
        </Link>

      </header>


      <div className="admin-products-toolbar">

        <input
          type="search"
          placeholder="Rechercher par nom ou marque..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

        <span>
          {filteredProducts.length}
          {' '}
          produit
          {filteredProducts.length > 1
            ? 's'
            : ''}
        </span>

      </div>


      {error && (
        <div className="admin-products-error">
          {error}
        </div>
      )}


      {loading ? (

        <div className="admin-products-state">
          Chargement des produits...
        </div>

      ) : filteredProducts.length === 0 ? (

        <div className="admin-products-empty">

          <h2>
            Aucun produit
          </h2>

          <p>
            Ajoutez votre première
            chaussure au catalogue.
          </p>

          <Link
            to="/admin/products/new"
          >
            Ajouter un produit
          </Link>

        </div>

      ) : (

        <div className="admin-products-table-wrapper">

          <table className="admin-products-table">

            <thead>

              <tr>
                <th>Produit</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>

            </thead>


            <tbody>

              {filteredProducts.map(
                (product) => (

                  <tr key={product.id}>

                    <td>

                      <div className="admin-product-info">

                        <div className="admin-product-thumbnail">

                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                            />
                          ) : (
                            <span>
                              👟
                            </span>
                          )}

                        </div>

                        <div>

                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            {product.brand}
                          </span>

                        </div>

                      </div>

                    </td>


                    <td>
                      {formatPrice(
                        product.price
                      )}
                    </td>


                    <td>
                      {product.stock}
                    </td>


                    <td>

                      <span
                        className={
                          product.is_active
                            ? 'admin-status active'
                            : 'admin-status inactive'
                        }
                      >
                        {product.is_active
                          ? 'Actif'
                          : 'Masqué'}
                      </span>

                    </td>


                    <td>

                      <div className="admin-product-actions">

                        <Link
                          to={
                            `/admin/products/${product.id}/edit`
                          }
                        >
                          Modifier
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              product
                            )
                          }
                        >
                          Supprimer
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </main>
  )
}


export default AdminProductsPage