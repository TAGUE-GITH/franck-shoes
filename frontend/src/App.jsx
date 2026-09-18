import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import Navbar from './components/Navbar'

import Home from './pages/Home'
import ProductsPage from './pages/ProductsPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'

import './App.css'

function App() {
  const [cart, setCart] = useState([])

  // Ajouter un produit avec sa pointure
  function addToCart(product, size) {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) =>
          item.id === product.id &&
          item.size === size
      )

      // Le produit + cette pointure existe déjà
      if (existingProduct) {
        return currentCart.map((item) => {
          if (
            item.id === product.id &&
            item.size === size
          ) {
            const currentQuantity = item.quantity ?? 1

            // Ne pas dépasser le stock
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

      // Nouveau produit dans le panier
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

  // Augmenter la quantité
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

  // Diminuer la quantité
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

  // Supprimer complètement une ligne
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

  // Nombre total d'articles dans le panier
  const cartCount = cart.reduce(
    (total, item) =>
      total + (item.quantity ?? 0),
    0
  )

  return (
    <>
      <Navbar cartCount={cartCount} />

      <Routes>

        {/* ACCUEIL */}
        <Route
          path="/"
          element={
            <Home />
          }
        />

        {/* CATALOGUE */}
        <Route
          path="/products"
          element={
            <ProductsPage />
          }
        />

        {/* DÉTAIL D'UN PRODUIT */}
        <Route
          path="/products/:id"
          element={
            <ProductPage
              onAddToCart={addToCart}
            />
          }
        />

        {/* PANIER */}
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
    </>
  )
}

export default App