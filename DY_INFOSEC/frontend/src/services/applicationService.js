import { db } from '../config/firebase'
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'

// 사용자의 신청서 가져오기
export const getUserApplications = async (userId) => {
  try {
    const applicationsRef = collection(db, 'applications')
    const q = query(
      applicationsRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    
    const applications = await Promise.all(
      snapshot.docs.map(async (appDoc) => {
        const appData = appDoc.data()
        
        // 강의 정보 가져오기
        const courseRef = doc(db, 'courses', appData.courseId)
        const courseSnap = await getDoc(courseRef)
        const course = courseSnap.exists() ? { id: courseSnap.id, ...courseSnap.data() } : null
        
        return {
          id: appDoc.id,
          ...appData,
          course
        }
      })
    )
    
    return applications
  } catch (error) {
    console.error('Error getting applications:', error)
    return []
  }
}

// 모든 신청서 가져오기 (관리자만)
export const getAllApplications = async () => {
  try {
    const applicationsRef = collection(db, 'applications')
    const q = query(applicationsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    
    const applications = await Promise.all(
      snapshot.docs.map(async (appDoc) => {
        const appData = appDoc.data()
        
        // 사용자 정보 가져오기
        const userRef = doc(db, 'users', appData.userId)
        const userSnap = await getDoc(userRef)
        const user = userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null
        
        // 강의 정보 가져오기
        const courseRef = doc(db, 'courses', appData.courseId)
        const courseSnap = await getDoc(courseRef)
        const course = courseSnap.exists() ? { id: courseSnap.id, ...courseSnap.data() } : null
        
        return {
          id: appDoc.id,
          ...appData,
          user,
          course
        }
      })
    )
    
    return applications
  } catch (error) {
    console.error('Error getting all applications:', error)
    return []
  }
}

// 신청서 생성
export const createApplication = async (applicationData) => {
  try {
    const applicationsRef = collection(db, 'applications')
    
    // 신청번호 생성
    const applicationNumber = `APP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    
    const docRef = await addDoc(applicationsRef, {
      ...applicationData,
      applicationNumber,
      status: 'SUBMITTED',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    return { success: true, id: docRef.id, applicationNumber }
  } catch (error) {
    console.error('Error creating application:', error)
    return { success: false, error: error.message }
  }
}

// 신청서 상태 업데이트 (관리자만)
export const updateApplicationStatus = async (applicationId, status, note = '') => {
  try {
    const applicationRef = doc(db, 'applications', applicationId)
    await updateDoc(applicationRef, {
      status,
      statusNote: note,
      updatedAt: serverTimestamp()
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error updating application status:', error)
    return { success: false, error: error.message }
  }
}

// 특정 신청서 가져오기
export const getApplication = async (applicationId) => {
  try {
    const applicationRef = doc(db, 'applications', applicationId)
    const applicationSnap = await getDoc(applicationRef)
    
    if (applicationSnap.exists()) {
      return { id: applicationSnap.id, ...applicationSnap.data() }
    }
    return null
  } catch (error) {
    console.error('Error getting application:', error)
    return null
  }
}
