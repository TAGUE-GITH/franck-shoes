import { useState } from 'react'
import { Link } from 'react-router-dom'

import './ForgotPasswordPage.css'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!email) {
      setError('Entre ton adresse email.')
      setMessage('')
      return
    }

    setError('')

    setMessage(
      'Si ce compte existe, un lien de réinitialisation sera envoyé.'
    )
  }

  return (
    <main className="forgot-page">

      <section className="forgot-card">

        <Link
          to="/login"
          className="forgot-back"
        >
          ← Retour
        </Link>

        <div className="forgot-icon">
          ✦
        </div>

        <span className="forgot-eyebrow">
          Franck Shoes
        </span>

        <h1>
          Forgot password?
        </h1>

        <p className="forgot-description">
          Pas de problème. Entre ton adresse email
          et nous t'enverrons un lien pour créer
          un nouveau mot de passe.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="forgot-group">

            <label htmlFor="forgot-email">
              Email
            </label>

            <input
              id="forgot-email"
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
                setMessage('')
              }}
            />

          </div>

          {error && (
            <p className="forgot-message error">
              {error}
            </p>
          )}

          {message && (
            <p className="forgot-message success">
              {message}
            </p>
          )}

          <button type="submit">
            Envoyer le lien
          </button>

        </form>

        <p className="forgot-login">
          Tu te souviens de ton mot de passe?
          {' '}

          <Link to="/login">
            Se connecter
          </Link>
        </p>

      </section>

    </main>
  )
}

export default ForgotPasswordPage