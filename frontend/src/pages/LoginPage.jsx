import {
  useState
} from 'react'

import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

import './LoginPage.css'


function LoginPage() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  const {
    login
  } = useAuth()


  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [error, setError] =
    useState('')

  const [loading, setLoading] =
    useState(false)


  async function handleSubmit(
    event
  ) {
    event.preventDefault()

    setError('')


    if (!email || !password) {
      setError(
        'Veuillez renseigner votre email et votre mot de passe.'
      )

      return
    }


    try {
      setLoading(true)

      const user =
        await login(
          email,
          password
        )


      const requestedPage =
        location.state?.from?.pathname


      if (requestedPage) {
        navigate(
          requestedPage,
          {
            replace: true
          }
        )

        return
      }


      if (user.role === 'ADMIN') {
        navigate(
          '/admin',
          {
            replace: true
          }
        )

        return
      }


      navigate(
        '/',
        {
          replace: true
        }
      )
    } catch (error) {
      setError(
        error.message
      )
    } finally {
      setLoading(false)
    }
  }


  return (
    <main className="login-page">

      <section className="login-card">

        <div className="login-form-side">

          <div className="login-form-wrapper">

            <span className="login-eyebrow">
              Franck Shoes
            </span>

            <h1>
              Bon retour
            </h1>

            <p className="login-subtitle">
              Connectez-vous pour accéder
              à votre compte Franck Shoes.
            </p>


            <form
              className="login-form"
              onSubmit={handleSubmit}
            >

              <div className="form-group">

                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  autoComplete="email"
                />

              </div>


              <div className="form-group">

                <label htmlFor="password">
                  Mot de passe
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                />

              </div>


              <div className="login-options">

                <label className="remember-me">

                  <input
                    type="checkbox"
                  />

                  <span>
                    Se souvenir de moi
                  </span>

                </label>

                <Link
                  to="/forgot-password"
                  className="forgot-password"
                >
                  Mot de passe oublié ?
                </Link>

              </div>


              {error && (
                <p className="login-message error">
                  {error}
                </p>
              )}


              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? 'Connexion...'
                  : 'Se connecter'}
              </button>


              <button
                type="button"
                className="google-button"
              >

                <span className="google-icon">
                  G
                </span>

                <span>
                  Continuer avec Google
                </span>

              </button>

            </form>


            <p className="signup-text">
              Vous n'avez pas de compte ?
              {' '}

              <Link to="/register">
                Créer un compte
              </Link>
            </p>

          </div>

        </div>


        <div className="login-visual-side">

          <div className="login-visual-content">

            <div className="visual-badge">
              Nouvelle collection
            </div>

            <h2>
              Avance avec style.
            </h2>

            <p>
              Découvrez des chaussures
              sélectionnées pour le confort,
              le style et votre quotidien.
            </p>

          </div>


          <div className="shoe-showcase">

            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
              alt="Chaussure Franck Shoes"
            />

          </div>

        </div>

      </section>

    </main>
  )
}


export default LoginPage