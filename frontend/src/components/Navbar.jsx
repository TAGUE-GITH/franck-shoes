import { useState } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <h2 className="logo">Franck Shoes</h2>

      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Ouvrir le menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <a href="#">Accueil</a>
        <a href="#">Chaussures</a>
        <a href="#">À propos</a>
        <a href="#">Panier</a>
      </div>
    </nav>
  )
}

export default Navbar