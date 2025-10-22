import { db } from '../config/firebase'
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
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

export const getEnrollment = async (userId, courseId) => {
  if (!userId || !courseId) return null

  try {
    const enrollmentRef = doc(db, 'enrollments', `${courseId}_${userId}`)
    const snapshot = await getDoc(enrollmentRef)
    if (!snapshot.exists()) {
      return null
    }

    return { id: snapshot.id, ...snapshot.data() }
  } catch (error) {
    console.error('Error fetching enrollment:', error)
    return null
  }
}

export const updateEnrollmentProgress = async (userId, courseId, updates) => {
  if (!userId || !courseId) {
    return { success: false, error: 'Invalid enrollment identifiers' }
  }

  try {
    const enrollmentRef = doc(db, 'enrollments', `${courseId}_${userId}`)
    await updateDoc(enrollmentRef, {
      ...updates,
      lastAccessedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating enrollment progress:', error)
    return { success: false, error: error.message }
  }
}

export const getCoursesByInstructor = async (instructorId) => {
  if (!instructorId) return []

  try {
    const coursesRef = collection(db, 'courses')
    const q = query(coursesRef, where('instructorId', '==', instructorId), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }))
  } catch (error) {
    console.error('Error getting instructor courses:', error)
    return []
  }
}

export const updateCourseCurriculum = async (courseId, curriculumContent) => {
  if (!courseId) return { success: false, error: 'Invalid courseId' }

  try {
    const courseRef = doc(db, 'courses', courseId)
    await updateDoc(courseRef, {
      curriculumContent,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating curriculum:', error)
    return { success: false, error: error.message }
  }
}

export const getCourseAssignments = async (courseId) => {
  if (!courseId) return []

  try {
    const assignmentsRef = collection(db, 'courses', courseId, 'assignments')
    const q = query(assignmentsRef, orderBy('createdAt', 'asc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }))
  } catch (error) {
    console.error('Error getting assignments:', error)
    return []
  }
}

export const createCourseAssignment = async (courseId, assignmentData) => {
  if (!courseId) return { success: false, error: 'Invalid courseId' }

  try {
    const assignmentsRef = collection(db, 'courses', courseId, 'assignments')
    const docRef = await addDoc(assignmentsRef, {
      title: assignmentData.title,
      description: assignmentData.description || '',
      dueDate: assignmentData.dueDate ? Timestamp.fromDate(new Date(assignmentData.dueDate)) : null,
      points: assignmentData.points ? Number(assignmentData.points) : null,
      order: assignmentData.order ?? Date.now(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating assignment:', error)
    return { success: false, error: error.message }
  }
}

export const updateCourseAssignment = async (courseId, assignmentId, updates) => {
  if (!courseId || !assignmentId) return { success: false, error: 'Invalid assignment' }

  try {
    const assignmentRef = doc(db, 'courses', courseId, 'assignments', assignmentId)
    await updateDoc(assignmentRef, {
      ...updates,
      dueDate: updates.dueDate ? Timestamp.fromDate(new Date(updates.dueDate)) : null,
      points: updates.points ? Number(updates.points) : null,
      updatedAt: serverTimestamp()
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating assignment:', error)
    return { success: false, error: error.message }
  }
}

export const deleteCourseAssignment = async (courseId, assignmentId) => {
  if (!courseId || !assignmentId) return { success: false, error: 'Invalid assignment' }

  try {
    const assignmentRef = doc(db, 'courses', courseId, 'assignments', assignmentId)
    await deleteDoc(assignmentRef)
    return { success: true }
  } catch (error) {
    console.error('Error deleting assignment:', error)
    return { success: false, error: error.message }
  }
}

export const getCourseEnrollments = async (courseId) => {
  if (!courseId) return []

  try {
    const enrollmentsRef = collection(db, 'enrollments')
    const q = query(enrollmentsRef, where('courseId', '==', courseId))
    const snapshot = await getDocs(q)

    const enrollments = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data()
        let user = null

        try {
          if (data.userId) {
            const userRef = doc(db, 'users', data.userId)
            const userSnap = await getDoc(userRef)
            if (userSnap.exists()) {
              user = { id: userSnap.id, ...userSnap.data() }
            }
          }
        } catch (error) {
          console.error('Failed to load enrollment user profile:', error)
        }

        return {
          id: docSnap.id,
          ...data,
          user
        }
      })
    )

    return enrollments
  } catch (error) {
    console.error('Error getting enrollments:', error)
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
    const processedData = {
      ...courseData,
      maxStudents: courseData.maxStudents ? Number(courseData.maxStudents) : null,
      applicationDeadline: courseData.applicationDeadline
        ? Timestamp.fromDate(new Date(courseData.applicationDeadline))
        : null,
      instructorId: courseData.instructorId || null
    }

    const coursesRef = collection(db, 'courses')
    const docRef = await addDoc(coursesRef, {
      ...processedData,
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
    const processedUpdates = {
      ...updates,
      maxStudents: updates.maxStudents ? Number(updates.maxStudents) : null,
      applicationDeadline: updates.applicationDeadline
        ? Timestamp.fromDate(new Date(updates.applicationDeadline))
        : null,
      instructorId: updates.instructorId || null
    }

    const courseRef = doc(db, 'courses', courseId)
    await updateDoc(courseRef, {
      ...processedUpdates,
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
    const enrollmentId = `${courseId}_${userId}`
    const enrollmentRef = doc(db, 'enrollments', enrollmentId)
    const existing = await getDoc(enrollmentRef)

    if (existing.exists()) {
      return { success: false, error: '이미 등록된 강의입니다.' }
    }

    await setDoc(enrollmentRef, {
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

export const isUserEnrolledInCourse = async (userId, courseId) => {
  if (!userId || !courseId) return false

  try {
    const enrollmentRef = doc(db, 'enrollments', `${courseId}_${userId}`)
    const snapshot = await getDoc(enrollmentRef)
    return snapshot.exists()
  } catch (error) {
    console.error('Error checking enrollment:', error)
    return false
  }
}

export const enrollCourseForApplication = async ({ userId, courseId }) => {
  if (!userId || !courseId) {
    return { success: false, error: 'Invalid enrollment payload' }
  }

  try {
    const enrollmentId = `${courseId}_${userId}`
    const enrollmentRef = doc(db, 'enrollments', enrollmentId)
    const snapshot = await getDoc(enrollmentRef)

    if (snapshot.exists()) {
      return { success: true, id: snapshot.id }
    }

    await setDoc(enrollmentRef, {
      userId,
      courseId,
      progress: 0,
      completedLectures: 0,
      totalLectures: 0,
      enrolledAt: serverTimestamp(),
      lastAccessedAt: serverTimestamp(),
    })

    const courseRef = doc(db, 'courses', courseId)
    const courseSnap = await getDoc(courseRef)
    if (courseSnap.exists()) {
      await updateDoc(courseRef, {
        enrollmentCount: (courseSnap.data().enrollmentCount || 0) + 1,
        updatedAt: serverTimestamp(),
      })
    }

    return { success: true, id: enrollmentId }
  } catch (error) {
    console.error('Error enrolling from application:', error)
    return { success: false, error: error.message }
  }
}
