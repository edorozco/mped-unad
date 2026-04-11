import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Footer from './components/layout/Footer'
import Landing from './pages/Landing'
import Contact from './pages/Contact'
import Onboarding from './pages/Onboarding'
import YoungRegister from './pages/Auth/YoungRegister'
import EmployerRegister from './pages/Auth/EmployerRegister'
import Login from './pages/Auth/Login'
import YoungProfile from './pages/Profile/YoungProfile'
import YoungHome from './pages/Home/YoungHome'
import OfferDetail from './pages/Offer/OfferDetail'
import EmployerDashboard from './pages/Employer/EmployerDashboard'
import CreateJob from './pages/Employer/CreateJob'
import Applicants from './pages/Work/Applicants'
import ApplicantProfile from './pages/Work/ApplicantProfile'
import Attendance from './pages/Work/Attendance'
import Credentials from './pages/Credentials/Credentials'
import Ratings from './pages/Ratings/Ratings'
import Notifications from './pages/Notifications/Notifications'
import AdminDashboard from './pages/Admin/AdminDashboard'

function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth()
  
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
      <Route path="/auth/young/register" element={<YoungRegister />} />
      <Route path="/auth/employer/register" element={<EmployerRegister />} />
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
            <YoungHome />
          </ProtectedRoute>
        } 
      />
      
      <Route path="/offer/:id" element={<OfferDetail />} />
      
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
