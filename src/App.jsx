import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { UserProvider } from './contexts/UserContext'
import { JobsProvider } from './contexts/JobsContext'
import { CoursesProvider } from './contexts/CoursesContext'
import AppRoutes from './AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <JobsProvider>
            <CoursesProvider>
              <AppRoutes />
            </CoursesProvider>
          </JobsProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
