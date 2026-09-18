import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import CartPage from './pages/CartPage'
import ProductPage from './pages/ProductPage'
import ProductsPage from './pages/ProductsPage'

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
          if (item.quantity >= item.stock) {
            return item
          }

          return {
            ...item,
            quantity: item.quantity + 1
          }
        }

        return item
      })
    }

    return [
      ...currentCart,
      {
        ...product,
        size: size,
        quantity: 1
      }
    ]
  })
}

     

 function increaseQuantity(productId, size) {
  setCart((currentCart) =>
    currentCart.map((item) =>
      item.id === productId && item.size === size
        ? {
            ...item,
            quantity:
              item.quantity < item.stock
                ? item.quantity + 1
                : item.quantity
          }
        : item
    )
  )
}

function decreaseQuantity(productId, size) {
  setCart((currentCart) =>
    currentCart
      .map((item) =>
        item.id === productId && item.size === size
          ? {
              ...item,
              quantity: item.quantity - 1
            }
          : item
      )
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
    (total, item) => {
      return total + (item.quantity ?? 0)
    },
    0
  )

  return (
    <>
      <Navbar cartCount={cartCount} />

      <Routes>

  <Route
    path="/"
    element={
      <Home
        onAddToCart={addToCart}
      />
    }
  />

  <Route
    path="/products"
    element={
      <ProductsPage
        onAddToCart={addToCart}
      />
    }
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