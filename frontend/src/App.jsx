import {
  useState
} from 'react'

import {
  Route,
  Routes
} from 'react-router-dom'


import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminRoute from './components/AdminRoute'
import AdminLayout from './components/AdminLayout'


import Home from './pages/Home'
import ProductsPage from './pages/ProductsPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminProductFormPage from './pages/AdminProductFormPage'


import './App.css'


function App() {
  const [cart, setCart] =
    useState([])


  function addToCart(
    product,
    size
  ) {
    const selectedVariant =
      product.sizes.find(
        (variant) =>
          Number(variant.size) ===
          Number(size)
      )


    if (
      !selectedVariant ||
      selectedVariant.stock <= 0
    ) {
      return
    }


    setCart(
      (currentCart) => {
        const existingProduct =
          currentCart.find(
            (item) =>
              item.id === product.id &&
              Number(item.size) ===
              Number(size)
          )


        if (existingProduct) {

          return currentCart.map(
            (item) => {

              if (
                item.id === product.id &&
                Number(item.size) ===
                Number(size)
              ) {

                if (
                  item.quantity >=
                  selectedVariant.stock
                ) {
                  return item
                }


                return {
                  ...item,

                  quantity:
                    item.quantity + 1,

                  stock:
                    selectedVariant.stock
                }
              }


              return item
            }
          )
        }


        return [
          ...currentCart,

          {
            ...product,

            size,

            stock:
              selectedVariant.stock,

            quantity: 1
          }
        ]
      }
    )
  }


  function increaseQuantity(
    productId,
    size
  ) {
    setCart(
      (currentCart) =>
        currentCart.map(
          (item) => {

            if (
              item.id === productId &&
              Number(item.size) ===
              Number(size)
            ) {

              if (
                item.quantity >=
                item.stock
              ) {
                return item
              }


              return {
                ...item,

                quantity:
                  item.quantity + 1
              }
            }


            return item
          }
        )
    )
  }


  function decreaseQuantity(
    productId,
    size
  ) {
    setCart(
      (currentCart) =>
        currentCart
          .map(
            (item) => {

              if (
                item.id === productId &&
                Number(item.size) ===
                Number(size)
              ) {

                return {
                  ...item,

                  quantity:
                    item.quantity - 1
                }
              }


              return item
            }
          )
          .filter(
            (item) =>
              item.quantity > 0
          )
    )
  }


  function removeFromCart(
    productId,
    size
  ) {
    setCart(
      (currentCart) =>
        currentCart.filter(
          (item) =>
            !(
              item.id === productId &&
              Number(item.size) ===
              Number(size)
            )
        )
    )
  }


  const cartCount =
    cart.reduce(
      (total, item) =>
        total +
        item.quantity,

      0
    )


  return (
    <>

      <Navbar
        cartCount={cartCount}
      />


      <Routes>

        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/products"
          element={
            <ProductsPage />
          }
        />


        <Route
          path="/products/:id"
          element={
            <ProductPage
              onAddToCart={
                addToCart
              }
            />
          }
        />


        <Route
          path="/about"
          element={
            <AboutPage />
          }
        />


        <Route
          path="/login"
          element={
            <LoginPage />
          }
        />


        <Route
          path="/register"
          element={
            <RegisterPage />
          }
        />


        <Route
          path="/forgot-password"
          element={
            <ForgotPasswordPage />
          }
        />


        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              onIncrease={
                increaseQuantity
              }
              onDecrease={
                decreaseQuantity
              }
              onRemove={
                removeFromCart
              }
            />
          }
        />


        <Route
          path="/admin"
          element={
            <AdminRoute>

              <AdminLayout />

            </AdminRoute>
          }
        >

          <Route
            index
            element={
              <AdminDashboardPage />
            }
          />


          <Route
            path="products"
            element={
              <AdminProductsPage />
            }
          />


          <Route
            path="products/new"
            element={
              <AdminProductFormPage />
            }
          />


          <Route
            path="products/:id/edit"
            element={
              <AdminProductFormPage />
            }
          />

        </Route>

      </Routes>


      <Footer />

    </>
  )
}


export default App