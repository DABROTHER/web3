import React from 'react'
import { useRoutes } from 'react-router-dom'
import { AuthProvider } from './context/auth'
import routes from './routes'
import Navbar from './components/layout/navbar'

function App() {
  const elements = useRoutes(routes)

  return (
    <AuthProvider>
      <Navbar />
      {elements}
    </AuthProvider>
  )
}

export default App
