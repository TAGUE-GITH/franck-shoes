import {
  useEffect,
  useState
} from 'react'

import {
  Link,
  useParams
} from 'react-router-dom'

import {
  getAdminOrder,
  updateAdminOrder
} from '../services/orderService'

import {
  formatPrice
} from '../utils/formatPrice'

import './AdminOrderDetailPage.css'


const STATUS_TRANSITIONS = {
  PENDING: [
    'CONFIRMED',
    'CANCELLED'
  ],

  CONFIRMED: [
    'PREPARING',
    'CANCELLED'
  ],

  PREPARING: [
    'SHIPPED'
  ],

  SHIPPED: [
    'DELIVERED'
  ],

  DELIVERED: [],

  CANCELLED: []
}


const STATUS_LABELS = {
  PENDING:
    'En attente',

  CONFIRMED:
    'Confirmée',

  PREPARING:
    'En préparation',

  SHIPPED:
    'Expédiée',

  DELIVERED:
    'Livrée',

  CANCELLED:
    'Annulée'
}


function AdminOrderDetailPage() {
  const {
    id
  } = useParams()


  const [order, setOrder] =
    useState(null)

  const [statusValue, setStatusValue] =
    useState('')

  const [
    paymentStatus,
    setPaymentStatus
  ] = useState('')

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState('')

  const [message, setMessage] =
    useState('')


  useEffect(() => {
    loadOrder()
  }, [id])


  async function loadOrder() {
    try {
      setLoading(true)

      setError('')

      const data =
        await getAdminOrder(
          id
        )

      setOrder(data)

      setStatusValue(
        data.status
      )

      setPaymentStatus(
        data.payment_status
      )

    } catch (error) {

      setError(
        error.message
      )

    } finally {

      setLoading(false)
    }
  }


  async function handleSave() {
    try {
      setSaving(true)

      setError('')
      setMessage('')


      const updates = {}


      if (
        statusValue !==
        order.status
      ) {
        updates.status =
          statusValue
      }


      if (
        paymentStatus !==
        order.payment_status
      ) {
        updates.payment_status =
          paymentStatus
      }


      if (
        Object.keys(
          updates
        ).length === 0
      ) {
        setMessage(
          'Aucune modification à enregistrer.'
        )

        return
      }


      const updatedOrder =
        await updateAdminOrder(
          order.id,
          updates
        )


      setOrder(
        updatedOrder
      )

      setStatusValue(
        updatedOrder.status
      )

      setPaymentStatus(
        updatedOrder.payment_status
      )

      setMessage(
        'Commande mise à jour avec succès.'
      )

    } catch (error) {

      setError(
        error.message
      )

      setStatusValue(
        order.status
      )

    } finally {

      setSaving(false)
    }
  }


  if (loading) {
    return (
      <main className="admin-order-detail-state">
        Chargement de la commande...
      </main>
    )
  }


  if (!order) {
    return (
      <main className="admin-order-detail-state">

        <h1>
          Commande introuvable
        </h1>

        <p>
          {error}
        </p>

        <Link to="/admin/orders">
          Retour aux commandes
        </Link>

      </main>
    )
  }


  const nextStatuses =
    STATUS_TRANSITIONS[
      order.status
    ] || []


  return (
    <main className="admin-order-detail-page">

      <Link
        to="/admin/orders"
        className="admin-order-back"
      >
        ← Retour aux commandes
      </Link>


      <header className="admin-order-detail-header">

        <div>

          <span>
            Commande #{order.id}
          </span>

          <h1>
            {order.first_name}
            {' '}
            {order.last_name}
          </h1>

          <p>
            {order.email}
            {' · '}
            {order.phone}
          </p>

        </div>


        <span
          className={
            `admin-order-status ${order.status.toLowerCase()}`
          }
        >
          {order.status_label}
        </span>

      </header>


      {error && (
        <div className="admin-order-detail-error">
          {error}
        </div>
      )}


      {message && (
        <div className="admin-order-detail-message">
          {message}
        </div>
      )}


      <div className="admin-order-detail-layout">

        <div className="admin-order-main">

          <section className="admin-order-card">

            <h2>
              Articles commandés
            </h2>


            {order.items.map(
              (item) => (

                <article
                  key={item.id}
                  className="admin-order-product"
                >

                  <div className="admin-order-product-image">

                    {item.image ? (

                      <img
                        src={item.image}
                        alt={
                          item.product_name
                        }
                      />

                    ) : (

                      <span>
                        👟
                      </span>

                    )}

                  </div>


                  <div className="admin-order-product-name">

                    <span>
                      {item.brand}
                    </span>

                    <strong>
                      {item.product_name}
                    </strong>

                    <small>
                      Pointure {item.size}
                    </small>

                  </div>


                  <div>

                    <span>
                      Quantité
                    </span>

                    <strong>
                      {item.quantity}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Prix
                    </span>

                    <strong>
                      {formatPrice(
                        item.line_total
                      )}
                    </strong>

                  </div>

                </article>

              )
            )}

          </section>


          <section className="admin-order-card">

            <h2>
              Livraison
            </h2>


            <div className="admin-delivery-grid">

              <div>

                <span>
                  Client
                </span>

                <strong>
                  {order.first_name}
                  {' '}
                  {order.last_name}
                </strong>

              </div>


              <div>

                <span>
                  Téléphone
                </span>

                <strong>
                  {order.phone}
                </strong>

              </div>


              <div>

                <span>
                  Ville
                </span>

                <strong>
                  {order.city}
                </strong>

              </div>


              <div>

                <span>
                  Adresse
                </span>

                <strong>
                  {order.address}
                </strong>

              </div>

            </div>


            {order.notes && (

              <div className="admin-order-notes">

                <span>
                  Instructions du client
                </span>

                <p>
                  {order.notes}
                </p>

              </div>

            )}

          </section>

        </div>


        <aside className="admin-order-sidebar">

          <section className="admin-order-card">

            <h2>
              Traitement
            </h2>


            <div className="admin-order-field">

              <label htmlFor="order-status">
                Statut de la commande
              </label>


              <select
                id="order-status"
                value={statusValue}
                onChange={(event) =>
                  setStatusValue(
                    event.target.value
                  )
                }
                disabled={
                  nextStatuses.length === 0
                }
              >

                <option
                  value={
                    order.status
                  }
                >
                  {
                    STATUS_LABELS[
                      order.status
                    ]
                  }
                </option>


                {nextStatuses.map(
                  (status) => (

                    <option
                      key={status}
                      value={status}
                    >
                      {
                        STATUS_LABELS[
                          status
                        ]
                      }
                    </option>

                  )
                )}

              </select>

            </div>


            <div className="admin-order-field">

              <label htmlFor="payment-status">
                Paiement
              </label>


              <select
                id="payment-status"
                value={
                  paymentStatus
                }
                onChange={(event) =>
                  setPaymentStatus(
                    event.target.value
                  )
                }
              >

                <option value="PENDING">
                  En attente
                </option>

                <option value="PAID">
                  Payé
                </option>

                <option value="FAILED">
                  Échec
                </option>

              </select>

            </div>


            <button
              type="button"
              className="admin-order-save"
              onClick={
                handleSave
              }
              disabled={
                saving
              }
            >
              {saving
                ? 'Enregistrement...'
                : 'Enregistrer'}
            </button>

          </section>


          <section className="admin-order-card">

            <h2>
              Résumé
            </h2>


            <div className="admin-order-summary-row">

              <span>
                Sous-total
              </span>

              <strong>
                {formatPrice(
                  order.subtotal
                )}
              </strong>

            </div>


            <div className="admin-order-summary-row">

              <span>
                Livraison
              </span>

              <strong>
                {formatPrice(
                  order.delivery_fee
                )}
              </strong>

            </div>


            <div className="admin-order-summary-row total">

              <span>
                Total
              </span>

              <strong>
                {formatPrice(
                  order.total
                )}
              </strong>

            </div>


            <div className="admin-payment-method">

              <span>
                Mode de paiement
              </span>

              <strong>
                {
                  order.payment_method_label
                }
              </strong>

            </div>

          </section>

        </aside>

      </div>

    </main>
  )
}


export default AdminOrderDetailPage