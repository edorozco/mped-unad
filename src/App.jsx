import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { UserProvider } from './contexts/UserContext'
import { JobsProvider } from './contexts/JobsContext'
import AppRoutes from './AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <JobsProvider>
            <AppRoutes />
          </JobsProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
