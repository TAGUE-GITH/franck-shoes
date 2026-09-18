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
  cancelOrder,
  getOrder
} from '../services/orderService'

import {
  getProduct
} from '../services/productService'

import {
  formatPrice
} from '../utils/formatPrice'

import './OrderDetailPage.css'


function OrderDetailPage({
  onAddToCart
}) {
  const {
    id
  } = useParams()

  const navigate =
    useNavigate()


  const [order, setOrder] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [actionLoading, setActionLoading] =
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
        await getOrder(id)

      setOrder(data)

    } catch (error) {

      setError(
        error.message
      )

    } finally {

      setLoading(false)
    }
  }


  async function handleCancel() {
    const confirmed =
      window.confirm(
        `Voulez-vous vraiment annuler la commande #${order.id} ?`
      )

    if (!confirmed) {
      return
    }

    try {
      setActionLoading(true)

      setError('')
      setMessage('')

      const updatedOrder =
        await cancelOrder(
          order.id
        )

      setOrder(
        updatedOrder
      )

      setMessage(
        'La commande a été annulée et le stock a été restauré.'
      )

    } catch (error) {

      setError(
        error.message
      )

    } finally {

      setActionLoading(false)
    }
  }


  async function handleReorder() {
    try {
      setActionLoading(true)

      setError('')
      setMessage('')

      let addedProducts = 0

      const unavailableProducts = []


      for (
        const item
        of order.items
      ) {

        if (!item.product) {
          unavailableProducts.push(
            item.product_name
          )

          continue
        }


        try {
          const product =
            await getProduct(
              item.product
            )


          const variant =
            product.sizes.find(
              (sizeItem) =>
                Number(
                  sizeItem.size
                ) ===
                Number(
                  item.size
                )
            )


          if (
            !variant ||
            variant.stock <= 0
          ) {
            unavailableProducts.push(
              `${item.product_name} (${item.size})`
            )

            continue
          }


          const quantityToAdd =
            Math.min(
              item.quantity,
              variant.stock
            )


          onAddToCart(
            product,
            item.size,
            quantityToAdd
          )


          addedProducts +=
            quantityToAdd


          if (
            quantityToAdd <
            item.quantity
          ) {
            unavailableProducts.push(
              `${item.product_name} : quantité limitée au stock disponible`
            )
          }

        } catch {
          unavailableProducts.push(
            item.product_name
          )
        }
      }


      if (addedProducts === 0) {
        setError(
          'Aucun produit de cette commande n’est actuellement disponible.'
        )

        return
      }


      if (
        unavailableProducts.length > 0
      ) {
        setMessage(
          `Les produits disponibles ont été ajoutés au panier. Certains articles ne sont plus disponibles dans la même quantité.`
        )

        return
      }


      navigate(
        '/cart'
      )

    } finally {

      setActionLoading(false)
    }
  }


  function formatDate(
    value
  ) {
    return new Date(
      value
    ).toLocaleString(
      'fr-FR',
      {
        dateStyle: 'long',
        timeStyle: 'short',
      }
    )
  }


  if (loading) {
    return (
      <main className="order-detail-state">
        Chargement de la commande...
      </main>
    )
  }


  if (
    error &&
    !order
  ) {
    return (
      <main className="order-detail-state">

        <h1>
          Commande introuvable
        </h1>

        <p>
          {error}
        </p>

        <Link to="/account/orders">
          Mes commandes
        </Link>

      </main>
    )
  }


  return (
    <main className="order-detail-page">

      <Link
        to="/account/orders"
        className="order-detail-back"
      >
        ← Mes commandes
      </Link>


      <header className="order-detail-header">

        <div>

          <span>
            Commande #{order.id}
          </span>

          <h1>
            Détail de la commande
          </h1>

          <p>
            Passée le
            {' '}
            {formatDate(
              order.created_at
            )}
          </p>

        </div>


        <span
          className={
            `order-detail-status ${order.status.toLowerCase()}`
          }
        >
          {order.status_label}
        </span>

      </header>


      {error && (
        <div className="order-detail-error">
          {error}
        </div>
      )}


      {message && (
        <div className="order-detail-message">
          {message}
        </div>
      )}


      <div className="order-detail-layout">

        <div className="order-detail-main">

          <section className="order-detail-card">

            <h2>
              Produits
            </h2>


            <div className="order-detail-products">

              {order.items.map(
                (item) => (

                  <article
                    className="order-detail-product"
                    key={item.id}
                  >

                    <div>

                      <span>
                        {item.brand}
                      </span>

                      <strong>
                        {item.product_name}
                      </strong>

                      <p>
                        Pointure :
                        {' '}
                        {item.size}
                      </p>

                      <p>
                        Quantité :
                        {' '}
                        {item.quantity}
                      </p>

                    </div>


                    <div>

                      <span>
                        Prix unitaire
                      </span>

                      <strong>
                        {formatPrice(
                          item.unit_price
                        )}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Total
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

            </div>

          </section>


          <section className="order-detail-card">

            <h2>
              Livraison
            </h2>


            <div className="order-address">

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

              <div className="order-notes">

                <span>
                  Instructions
                </span>

                <p>
                  {order.notes}
                </p>

              </div>

            )}

          </section>

        </div>


        <aside className="order-detail-summary">

          <h2>
            Résumé
          </h2>


          <div>

            <span>
              Sous-total
            </span>

            <strong>
              {formatPrice(
                order.subtotal
              )}
            </strong>

          </div>


          <div>

            <span>
              Livraison
            </span>

            <strong>
              {formatPrice(
                order.delivery_fee
              )}
            </strong>

          </div>


          <div className="order-summary-total">

            <span>
              Total
            </span>

            <strong>
              {formatPrice(
                order.total
              )}
            </strong>

          </div>


          <div className="order-payment-info">

            <span>
              Paiement
            </span>

            <strong>
              {order.payment_method_label}
            </strong>

            <small>
              {order.payment_status_label}
            </small>

          </div>


          <button
            type="button"
            className="reorder-button"
            onClick={
              handleReorder
            }
            disabled={
              actionLoading
            }
          >
            Commander à nouveau
          </button>


          {order.can_cancel && (

            <button
              type="button"
              className="cancel-order-button"
              onClick={
                handleCancel
              }
              disabled={
                actionLoading
              }
            >
              Annuler la commande
            </button>

          )}

        </aside>

      </div>

    </main>
  )
}


export default OrderDetailPage