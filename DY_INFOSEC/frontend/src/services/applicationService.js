import { db, functions } from '../config/firebase'
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
  limit,
  serverTimestamp
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'

export const getUserCourseApplication = async (userId, courseId) => {
  if (!userId || !courseId) return null

  try {
    const applicationsRef = collection(db, 'applications')
    const q = query(
      applicationsRef,
      where('userId', '==', userId),
      where('courseId', '==', courseId),
      limit(1)
    )
    const snapshot = await getDocs(q)

    if (snapshot.empty) return null

    const appDoc = snapshot.docs[0]
    const appData = appDoc.data()
    const courseRef = doc(db, 'courses', appData.courseId)
    const courseSnap = await getDoc(courseRef)
    const course = courseSnap.exists() ? { id: courseSnap.id, ...courseSnap.data() } : null

    return {
      id: appDoc.id,
      ...appData,
      course
    }
  } catch (error) {
    console.error('Error fetching user course application:', error)
    return null
  }
}

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
    const { userId, courseId } = applicationData
    if (!userId || !courseId) {
      return { success: false, error: '잘못된 신청 정보입니다.' }
    }

    const courseRef = doc(db, 'courses', courseId)
    const courseSnap = await getDoc(courseRef)
    if (!courseSnap.exists()) {
      return { success: false, error: '강의를 찾을 수 없습니다.' }
    }

    const course = courseSnap.data()
    if (course.applicationDeadline) {
      const deadline = course.applicationDeadline.toDate ? course.applicationDeadline.toDate() : new Date(course.applicationDeadline)
      if (deadline.getTime() < Date.now()) {
        return { success: false, error: '신청 기간이 종료된 강의입니다.' }
      }
    }

    if (course.maxStudents && (course.enrollmentCount || 0) >= course.maxStudents) {
      return { success: false, error: '해당 강의는 정원이 마감되었습니다.' }
    }

    const existingQuery = query(
      collection(db, 'applications'),
      where('userId', '==', userId),
      where('courseId', '==', courseId),
      limit(1)
    )
    const existingSnapshot = await getDocs(existingQuery)
    if (!existingSnapshot.empty) {
      return { success: false, error: '이미 해당 강의에 지원하셨습니다.' }
    }

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

export const confirmApplicationEnrollment = async (applicationId) => {
  try {
    const callable = httpsCallable(functions, 'confirmEnrollment')
    const response = await callable({ applicationId })
    return response.data
  } catch (error) {
    console.error('Error confirming enrollment:', error)
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
      const data = applicationSnap.data()

      const userRef = doc(db, 'users', data.userId)
      const userSnap = await getDoc(userRef)
      const user = userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null

      const courseRef = doc(db, 'courses', data.courseId)
      const courseSnap = await getDoc(courseRef)
      const course = courseSnap.exists() ? { id: courseSnap.id, ...courseSnap.data() } : null

      return { id: applicationSnap.id, ...data, user, course }
    }
    return null
  } catch (error) {
    console.error('Error getting application:', error)
    return null
  }
}
