import {
  Link,
  useLocation,
  useParams
} from 'react-router-dom'

import {
  formatPrice
} from '../utils/formatPrice'

import './OrderSuccessPage.css'


function OrderSuccessPage() {
  const {
    id
  } = useParams()

  const location =
    useLocation()

  const order =
    location.state?.order


  return (
    <main className="order-success-page">

      <div className="order-success-card">

        <div className="order-success-icon">
          ✓
        </div>


        <span>
          Commande enregistrée
        </span>


        <h1>
          Merci pour votre commande !
        </h1>


        <p>
          Votre commande
          {' '}

          <strong>
            #{id}
          </strong>

          {' '}

          a bien été enregistrée.
        </p>


        {order && (

          <div className="order-success-summary">

            <div>

              <span>
                Total
              </span>

              <strong>
                {formatPrice(
                  order.total
                )}
              </strong>

            </div>


            <div>

              <span>
                Livraison
              </span>

              <strong>
                {order.city}
              </strong>

            </div>


            <div>

              <span>
                Statut
              </span>

              <strong>
                {order.status_label}
              </strong>

            </div>

          </div>

        )}


        <div className="order-success-actions">

          <Link
            to={
              `/account/orders/${id}`
            }
          >
            Voir ma commande
          </Link>


          <Link
            to="/account/orders"
            className="secondary"
          >
            Mes commandes
          </Link>


          <Link
            to="/products"
            className="secondary"
          >
            Continuer mes achats
          </Link>

        </div>

      </div>

    </main>
  )
}


export default OrderSuccessPage