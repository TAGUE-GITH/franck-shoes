import {
  useEffect,
  useState
} from 'react'

import ProductCard from '../components/ProductCard'

import {
  getProducts
} from '../services/productService'

import './ProductsPage.css'


function ProductsPage() {
  const [products, setProducts] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [search, setSearch] =
    useState('')

  const [brand, setBrand] =
    useState('all')

  const [
    availability,
    setAvailability
  ] = useState('all')

  const [sort, setSort] =
    useState('default')


  useEffect(() => {
    loadProducts()
  }, [])


  async function loadProducts() {
    try {
      setLoading(true)

      setError('')

      const data =
        await getProducts()

      setProducts(data)
    } catch (error) {
      setError(
        error.message
      )
    } finally {
      setLoading(false)
    }
  }


  const brands = [
    ...new Set(
      products.map(
        (product) =>
          product.brand
      )
    )
  ]


  let filteredProducts =
    products.filter(
      (product) => {
        const searchValue =
          search
            .trim()
            .toLowerCase()


        const matchesSearch =
          product.name
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          product.brand
            .toLowerCase()
            .includes(
              searchValue
            )


        const matchesBrand =
          brand === 'all' ||
          product.brand === brand


        const matchesAvailability =
          availability === 'all' ||

          (
            availability ===
              'available' &&
            product.stock > 0
          ) ||

          (
            availability ===
              'out' &&
            product.stock === 0
          )


        return (
          matchesSearch &&
          matchesBrand &&
          matchesAvailability
        )
      }
    )


  if (sort === 'price-asc') {
    filteredProducts = [
      ...filteredProducts
    ].sort(
      (a, b) =>
        Number(a.price) -
        Number(b.price)
    )
  }


  if (sort === 'price-desc') {
    filteredProducts = [
      ...filteredProducts
    ].sort(
      (a, b) =>
        Number(b.price) -
        Number(a.price)
    )
  }


  if (sort === 'name') {
    filteredProducts = [
      ...filteredProducts
    ].sort(
      (a, b) =>
        a.name.localeCompare(
          b.name
        )
    )
  }


  function resetFilters() {
    setSearch('')
    setBrand('all')
    setAvailability('all')
    setSort('default')
  }


  return (
    <main className="products-page">

      <header className="products-page-header">

        <span className="products-eyebrow">
          Collection
        </span>

        <h1>
          Trouve ta prochaine paire.
        </h1>

        <p>
          Explore notre collection et
          trouve la chaussure qui
          correspond à ton style.
        </p>

      </header>


      <section className="catalog-tools">

        <div className="search-box">

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Rechercher une chaussure..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={() =>
                setSearch('')
              }
              aria-label="Effacer la recherche"
            >
              ×
            </button>
          )}

        </div>


        <div className="catalog-filters">

          <div className="filter-group">

            <label htmlFor="brand">
              Marque
            </label>

            <select
              id="brand"
              value={brand}
              onChange={(event) =>
                setBrand(
                  event.target.value
                )
              }
            >

              <option value="all">
                Toutes les marques
              </option>

              {brands.map(
                (brandName) => (
                  <option
                    key={brandName}
                    value={brandName}
                  >
                    {brandName}
                  </option>
                )
              )}

            </select>

          </div>


          <div className="filter-group">

            <label htmlFor="availability">
              Disponibilité
            </label>

            <select
              id="availability"
              value={availability}
              onChange={(event) =>
                setAvailability(
                  event.target.value
                )
              }
            >

              <option value="all">
                Tous
              </option>

              <option value="available">
                En stock
              </option>

              <option value="out">
                Rupture de stock
              </option>

            </select>

          </div>


          <div className="filter-group">

            <label htmlFor="sort">
              Trier par
            </label>

            <select
              id="sort"
              value={sort}
              onChange={(event) =>
                setSort(
                  event.target.value
                )
              }
            >

              <option value="default">
                Par défaut
              </option>

              <option value="price-asc">
                Prix croissant
              </option>

              <option value="price-desc">
                Prix décroissant
              </option>

              <option value="name">
                Nom A-Z
              </option>

            </select>

          </div>

        </div>

      </section>


      <section className="catalog-results">

        {loading ? (

          <div className="no-products">
            <h2>
              Chargement...
            </h2>
          </div>

        ) : error ? (

          <div className="no-products">

            <h2>
              Impossible de charger
              les produits
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={loadProducts}
            >
              Réessayer
            </button>

          </div>

        ) : (

          <>

            <div className="results-header">

              <p>
                <strong>
                  {
                    filteredProducts.length
                  }
                </strong>

                {' '}

                produit
                {
                  filteredProducts.length > 1
                    ? 's'
                    : ''
                }
              </p>


              {(
                search ||
                brand !== 'all' ||
                availability !== 'all' ||
                sort !== 'default'
              ) && (

                <button
                  type="button"
                  className="reset-filters"
                  onClick={
                    resetFilters
                  }
                >
                  Réinitialiser les filtres
                </button>

              )}

            </div>


            {filteredProducts.length > 0 ? (

              <div className="products-page-grid">

                {filteredProducts.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  )
                )}

              </div>

            ) : (

              <div className="no-products">

                <div className="no-products-icon">
                  👟
                </div>

                <h2>
                  Aucun produit trouvé
                </h2>

                <p>
                  Modifie ta recherche
                  ou tes filtres.
                </p>

                <button
                  type="button"
                  onClick={
                    resetFilters
                  }
                >
                  Voir toutes les chaussures
                </button>

              </div>

            )}

          </>

        )}

      </section>

    </main>
  )
}


export default ProductsPage