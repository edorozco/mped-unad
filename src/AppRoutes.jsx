import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Footer from './components/layout/Footer'
import Landing from './pages/Landing'
import Contact from './pages/Contact'
import Onboarding from './pages/Onboarding'
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'
import YoungProfile from './pages/Profile/YoungProfile'
import YoungHome from './pages/Home/YoungHome'
import YoungDashboard from './pages/Home/YoungDashboard'
import MyApplications from './pages/Applications/MyApplications'
import CoursesCatalog from './pages/Courses/CoursesCatalog'
import CourseDetail from './pages/Courses/CourseDetail'
import VocationalTest from './pages/VocationalTest/VocationalTest'
import VocationalResult from './pages/VocationalTest/VocationalResult'
import OfferDetail from './pages/Offer/OfferDetail'
import EmployerDashboard from './pages/Employer/EmployerDashboard'
import CreateJob from './pages/Employer/CreateJob'
import Applicants from './pages/Work/Applicants'
import ApplicantProfile from './pages/Work/ApplicantProfile'
import Attendance from './pages/Work/Attendance'
import Credentials from './pages/Credentials/Credentials'
import CredentialDetail from './pages/Credentials/CredentialDetail'
import Ratings from './pages/Ratings/Ratings'
import Notifications from './pages/Notifications/Notifications'
import AdminDashboard from './pages/Admin/AdminDashboard'

function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex flex-col w-full min-h-0">
        <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/contacto" element={<Contact />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/auth/young/register" element={<Register />} />
      <Route path="/auth/employer/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/empleos" element={<YoungHome />} />
      
      <Route 
        path="/profile/young" 
        element={
          <ProtectedRoute requiredRole="young">
            <YoungProfile />
          </ProtectedRoute>
        } 
      />
      
      <Route
        path="/home"
        element={
          <ProtectedRoute requiredRole="young">
            <YoungDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route path="/offer/:id" element={<OfferDetail />} />

      <Route path="/cursos" element={<CoursesCatalog />} />
      <Route path="/cursos/:id" element={<CourseDetail />} />

      <Route
        path="/test-vocacional"
        element={
          <ProtectedRoute requiredRole="young">
            <VocationalTest />
          </ProtectedRoute>
        }
      />

      <Route
        path="/test-vocacional/resultado"
        element={
          <ProtectedRoute requiredRole="young">
            <VocationalResult />
          </ProtectedRoute>
        }
      />

      <Route
        path="/postulaciones"
        element={
          <ProtectedRoute requiredRole="young">
            <MyApplications />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/employer/dashboard" 
        element={
          <ProtectedRoute requiredRole="employer">
            <EmployerDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/employer/create-job" 
        element={
          <ProtectedRoute requiredRole="employer">
            <CreateJob />
          </ProtectedRoute>
        } 
      />
      
      <Route
        path="/work/:jobId/candidate/:applicantId"
        element={
          <ProtectedRoute requiredRole="employer">
            <ApplicantProfile />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/work/:jobId/applicants" 
        element={
          <ProtectedRoute requiredRole="employer">
            <Applicants />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/work/:jobId/attendance" 
        element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        } 
      />
      
      <Route
        path="/credentials"
        element={
          <ProtectedRoute>
            <Credentials />
          </ProtectedRoute>
        }
      />

      <Route
        path="/credentials/:id"
        element={
          <ProtectedRoute>
            <CredentialDetail />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/ratings" 
        element={
          
            <Ratings />
          
        } 
      />
      
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default AppRoutes
