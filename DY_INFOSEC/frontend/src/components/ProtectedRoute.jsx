import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // 특정 역할이 필요한 경우
  if (requiredRole) {
    const normalizedRole = user?.role || 'student'
    const allowed = Array.isArray(requiredRole)
      ? requiredRole.includes(normalizedRole) || normalizedRole === 'admin'
      : normalizedRole === requiredRole || normalizedRole === 'admin'

    if (!allowed) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}

// 관리자 전용 라우트
export function AdminRoute({ children }) {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
}

// 학생 이상 권한 (로그인만 필요)
export function StudentRoute({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

// 강사 전용 라우트 (관리자 접근 허용)
export function InstructorRoute({ children }) {
  return <ProtectedRoute requiredRole={[ 'instructor', 'teacher' ]}>{children}</ProtectedRoute>
}
