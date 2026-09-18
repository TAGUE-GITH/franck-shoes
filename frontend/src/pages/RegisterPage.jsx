import {
  useState
} from 'react'

import {
  Link,
  useNavigate
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

import './RegisterPage.css'


function RegisterPage() {
  const navigate =
    useNavigate()

  const {
    register
  } = useAuth()


  const [formData, setFormData] =
    useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    })


  const [error, setError] =
    useState('')

  const [loading, setLoading] =
    useState(false)


  function handleChange(
    event
  ) {
    const {
      name,
      value
    } = event.target


    setFormData(
      (currentData) => ({
        ...currentData,

        [name]: value
      })
    )


    setError('')
  }


  async function handleSubmit(
    event
  ) {
    event.preventDefault()

    setError('')


    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError(
        'Tous les champs sont obligatoires.'
      )

      return
    }


    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        'Les mots de passe ne correspondent pas.'
      )

      return
    }


    try {
      setLoading(true)

      await register(
        formData
      )

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
    <main className="register-page">

      <section className="register-card">

        <div className="register-form-side">

          <div className="register-form-wrapper">

            <span className="register-eyebrow">
              Franck Shoes
            </span>

            <h1>
              Créer un compte
            </h1>

            <p className="register-subtitle">
              Créez votre compte pour
              faciliter vos commandes et
              retrouver vos achats.
            </p>


            <form
              className="register-form"
              onSubmit={handleSubmit}
            >

              <div className="register-name-row">

                <div className="register-group">

                  <label htmlFor="firstName">
                    Prénom
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Franck"
                    value={
                      formData.firstName
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="given-name"
                  />

                </div>


                <div className="register-group">

                  <label htmlFor="lastName">
                    Nom
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Tague"
                    value={
                      formData.lastName
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="family-name"
                  />

                </div>

              </div>


              <div className="register-group">

                <label htmlFor="register-email">
                  Email
                </label>

                <input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="email"
                />

              </div>


              <div className="register-group">

                <label htmlFor="register-password">
                  Mot de passe
                </label>

                <input
                  id="register-password"
                  name="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="new-password"
                />

              </div>


              <div className="register-group">

                <label htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirmez le mot de passe"
                  value={
                    formData.confirmPassword
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="new-password"
                />

              </div>


              {error && (
                <p className="register-message error">
                  {error}
                </p>
              )}


              <button
                type="submit"
                className="register-button"
                disabled={loading}
              >
                {loading
                  ? 'Création...'
                  : 'Créer mon compte'}
              </button>


              <button
                type="button"
                className="register-google-button"
              >

                <span className="register-google-icon">
                  G
                </span>

                Continuer avec Google

              </button>

            </form>


            <p className="register-login-text">

              Vous avez déjà un compte ?
              {' '}

              <Link to="/login">
                Se connecter
              </Link>

            </p>

          </div>

        </div>


        <div className="register-visual-side">

          <div className="register-visual-content">

            <span>
              Rejoignez Franck Shoes
            </span>

            <h2>
              Votre style commence ici.
            </h2>

            <p>
              Retrouvez vos commandes,
              vos informations et bientôt
              vos produits favoris depuis
              votre espace personnel.
            </p>

          </div>


          <img
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772"
            alt="Chaussure Franck Shoes"
          />

        </div>

      </section>

    </main>
  )
}


export default RegisterPage