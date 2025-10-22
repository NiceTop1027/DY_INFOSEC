import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { auth } from '../config/firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth'
import { createUserProfile, getUserProfile } from '../services/userService'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      
      // Firebase 로그인
      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password)
          
          // Firestore에서 사용자 프로필 가져오기
          const profileResult = await getUserProfile(userCredential.user.uid)
          
          set({
            user: {
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              displayName: userCredential.user.displayName,
              photoURL: userCredential.user.photoURL,
              emailVerified: userCredential.user.emailVerified,
              role: profileResult.success ? profileResult.data.role : 'student',
              ...profileResult.data,
            },
            isAuthenticated: true,
            loading: false,
          })
          return { success: true }
        } catch (error) {
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },
      
      // Firebase 회원가입
      signup: async (email, password, displayName) => {
        set({ loading: true, error: null })
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password)
          
          // 프로필 업데이트
          await updateProfile(userCredential.user, {
            displayName: displayName
          })
          
          // Firestore에 사용자 프로필 생성 (Functions에서 자동 생성됨)
          // 잠시 대기 후 프로필 가져오기
          await new Promise(resolve => setTimeout(resolve, 1000))
          const profileResult = await getUserProfile(userCredential.user.uid)
          
          set({
            user: {
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              displayName: displayName,
              photoURL: userCredential.user.photoURL,
              role: profileResult.success ? profileResult.data.role : 'student',
            },
            isAuthenticated: true,
            loading: false,
          })
          
          return { success: true }
        } catch (error) {
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      },
      
      // Firebase 로그아웃
      logout: async () => {
        try {
          await signOut(auth)
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          })
        } catch (error) {
          set({ error: error.message })
        }
      },
      
      // 사용자 상태 업데이트
      setUser: async (user) => {
        if (user) {
          // Firestore에서 role 정보 가져오기
          const profileResult = await getUserProfile(user.uid)
          
          set({
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              role: profileResult.success ? profileResult.data.role : 'student',
              ...profileResult.data,
            },
            isAuthenticated: true,
          })
        } else {
          set({
            user: null,
            isAuthenticated: false,
          })
        }
      },
      
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
)

// Firebase 인증 상태 리스너
onAuthStateChanged(auth, async (user) => {
  await useAuthStore.getState().setUser(user)
})
