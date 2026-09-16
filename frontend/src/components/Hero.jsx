import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Trouve ta prochaine paire</h1>

        <p>
          Découvre des chaussures qui combinent style,
          confort et performance.
        </p>

        <button>Voir les chaussures</button>
      </div>

      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
          alt="Chaussure rouge"
        />
      </div>
    </section>
  )
}

export default Hero