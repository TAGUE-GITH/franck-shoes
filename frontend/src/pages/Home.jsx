import Hero from '../components/Hero'
import FeaturedProducts from '../components/FeaturedProducts'

function Home({ onAddToCart }) {
  return (
    <>
      <Hero />

      <FeaturedProducts
        onAddToCart={onAddToCart}
      />
    </>
  )
}

export default Home