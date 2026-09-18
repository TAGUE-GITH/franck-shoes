import {
  useEffect,
  useState
} from 'react'

import {
  Link
} from 'react-router-dom'

import {
  getAdminOrders
} from '../services/orderService'

import {
  formatPrice
} from '../utils/formatPrice'

import './AdminOrdersPage.css'


function AdminOrdersPage() {
  const [orders, setOrders] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [search, setSearch] =
    useState('')

  const [statusFilter, setStatusFilter] =
    useState('ALL')


  useEffect(() => {
    loadOrders()
  }, [])


  async function loadOrders() {
    try {
      setLoading(true)

      setError('')

      const data =
        await getAdminOrders()

      setOrders(
        Array.isArray(data)
          ? data
          : []
      )

    } catch (error) {

      setError(
        error.message
      )

    } finally {

      setLoading(false)
    }
  }


  function formatDate(
    value
  ) {
    return new Date(
      value
    ).toLocaleDateString(
      'fr-FR',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    )
  }


  const filteredOrders =
    orders.filter(
      (order) => {
        const value =
          search
            .trim()
            .toLowerCase()

        const matchesSearch =
          !value ||

          String(order.id)
            .includes(value) ||

          `${order.first_name} ${order.last_name}`
            .toLowerCase()
            .includes(value) ||

          order.email
            .toLowerCase()
            .includes(value) ||

          order.phone
            .toLowerCase()
            .includes(value)


        const matchesStatus =
          statusFilter === 'ALL' ||
          order.status === statusFilter


        return (
          matchesSearch &&
          matchesStatus
        )
      }
    )


  return (
    <main className="admin-orders-page">

      <header className="admin-orders-header">

        <div>

          <span>
            Gestion
          </span>

          <h1>
            Commandes
          </h1>

          <p>
            Consultez et traitez les
            commandes passées par vos clients.
          </p>

        </div>

      </header>


      <div className="admin-orders-toolbar">

        <input
          type="search"
          placeholder="Commande, client, email, téléphone..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />


        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >

          <option value="ALL">
            Tous les statuts
          </option>

          <option value="PENDING">
            En attente
          </option>

          <option value="CONFIRMED">
            Confirmées
          </option>

          <option value="PREPARING">
            En préparation
          </option>

          <option value="SHIPPED">
            Expédiées
          </option>

          <option value="DELIVERED">
            Livrées
          </option>

          <option value="CANCELLED">
            Annulées
          </option>

        </select>

      </div>


      {error && (
        <div className="admin-orders-error">
          {error}
        </div>
      )}


      {loading ? (

        <div className="admin-orders-state">
          Chargement des commandes...
        </div>

      ) : filteredOrders.length === 0 ? (

        <div className="admin-orders-state">
          Aucune commande trouvée.
        </div>

      ) : (

        <div className="admin-orders-table-wrapper">

          <table className="admin-orders-table">

            <thead>

              <tr>
                <th>Commande</th>
                <th>Client</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Paiement</th>
                <th></th>
              </tr>

            </thead>


            <tbody>

              {filteredOrders.map(
                (order) => (

                  <tr key={order.id}>

                    <td>
                      <strong>
                        #{order.id}
                      </strong>
                    </td>


                    <td>

                      <div className="admin-order-customer">

                        <strong>
                          {order.first_name}
                          {' '}
                          {order.last_name}
                        </strong>

                        <span>
                          {order.phone}
                        </span>

                      </div>

                    </td>


                    <td>
                      {formatDate(
                        order.created_at
                      )}
                    </td>


                    <td>
                      <strong>
                        {formatPrice(
                          order.total
                        )}
                      </strong>
                    </td>


                    <td>

                      <span
                        className={
                          `admin-order-status ${order.status.toLowerCase()}`
                        }
                      >
                        {order.status_label}
                      </span>

                    </td>


                    <td>
                      {order.payment_status_label}
                    </td>


                    <td>

                      <Link
                        className="admin-order-view"
                        to={
                          `/admin/orders/${order.id}`
                        }
                      >
                        Voir
                      </Link>

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


export default AdminOrdersPage