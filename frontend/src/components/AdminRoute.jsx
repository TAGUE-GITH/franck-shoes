import {
  Navigate,
  useLocation
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'


function AdminRoute({
  children
}) {
  const {
    isAuthenticated,
    isAdmin,
    loading
  } = useAuth()

  const location =
    useLocation()


  if (loading) {
    return (
      <main
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        Chargement...
      </main>
    )
  }


  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location
        }}
      />
    )
  }


  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }


  return children
}


export default AdminRoute