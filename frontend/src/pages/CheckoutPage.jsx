import {
  useEffect,
  useState
} from 'react'

import {
  Link,
  useNavigate
} from 'react-router-dom'

import {
  useAuth
} from '../context/AuthContext'

import {
  createOrder,
  getDeliveryFees
} from '../services/orderService'

import {
  formatPrice
} from '../utils/formatPrice'

import './CheckoutPage.css'


function CheckoutPage({
  cart,
  onClearCart
}) {
  const navigate =
    useNavigate()

  const {
    user
  } = useAuth()


  const [deliveryFees, setDeliveryFees] =
    useState({})


  const [formData, setFormData] =
    useState({
      firstName:
        user?.first_name || '',

      lastName:
        user?.last_name || '',

      email:
        user?.email || '',

      phone: '',

      city: '',

      address: '',

      notes: ''
    })


  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')


  useEffect(() => {
    loadDeliveryFees()
  }, [])


  async function loadDeliveryFees() {
    try {

      const data =
        await getDeliveryFees()

      setDeliveryFees(data)

    } catch (error) {

      setError(
        error.message
      )
    }
  }


  function handleChange(
    event
  ) {
    const {
      name,
      value
    } = event.target


    setFormData(
      (currentData) => ({
        ...currentData,

        [name]: value
      })
    )


    setError('')
  }


  const subtotal =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.price) *
        item.quantity,

      0
    )


  const deliveryFee =
    formData.city
      ? (
          deliveryFees[
            formData.city
          ] || 0
        )
      : 0


  const total =
    subtotal +
    deliveryFee


  async function handleSubmit(
    event
  ) {
    event.preventDefault()

    setError('')


    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.city ||
      !formData.address
    ) {
      setError(
        'Veuillez remplir tous les champs obligatoires.'
      )

      return
    }


    if (cart.length === 0) {
      setError(
        'Votre panier est vide.'
      )

      return
    }


    const orderData = {
      first_name:
        formData.firstName,

      last_name:
        formData.lastName,

      email:
        formData.email,

      phone:
        formData.phone,

      city:
        formData.city,

      address:
        formData.address,

      notes:
        formData.notes,

      payment_method:
        'CASH_ON_DELIVERY',

      items:
        cart.map(
          (item) => ({
            product_id:
              item.id,

            size:
              item.size,

            quantity:
              item.quantity
          })
        )
    }


    try {
      setLoading(true)


      const order =
        await createOrder(
          orderData
        )


      onClearCart()


      navigate(
        `/order-success/${order.id}`,
        {
          state: {
            order
          }
        }
      )

    } catch (error) {

      setError(
        error.message
      )

    } finally {

      setLoading(false)
    }
  }


  if (cart.length === 0) {
    return (
      <main className="checkout-empty">

        <h1>
          Votre panier est vide
        </h1>

        <p>
          Ajoutez une paire avant
          de passer commande.
        </p>

        <Link to="/products">
          Voir les chaussures
        </Link>

      </main>
    )
  }


  return (
    <main className="checkout-page">

      <header className="checkout-header">

        <span>
          Finalisation
        </span>

        <h1>
          Votre commande
        </h1>

        <p>
          Vérifiez vos informations
          avant de confirmer la commande.
        </p>

      </header>


      <form
        className="checkout-layout"
        onSubmit={handleSubmit}
      >

        <div className="checkout-form-column">

          <section className="checkout-card">

            <h2>
              Informations personnelles
            </h2>


            <div className="checkout-grid">

              <div className="checkout-field">

                <label htmlFor="firstName">
                  Prénom *
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={
                    formData.firstName
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <div className="checkout-field">

                <label htmlFor="lastName">
                  Nom *
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={
                    formData.lastName
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

            </div>


            <div className="checkout-field">

              <label htmlFor="email">
                Email *
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
              />

            </div>


            <div className="checkout-field">

              <label htmlFor="phone">
                Téléphone *
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="6 99 00 00 00"
                value={
                  formData.phone
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </section>


          <section className="checkout-card">

            <h2>
              Livraison
            </h2>


            <div className="checkout-field">

              <label htmlFor="city">
                Ville *
              </label>

              <select
                id="city"
                name="city"
                value={
                  formData.city
                }
                onChange={
                  handleChange
                }
              >

                <option value="">
                  Choisir une ville
                </option>

                {Object.entries(
                  deliveryFees
                ).map(
                  ([
                    city,
                    fee
                  ]) => (

                    <option
                      key={city}
                      value={city}
                    >
                      {city}
                      {' — '}
                      {formatPrice(fee)}
                    </option>

                  )
                )}

              </select>

            </div>


            <div className="checkout-field">

              <label htmlFor="address">
                Adresse / quartier *
              </label>

              <input
                id="address"
                name="address"
                type="text"
                placeholder="Ex : Bonamoussadi, près de..."
                value={
                  formData.address
                }
                onChange={
                  handleChange
                }
              />

            </div>


            <div className="checkout-field">

              <label htmlFor="notes">
                Informations supplémentaires
              </label>

              <textarea
                id="notes"
                name="notes"
                rows="4"
                placeholder="Repère, instructions de livraison..."
                value={
                  formData.notes
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </section>


          <section className="checkout-card">

            <h2>
              Paiement
            </h2>

            <label className="payment-option">

              <input
                type="radio"
                checked
                readOnly
              />

              <div>

                <strong>
                  Paiement à la livraison
                </strong>

                <span>
                  Vous payez lors de
                  la réception de votre commande.
                </span>

              </div>

            </label>

          </section>

        </div>


        <aside className="checkout-summary">

          <h2>
            Résumé
          </h2>


          <div className="checkout-products">

            {cart.map(
              (item) => (

                <div
                  className="checkout-product"
                  key={
                    `${item.id}-${item.size}`
                  }
                >

                  {item.image ? (

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                  ) : (

                    <div className="checkout-product-placeholder">
                      👟
                    </div>

                  )}


                  <div>

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      Pointure {item.size}
                    </span>

                    <span>
                      Quantité {item.quantity}
                    </span>

                  </div>


                  <strong>
                    {formatPrice(
                      Number(item.price) *
                      item.quantity
                    )}
                  </strong>

                </div>

              )
            )}

          </div>


          <div className="checkout-total-row">

            <span>
              Sous-total
            </span>

            <strong>
              {formatPrice(
                subtotal
              )}
            </strong>

          </div>


          <div className="checkout-total-row">

            <span>
              Livraison
            </span>

            <strong>
              {formData.city
                ? formatPrice(
                    deliveryFee
                  )
                : '—'}
            </strong>

          </div>


          <div className="checkout-total-row final">

            <span>
              Total
            </span>

            <strong>
              {formatPrice(
                total
              )}
            </strong>

          </div>


          {error && (
            <p className="checkout-error">
              {error}
            </p>
          )}


          <button
            type="submit"
            className="checkout-confirm-button"
            disabled={loading}
          >
            {loading
              ? 'Validation...'
              : 'Confirmer la commande'}
          </button>


          <p className="checkout-security">
            Votre commande sera enregistrée
            de manière sécurisée.
          </p>

        </aside>

      </form>

    </main>
  )
}


export default CheckoutPage