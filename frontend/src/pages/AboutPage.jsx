import { Link } from 'react-router-dom'

import './AboutPage.css'

function AboutPage() {
  return (
    <main className="about-page">

      <section className="about-hero">

        <div className="about-hero-content">

          <span className="about-eyebrow">
            Notre histoire
          </span>

          <h1>
            Plus qu'une paire.
            <span> Une façon d'avancer.</span>
          </h1>

          <p>
            Franck Shoes est une boutique pensée pour celles
            et ceux qui recherchent des chaussures modernes,
            confortables et adaptées à leur quotidien.
          </p>

          <Link
            to="/products"
            className="about-button"
          >
            Découvrir la collection
          </Link>

        </div>

        <div className="about-hero-visual">

          <img
            src="https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3"
            alt="Collection de chaussures"
          />

        </div>

      </section>


      <section className="about-values">

        <div className="about-section-heading">

          <span>
            Nos engagements
          </span>

          <h2>
            Ce qui nous guide
          </h2>

        </div>


        <div className="values-grid">

          <article className="value-card">

            <span className="value-number">
              01
            </span>

            <h3>
              Style
            </h3>

            <p>
              Des modèles sélectionnés pour accompagner
              différents styles et différentes occasions.
            </p>

          </article>


          <article className="value-card">

            <span className="value-number">
              02
            </span>

            <h3>
              Confort
            </h3>

            <p>
              Une bonne chaussure doit être aussi agréable
              à porter qu'elle est belle à regarder.
            </p>

          </article>


          <article className="value-card">

            <span className="value-number">
              03
            </span>

            <h3>
              Simplicité
            </h3>

            <p>
              Une expérience d'achat claire, rapide et
              agréable, de la recherche jusqu'à la commande.
            </p>

          </article>

        </div>

      </section>


      <section className="about-cta">

        <div>
          <span>
            Prêt à trouver votre paire ?
          </span>

          <h2>
            Découvrez la collection Franck Shoes.
          </h2>
        </div>

        <Link to="/products">
          Voir les chaussures
          <span>→</span>
        </Link>

      </section>

    </main>
  )
}

export default AboutPage