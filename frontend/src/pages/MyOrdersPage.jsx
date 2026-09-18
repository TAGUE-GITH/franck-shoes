import {
  useEffect,
  useState
} from 'react'

import {
  Link
} from 'react-router-dom'

import {
  cancelOrder,
  getMyOrders
} from '../services/orderService'

import {
  formatPrice
} from '../utils/formatPrice'

import './MyOrdersPage.css'


function MyOrdersPage() {
  const [orders, setOrders] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [
    cancellingId,
    setCancellingId
  ] = useState(null)


  useEffect(() => {
    loadOrders()
  }, [])


  async function loadOrders() {
    try {
      setLoading(true)

      setError('')

      const data =
        await getMyOrders()


      if (Array.isArray(data)) {
        setOrders(data)
      } else {
        console.error(
          'Format inattendu reçu pour les commandes :',
          data
        )

        setOrders([])

        setError(
          'Le serveur a renvoyé un format de commandes invalide.'
        )
      }

    } catch (error) {

      console.error(
        'Erreur chargement commandes :',
        error
      )

      setError(
        error.message ||
        'Impossible de charger vos commandes.'
      )

    } finally {

      setLoading(false)
    }
  }


  async function handleCancel(
    order
  ) {
    const confirmed =
      window.confirm(
        `Voulez-vous vraiment annuler la commande #${order.id} ?`
      )


    if (!confirmed) {
      return
    }


    try {
      setCancellingId(
        order.id
      )

      setError('')


      const updatedOrder =
        await cancelOrder(
          order.id
        )


      setOrders(
        (currentOrders) =>
          currentOrders.map(
            (item) =>
              item.id === order.id
                ? updatedOrder
                : item
          )
      )

    } catch (error) {

      console.error(
        'Erreur annulation :',
        error
      )

      setError(
        error.message ||
        'Impossible d’annuler cette commande.'
      )

    } finally {

      setCancellingId(null)
    }
  }


  function formatDate(
    value
  ) {
    if (!value) {
      return 'Date inconnue'
    }


    const date =
      new Date(value)


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return 'Date inconnue'
    }


    return date.toLocaleDateString(
      'fr-FR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    )
  }


  function getOrderStatus(
    order
  ) {
    return (
      order?.status ||
      'PENDING'
    )
  }


  function getStatusLabel(
    order
  ) {
    if (
      order?.status_label
    ) {
      return order.status_label
    }


    const status =
      getOrderStatus(order)


    const labels = {
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


    return (
      labels[status] ||
      status
    )
  }


  function getItemsCount(
    order
  ) {
    if (
      !Array.isArray(
        order?.items
      )
    ) {
      return 0
    }


    return order.items.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item?.quantity || 0
        ),

      0
    )
  }


  return (
    <main className="my-orders-page">

      <header className="my-orders-header">

        <span>
          Mon compte
        </span>

        <h1>
          Mes commandes
        </h1>

        <p>
          Retrouvez vos commandes,
          consultez leur statut et
          suivez leur évolution.
        </p>

      </header>


      {error && (
        <div className="orders-error">

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={
              loadOrders
            }
          >
            Réessayer
          </button>

        </div>
      )}


      {loading ? (

        <div className="orders-state">

          <div className="orders-loader">
          </div>

          <p>
            Chargement de vos commandes...
          </p>

        </div>

      ) : orders.length === 0 ? (

        <div className="orders-empty">

          <div className="orders-empty-icon">
            🛍
          </div>

          <h2>
            Aucune commande
          </h2>

          <p>
            Vous n'avez pas encore
            passé de commande.
          </p>

          <Link to="/products">
            Découvrir les chaussures
          </Link>

        </div>

      ) : (

        <div className="orders-list">

          {orders.map(
            (order) => {

              const status =
                getOrderStatus(
                  order
                )

              const statusClass =
                status
                  .toLowerCase()


              const canCancel =
                order?.can_cancel === true ||
                status === 'PENDING' ||
                status === 'CONFIRMED'


              return (
                <article
                  className="order-card"
                  key={
                    order.id
                  }
                >

                  <div className="order-card-top">

                    <div>

                      <span className="order-number">
                        Commande #{order.id}
                      </span>

                      <p>
                        {formatDate(
                          order.created_at
                        )}
                      </p>

                    </div>


                    <span
                      className={
                        `order-status ${statusClass}`
                      }
                    >
                      {getStatusLabel(
                        order
                      )}
                    </span>

                  </div>


                  <div className="order-card-content">

                    <div>

                      <span>
                        Articles
                      </span>

                      <strong>
                        {getItemsCount(
                          order
                        )}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Livraison
                      </span>

                      <strong>
                        {order.city ||
                          'Non renseignée'}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Total
                      </span>

                      <strong>
                        {formatPrice(
                          order.total || 0
                        )}
                      </strong>

                    </div>

                  </div>


                  <div className="order-card-products">

                    {Array.isArray(
                      order.items
                    ) &&
                    order.items
                      .slice(
                        0,
                        3
                      )
                      .map(
                        (item) => (

                          <div
                            key={
                              item.id
                            }
                            className="order-product-preview"
                          >

                            <div>

                              <strong>
                                {item.product_name ||
                                  'Produit'}
                              </strong>

                              <span>
                                Pointure
                                {' '}
                                {item.size}
                                {' · '}
                                Qté
                                {' '}
                                {item.quantity}
                              </span>

                            </div>


                            <span>
                              {formatPrice(
                                item.line_total || 0
                              )}
                            </span>

                          </div>

                        )
                      )}

                  </div>


                  <div className="order-card-actions">

                    <Link
                      to={
                        `/account/orders/${order.id}`
                      }
                    >
                      Voir la commande
                    </Link>


                    {canCancel &&
                      status !== 'CANCELLED' && (

                        <button
                          type="button"
                          onClick={() =>
                            handleCancel(
                              order
                            )
                          }
                          disabled={
                            cancellingId ===
                            order.id
                          }
                        >
                          {cancellingId ===
                          order.id
                            ? 'Annulation...'
                            : 'Annuler'}
                        </button>

                      )}

                  </div>

                </article>
              )
            }
          )}

        </div>

      )}

    </main>
  )
}


export default MyOrdersPage