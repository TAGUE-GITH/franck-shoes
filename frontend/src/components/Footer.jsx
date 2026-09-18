import { Link } from 'react-router-dom'

import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">

      <div className="footer-main">

        <div className="footer-brand">

          <Link
            to="/"
            className="footer-logo"
          >
            <span>FRANCK</span>
            <strong>SHOES</strong>
          </Link>

          <p>
            Des chaussures sélectionnées pour
            accompagner chaque pas avec style
            et confort.
          </p>

        </div>


        <div className="footer-column">

          <h3>
            Boutique
          </h3>

          <Link to="/products">
            Toutes les chaussures
          </Link>

          <Link to="/products">
            Nouveautés
          </Link>

          <Link to="/cart">
            Mon panier
          </Link>

        </div>


        <div className="footer-column">

          <h3>
            Franck Shoes
          </h3>

          <Link to="/about">
            À propos
          </Link>

          <a href="mailto:contact@franckshoes.com">
            Contact
          </a>

        </div>


        <div className="footer-column">

          <h3>
            Services
          </h3>

          <span>
            Livraison
          </span>

          <span>
            Retours
          </span>

          <span>
            Paiement sécurisé
          </span>

        </div>

      </div>


      <div className="footer-bottom">

        <p>
          © {currentYear} Franck Shoes.
          Tous droits réservés.
        </p>

        <div>
          <a href="#">
            Confidentialité
          </a>

          <a href="#">
            Conditions
          </a>
        </div>

      </div>

    </footer>
  )
}

export default Footer