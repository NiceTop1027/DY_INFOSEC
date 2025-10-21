import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import { AdminRoute, StudentRoute } from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import MyClassroom from './pages/MyClassroom'
import Applications from './pages/Applications'
import ApplicationForm from './pages/ApplicationForm'
import Notices from './pages/Notices'
import NoticeDetail from './pages/NoticeDetail'
import FAQ from './pages/FAQ'
import Inquiry from './pages/Inquiry'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import ManageCourses from './pages/admin/ManageCourses'
import ManageNotices from './pages/admin/ManageNotices'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="notices" element={<Notices />} />
          <Route path="notices/:id" element={<NoticeDetail />} />
          <Route path="faq" element={<FAQ />} />
          
          <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="admin/courses" element={<AdminRoute><ManageCourses /></AdminRoute>} />
          <Route path="admin/notices" element={<AdminRoute><ManageNotices /></AdminRoute>} />
          <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="my-classroom" element={<PrivateRoute><MyClassroom /></PrivateRoute>} />
          <Route path="applications" element={<PrivateRoute><Applications /></PrivateRoute>} />
          <Route path="applications/new/:courseId" element={<PrivateRoute><ApplicationForm /></PrivateRoute>} />
          <Route path="inquiry" element={<PrivateRoute><Inquiry /></PrivateRoute>} />
          <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
