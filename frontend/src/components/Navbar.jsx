import { useState } from 'react'
import { Link } from 'react-router-dom'

import './Navbar.css'

function Navbar({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <span>FRANCK</span>
          <strong>SHOES</strong>
        </Link>

        <div className={menuOpen ? 'nav-links open' : 'nav-links'}>

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
          className={menuOpen ? 'hamburger open' : 'hamburger'}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
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