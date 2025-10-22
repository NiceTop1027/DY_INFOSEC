import { httpsCallable } from 'firebase/functions'
import { functions } from '../config/firebase'

// 공지사항 Functions
export const createNoticeFunction = httpsCallable(functions, 'createNotice')
export const updateNoticeFunction = httpsCallable(functions, 'updateNotice')
export const deleteNoticeFunction = httpsCallable(functions, 'deleteNotice')

// 강의 Functions
export const createCourseFunction = httpsCallable(functions, 'createCourse')
export const updateCourseFunction = httpsCallable(functions, 'updateCourse')
export const deleteCourseFunction = httpsCallable(functions, 'deleteCourse')

// 사용자 역할 Functions
export const updateUserRoleFunction = httpsCallable(functions, 'updateUserRole')

// 수강 신청 Functions
export const enrollCourseFunction = httpsCallable(functions, 'enrollCourse')
export const updateApplicationStatusFunction = httpsCallable(functions, 'updateApplicationStatus')
export const confirmEnrollmentFunction = httpsCallable(functions, 'confirmEnrollment')
