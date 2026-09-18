import './Hero.css'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        <span className="hero-badge">
          Nouvelle collection 2026
        </span>

        <h1>
          Trouve la paire
          <span> qui te ressemble.</span>
        </h1>

        <p className="hero-description">
          Découvre une sélection de chaussures pensée pour
          combiner style, confort et performance au quotidien.
        </p>

        <div className="hero-actions">

          <Link
  to="/products"
  className="hero-primary-button"
>
  Découvrir la collection
</Link>
          <Link
  to="/products"
  className="hero-secondary-button"
>
  Voir les nouveautés
  <span>→</span>
</Link>

        </div>

        <div className="hero-features">

          <span>Livraison rapide</span>
          <span>Retours faciles</span>
          <span>Paiement sécurisé</span>

        </div>

      </div>

      <div className="hero-visual">

        <div className="hero-image-wrapper">

          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            alt="Chaussure rouge de la nouvelle collection"
            className="hero-image"
          />

          <div className="hero-floating-card">
            <span>À partir de</span>
            <strong>95 €</strong>
          </div>

        </div>

      </div>

    </section>
  )
}

export default Hero