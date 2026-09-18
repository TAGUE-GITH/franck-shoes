import {
  useState
} from 'react'

import {
  Link,
  useNavigate
} from 'react-router-dom'

import {
  useAuth
} from '../context/AuthContext'

import './Navbar.css'


function Navbar({
  cartCount
}) {
  const [
    menuOpen,
    setMenuOpen
  ] = useState(false)


  const navigate =
    useNavigate()


  const {
    user,
    isAdmin,
    logout
  } = useAuth()


  function closeMenu() {
    setMenuOpen(false)
  }


  function handleLogout() {
    logout()

    closeMenu()

    navigate('/')
  }


  return (
    <header className="navbar-wrapper">

      <nav className="navbar">

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >

          <span>
            FRANCK
          </span>

          <strong>
            SHOES
          </strong>

        </Link>


        <div
          className={
            menuOpen
              ? 'nav-links open'
              : 'nav-links'
          }
        >

          <Link
            to="/"
            onClick={closeMenu}
          >
            Accueil
          </Link>


          <Link
            to="/products"
            onClick={closeMenu}
          >
            Chaussures
          </Link>


          <Link
            to="/about"
            onClick={closeMenu}
          >
            À propos
          </Link>


          {user && !isAdmin && (

            <Link
              to="/account/orders"
              onClick={closeMenu}
            >
              Mes commandes
            </Link>

          )}


          {isAdmin && (

            <Link
              to="/admin"
              className="admin-link"
              onClick={closeMenu}
            >
              Administration
            </Link>

          )}


          {user ? (

            <div className="navbar-user">

              <span className="navbar-user-name">
                Bonjour
                {' '}
                {user.first_name}
              </span>


              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Déconnexion
              </button>

            </div>

          ) : (

            <Link
              to="/login"
              onClick={closeMenu}
            >
              Connexion
            </Link>

          )}


          <Link
            to="/cart"
            className="cart-link"
            onClick={closeMenu}
          >
            Panier

            <span className="cart-count">
              {cartCount}
            </span>

          </Link>

        </div>


        <button
          type="button"
          className={
            menuOpen
              ? 'hamburger open'
              : 'hamburger'
          }
          onClick={() =>
            setMenuOpen(
              !menuOpen
            )
          }
          aria-label={
            menuOpen
              ? 'Fermer le menu'
              : 'Ouvrir le menu'
          }
          aria-expanded={
            menuOpen
          }
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </nav>

    </header>
  )
}


export default Navbar