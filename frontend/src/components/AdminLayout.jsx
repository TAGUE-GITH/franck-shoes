import {
  NavLink,
  Outlet
} from 'react-router-dom'

import {
  useAuth
} from '../context/AuthContext'

import './AdminLayout.css'


function AdminLayout() {
  const {
    user
  } = useAuth()


  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">

        <div className="admin-sidebar-brand">

          <span>
            FRANCK
          </span>

          <strong>
            SHOES
          </strong>

          <small>
            Administration
          </small>

        </div>


        <nav className="admin-sidebar-nav">

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive
                ? 'admin-nav-link active'
                : 'admin-nav-link'
            }
          >
            Tableau de bord
          </NavLink>


          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive
                ? 'admin-nav-link active'
                : 'admin-nav-link'
            }
          >
            Produits
          </NavLink>


          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive
                ? 'admin-nav-link active'
                : 'admin-nav-link'
            }
          >
            Commandes
          </NavLink>


          <span className="admin-nav-disabled">

            Clients

            <small>
              Bientôt
            </small>

          </span>

        </nav>


        <div className="admin-sidebar-user">

          <span>
            Connecté en tant que
          </span>

          <strong>
            {user?.first_name || 'Admin'}
          </strong>

          <small>
            {user?.email}
          </small>

        </div>

      </aside>


      <div className="admin-layout-content">

        <Outlet />

      </div>

    </div>
  )
}


export default AdminLayout