import { useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

function Navbar({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">

        <a
          href="#"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <span>FRANCK</span>
          <strong>SHOES</strong>
        </a>

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