import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { endpoints } from '@/routes/endpoints'

export const ProtectedRoutes = ({ children }) => {
  const ValueCheck = ['', null, undefined]

  const walletAddress = localStorage.getItem('walletAddress')

  if (ValueCheck.includes(walletAddress)) {
    toast.info('Please, Connect Your Wallet')
    return <Navigate to={endpoints.home} replace={true} />
  }

  return children
}

ProtectedRoutes.propTypes = {
  children: PropTypes.node.isRequired,
}
