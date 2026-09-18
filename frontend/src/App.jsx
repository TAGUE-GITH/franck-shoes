import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import ProductsPage from './pages/ProductsPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import AboutPage from './pages/AboutPage'

import './App.css'

function App() {
  const [cart, setCart] = useState([])

  function addToCart(product, size) {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) =>
          item.id === product.id &&
          item.size === size
      )

      if (existingProduct) {
        return currentCart.map((item) => {
          if (
            item.id === product.id &&
            item.size === size
          ) {
            const currentQuantity = item.quantity ?? 1

            if (currentQuantity >= item.stock) {
              return item
            }

            return {
              ...item,
              quantity: currentQuantity + 1
            }
          }

          return item
        })
      }

      return [
        ...currentCart,
        {
          ...product,
          size,
          quantity: 1
        }
      ]
    })
  }

  function increaseQuantity(productId, size) {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          item.id === productId &&
          item.size === size
        ) {
          const currentQuantity = item.quantity ?? 1

          if (currentQuantity >= item.stock) {
            return item
          }

          return {
            ...item,
            quantity: currentQuantity + 1
          }
        }

        return item
      })
    )
  }

  function decreaseQuantity(productId, size) {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (
            item.id === productId &&
            item.size === size
          ) {
            const currentQuantity = item.quantity ?? 1

            return {
              ...item,
              quantity: currentQuantity - 1
            }
          }

          return item
        })
        .filter((item) => item.quantity > 0)
    )
  }

  function removeFromCart(productId, size) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          !(
            item.id === productId &&
            item.size === size
          )
      )
    )
  }

  const cartCount = cart.reduce(
    (total, item) =>
      total + (item.quantity ?? 0),
    0
  )

  return (
    <>
      <Navbar cartCount={cartCount} />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<ProductsPage />}
        />

        <Route
          path="/products/:id"
          element={
            <ProductPage
              onAddToCart={addToCart}
            />
          }
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeFromCart}
            />
          }
        />

      </Routes>

      <Footer />
    </>
  )
}

export default App