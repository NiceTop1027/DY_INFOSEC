import { db } from '../config/firebase'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

// 관리자 이메일 목록
const ADMIN_EMAILS = ['mistarcodm@gmail.com']

// 사용자 역할 확인
export const isAdmin = (email) => {
  return ADMIN_EMAILS.includes(email?.toLowerCase())
}

// 사용자 프로필 생성
export const createUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, 'users', uid)
    
    const role = isAdmin(userData.email) ? 'admin' : 'student'
    
    await setDoc(userRef, {
      uid,
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL || null,
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // 학생 정보
      studentInfo: {
        grade: null,
        class: null,
        studentNumber: null,
        phone: null,
      },
      // 수강 정보
      enrollments: [],
      // 제출한 과제
      submissions: [],
    })
    
    return { success: true, role }
  } catch (error) {
    console.error('Error creating user profile:', error)
    return { success: false, error: error.message }
  }
}

// 사용자 프로필 가져오기
export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() }
    } else {
      return { success: false, error: 'User not found' }
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    return { success: false, error: error.message }
  }
}

// 사용자 프로필 업데이트
export const updateUserProfile = async (uid, updates) => {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { success: false, error: error.message }
  }
}

// 역할 권한 확인
export const checkPermission = (userRole, requiredRole) => {
  const roleHierarchy = {
    admin: 3,
    teacher: 2,
    student: 1,
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}
