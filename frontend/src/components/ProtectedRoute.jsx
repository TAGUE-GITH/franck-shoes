import {
  Navigate,
  useLocation
} from 'react-router-dom'

import {
  useAuth
} from '../context/AuthContext'


function ProtectedRoute({
  children
}) {
  const location =
    useLocation()


  const {
    isAuthenticated,
    loading
  } = useAuth()


  if (loading) {
    return (
      <div
        style={{
          minHeight: '60vh',

          display: 'flex',

          alignItems: 'center',

          justifyContent: 'center'
        }}
      >
        Chargement...
      </div>
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


  return children
}


export default ProtectedRoute