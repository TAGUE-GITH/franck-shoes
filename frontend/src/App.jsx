import './App.css'
import Navbar from './components/Navbar'

function App() {
  return (
    <div>
      <Navbar />
      <div className="welcome">
        <h1>Franck Shoes</h1>
        <p>Bienvenue dans ma boutique de chaussures.</p>
        <button>Voir les chaussures</button>
      </div>
    </div>
  )
  
}

export default App