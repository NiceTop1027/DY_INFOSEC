import { db } from '../config/firebase'
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'

// 모든 강의 가져오기
export const getAllCourses = async () => {
  try {
    const coursesRef = collection(db, 'courses')
    const q = query(coursesRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting courses:', error)
    return []
  }
}

// 특정 강의 가져오기
export const getCourse = async (courseId) => {
  try {
    const courseRef = doc(db, 'courses', courseId)
    const courseSnap = await getDoc(courseRef)
    
    if (courseSnap.exists()) {
      return { id: courseSnap.id, ...courseSnap.data() }
    }
    return null
  } catch (error) {
    console.error('Error getting course:', error)
    return null
  }
}

// 강의 생성 (관리자만)
export const createCourse = async (courseData) => {
  try {
    const coursesRef = collection(db, 'courses')
    const docRef = await addDoc(coursesRef, {
      ...courseData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      enrollmentCount: 0,
      isActive: true
    })
    
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating course:', error)
    return { success: false, error: error.message }
  }
}

// 강의 수정 (관리자만)
export const updateCourse = async (courseId, updates) => {
  try {
    const courseRef = doc(db, 'courses', courseId)
    await updateDoc(courseRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error updating course:', error)
    return { success: false, error: error.message }
  }
}

// 강의 삭제 (관리자만)
export const deleteCourse = async (courseId) => {
  try {
    const courseRef = doc(db, 'courses', courseId)
    await deleteDoc(courseRef)
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting course:', error)
    return { success: false, error: error.message }
  }
}

// 사용자의 수강 중인 강의 가져오기
export const getUserEnrollments = async (userId) => {
  try {
    const enrollmentsRef = collection(db, 'enrollments')
    const q = query(enrollmentsRef, where('userId', '==', userId))
    const snapshot = await getDocs(q)
    
    const enrollments = await Promise.all(
      snapshot.docs.map(async (enrollDoc) => {
        const enrollData = enrollDoc.data()
        const course = await getCourse(enrollData.courseId)
        
        return {
          id: enrollDoc.id,
          ...enrollData,
          course
        }
      })
    )
    
    return enrollments
  } catch (error) {
    console.error('Error getting enrollments:', error)
    return []
  }
}

// 강의 등록
export const enrollCourse = async (userId, courseId) => {
  try {
    const enrollmentsRef = collection(db, 'enrollments')
    
    // 이미 등록했는지 확인
    const q = query(
      enrollmentsRef, 
      where('userId', '==', userId),
      where('courseId', '==', courseId)
    )
    const existing = await getDocs(q)
    
    if (!existing.empty) {
      return { success: false, error: '이미 등록된 강의입니다.' }
    }
    
    await addDoc(enrollmentsRef, {
      userId,
      courseId,
      progress: 0,
      completedLectures: 0,
      totalLectures: 0,
      enrolledAt: serverTimestamp(),
      lastAccessedAt: serverTimestamp()
    })
    
    // 강의 등록 수 증가
    const courseRef = doc(db, 'courses', courseId)
    const courseSnap = await getDoc(courseRef)
    if (courseSnap.exists()) {
      await updateDoc(courseRef, {
        enrollmentCount: (courseSnap.data().enrollmentCount || 0) + 1
      })
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error enrolling course:', error)
    return { success: false, error: error.message }
  }
}
