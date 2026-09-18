import { useAuth } from '../context/AuthContext'

import './AdminDashboardPage.css'


function AdminDashboardPage() {
  const {
    user
  } = useAuth()


  return (
    <main className="admin-dashboard">

      <header className="admin-dashboard-header">

        <div>

          <span>
            Administration
          </span>

          <h1>
            Bonjour {user?.first_name}
          </h1>

          <p>
            Bienvenue dans l'espace
            d'administration de Franck Shoes.
          </p>

        </div>

      </header>


      <section className="admin-stats">

        <article className="admin-stat-card">

          <span>
            Produits
          </span>

          <strong>
            —
          </strong>

          <p>
            Catalogue
          </p>

        </article>


        <article className="admin-stat-card">

          <span>
            Commandes
          </span>

          <strong>
            —
          </strong>

          <p>
            À traiter
          </p>

        </article>


        <article className="admin-stat-card">

          <span>
            Clients
          </span>

          <strong>
            —
          </strong>

          <p>
            Comptes enregistrés
          </p>

        </article>


        <article className="admin-stat-card">

          <span>
            Chiffre d'affaires
          </span>

          <strong>
            —
          </strong>

          <p>
            FCFA
          </p>

        </article>

      </section>


      <section className="admin-welcome">

        <span>
          Première étape
        </span>

        <h2>
          Gestion du catalogue
        </h2>

        <p>
          Nous allons maintenant connecter
          cette interface à Django pour ajouter,
          modifier et supprimer les produits,
          gérer leurs images, leurs pointures
          et leurs stocks.
        </p>

      </section>

    </main>
  )
}


export default AdminDashboardPage