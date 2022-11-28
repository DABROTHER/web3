import { createContext, useContext } from 'react'
import PropTypes from 'prop-types'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const SignUp = (walletAddress) => {
    localStorage.setItem('walletAddress', walletAddress.toLowerCase())
  }

  const Logout = () => {
    localStorage.removeItem('walletAddress')
  }

  return (
    <AuthContext.Provider value={{ SignUp, Logout }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useAuth = () => useContext(AuthContext)
