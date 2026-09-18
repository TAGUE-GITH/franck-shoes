import {
  useEffect,
  useState
} from 'react'

import {
  Link,
  useNavigate,
  useParams
} from 'react-router-dom'

import {
  createProduct,
  getAdminProduct,
  updateProduct
} from '../services/productService'

import './AdminProductFormPage.css'


function AdminProductFormPage() {
  const {
    id
  } = useParams()

  const navigate =
    useNavigate()

  const isEditing =
    Boolean(id)


  const [formData, setFormData] =
    useState({
      name: '',
      brand: '',
      price: '',
      description: '',
      isActive: true
    })


  const [sizes, setSizes] =
    useState([
      {
        size: '',
        stock: ''
      }
    ])


  const [image, setImage] =
    useState(null)

  const [imagePreview, setImagePreview] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [pageLoading, setPageLoading] =
    useState(isEditing)

  const [error, setError] =
    useState('')


  useEffect(() => {
    if (isEditing) {
      loadProduct()
    }
  }, [id])


  async function loadProduct() {
    try {
      setPageLoading(true)

      const product =
        await getAdminProduct(id)

      setFormData({
        name:
          product.name || '',

        brand:
          product.brand || '',

        price:
          product.price || '',

        description:
          product.description || '',

        isActive:
          product.is_active
      })


      if (
        product.sizes &&
        product.sizes.length > 0
      ) {
        setSizes(
          product.sizes.map(
            (item) => ({
              size:
                String(item.size),

              stock:
                String(item.stock)
            })
          )
        )
      }


      setImagePreview(
        product.image_url || ''
      )
    } catch (error) {
      setError(
        error.message
      )
    } finally {
      setPageLoading(false)
    }
  }


  function handleChange(
    event
  ) {
    const {
      name,
      value,
      type,
      checked
    } = event.target


    setFormData(
      (currentData) => ({
        ...currentData,

        [name]:
          type === 'checkbox'
            ? checked
            : value
      })
    )
  }


  function handleImageChange(
    event
  ) {
    const selectedFile =
      event.target.files[0]

    if (!selectedFile) {
      return
    }


    if (
      !selectedFile.type.startsWith(
        'image/'
      )
    ) {
      setError(
        'Veuillez sélectionner une image.'
      )

      return
    }


    setImage(
      selectedFile
    )

    setImagePreview(
      URL.createObjectURL(
        selectedFile
      )
    )

    setError('')
  }


  function handleSizeChange(
    index,
    field,
    value
  ) {
    setSizes(
      (currentSizes) =>
        currentSizes.map(
          (item, itemIndex) =>
            itemIndex === index
              ? {
                  ...item,
                  [field]: value
                }
              : item
        )
    )
  }


  function addSize() {
    setSizes(
      (currentSizes) => [
        ...currentSizes,

        {
          size: '',
          stock: ''
        }
      ]
    )
  }


  function removeSize(
    index
  ) {
    setSizes(
      (currentSizes) =>
        currentSizes.filter(
          (_, itemIndex) =>
            itemIndex !== index
        )
    )
  }


  async function handleSubmit(
    event
  ) {
    event.preventDefault()

    setError('')


    if (
      !formData.name ||
      !formData.brand ||
      !formData.price
    ) {
      setError(
        'Le nom, la marque et le prix sont obligatoires.'
      )

      return
    }


    const cleanedSizes =
      sizes
        .filter(
          (item) =>
            item.size !== '' &&
            item.stock !== ''
        )
        .map(
          (item) => ({
            size:
              Number(item.size),

            stock:
              Number(item.stock)
          })
        )


    if (
      cleanedSizes.length === 0
    ) {
      setError(
        'Ajoutez au moins une pointure avec son stock.'
      )

      return
    }


    const form =
      new FormData()


    form.append(
      'name',
      formData.name
    )

    form.append(
      'brand',
      formData.brand
    )

    form.append(
      'price',
      formData.price
    )

    form.append(
      'description',
      formData.description
    )

    form.append(
      'is_active',
      formData.isActive
        ? 'true'
        : 'false'
    )

    form.append(
      'sizes',
      JSON.stringify(
        cleanedSizes
      )
    )


    if (image) {
      form.append(
        'image',
        image
      )
    }


    try {
      setLoading(true)


      if (isEditing) {
        await updateProduct(
          id,
          form
        )
      } else {
        await createProduct(
          form
        )
      }


      navigate(
        '/admin/products'
      )
    } catch (error) {
      setError(
        error.message
      )
    } finally {
      setLoading(false)
    }
  }


  if (pageLoading) {
    return (
      <main className="admin-product-form-page">

        <div className="admin-form-loading">
          Chargement du produit...
        </div>

      </main>
    )
  }


  return (
    <main className="admin-product-form-page">

      <div className="admin-form-top">

        <div>

          <Link
            to="/admin/products"
            className="admin-form-back"
          >
            ← Retour aux produits
          </Link>

          <span>
            Catalogue
          </span>

          <h1>
            {isEditing
              ? 'Modifier le produit'
              : 'Ajouter un produit'}
          </h1>

        </div>

      </div>


      {error && (
        <div className="admin-form-error">
          {error}
        </div>
      )}


      <form
        className="admin-product-form"
        onSubmit={handleSubmit}
      >

        <div className="admin-form-main">

          <section className="admin-form-card">

            <h2>
              Informations générales
            </h2>


            <div className="admin-form-grid">

              <div className="admin-field">

                <label htmlFor="name">
                  Nom du produit *
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nike Air Max"
                  value={formData.name}
                  onChange={handleChange}
                />

              </div>


              <div className="admin-field">

                <label htmlFor="brand">
                  Marque *
                </label>

                <input
                  id="brand"
                  name="brand"
                  type="text"
                  placeholder="Nike"
                  value={formData.brand}
                  onChange={handleChange}
                />

              </div>

            </div>


            <div className="admin-field">

              <label htmlFor="price">
                Prix en FCFA *
              </label>

              <div className="admin-price-input">

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="65000"
                  value={formData.price}
                  onChange={handleChange}
                />

                <span>
                  FCFA
                </span>

              </div>

            </div>


            <div className="admin-field">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="6"
                placeholder="Description de la chaussure..."
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </section>


          <section className="admin-form-card">

            <div className="admin-card-heading">

              <div>

                <h2>
                  Pointures et stocks
                </h2>

                <p>
                  Définissez le stock
                  disponible pour chaque
                  pointure.
                </p>

              </div>


              <button
                type="button"
                onClick={addSize}
                className="add-size-button"
              >
                + Pointure
              </button>

            </div>


            <div className="admin-sizes-list">

              {sizes.map(
                (item, index) => (

                  <div
                    className="admin-size-row"
                    key={index}
                  >

                    <div className="admin-field">

                      <label>
                        Pointure
                      </label>

                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        placeholder="42"
                        value={item.size}
                        onChange={(event) =>
                          handleSizeChange(
                            index,
                            'size',
                            event.target.value
                          )
                        }
                      />

                    </div>


                    <div className="admin-field">

                      <label>
                        Stock
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="5"
                        value={item.stock}
                        onChange={(event) =>
                          handleSizeChange(
                            index,
                            'stock',
                            event.target.value
                          )
                        }
                      />

                    </div>


                    <button
                      type="button"
                      className="remove-size-button"
                      onClick={() =>
                        removeSize(index)
                      }
                      disabled={
                        sizes.length === 1
                      }
                    >
                      Supprimer
                    </button>

                  </div>

                )
              )}

            </div>

          </section>

        </div>


        <aside className="admin-form-sidebar">

          <section className="admin-form-card">

            <h2>
              Image
            </h2>


            <label
              htmlFor="product-image"
              className="admin-image-upload"
            >

              {imagePreview ? (

                <img
                  src={imagePreview}
                  alt="Aperçu du produit"
                />

              ) : (

                <div>

                  <strong>
                    Choisir une image
                  </strong>

                  <span>
                    Depuis votre appareil
                  </span>

                </div>

              )}

            </label>


            <input
              id="product-image"
              type="file"
              accept="image/*"
              className="admin-image-input"
              onChange={
                handleImageChange
              }
            />


            <p className="admin-image-help">
              JPG, PNG ou WebP recommandé.
            </p>

          </section>


          <section className="admin-form-card">

            <h2>
              Publication
            </h2>


            <label className="admin-active-switch">

              <input
                type="checkbox"
                name="isActive"
                checked={
                  formData.isActive
                }
                onChange={
                  handleChange
                }
              />

              <div>

                <strong>
                  Produit actif
                </strong>

                <span>
                  Visible dans la boutique
                </span>

              </div>

            </label>

          </section>


          <button
            type="submit"
            className="admin-save-product"
            disabled={loading}
          >
            {loading
              ? 'Enregistrement...'
              : isEditing
                ? 'Enregistrer les modifications'
                : 'Ajouter le produit'}
          </button>

        </aside>

      </form>

    </main>
  )
}


export default AdminProductFormPage