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
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore'

// 모든 공지사항 가져오기
export const getAllNotices = async (limitCount = 50) => {
  try {
    const noticesRef = collection(db, 'notices')
    const q = query(noticesRef, orderBy('createdAt', 'desc'), limit(limitCount))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting notices:', error)
    return []
  }
}

// 특정 공지사항 가져오기
export const getNotice = async (noticeId) => {
  try {
    const noticeRef = doc(db, 'notices', noticeId)
    const noticeSnap = await getDoc(noticeRef)
    
    if (noticeSnap.exists()) {
      const noticeData = { id: noticeSnap.id, ...noticeSnap.data() }

      try {
        await updateDoc(noticeRef, {
          views: (noticeData.views || 0) + 1
        })
      } catch (err) {
        console.warn('Failed to increment notice views (ignored):', err)
      }
      
      return noticeData
    }
    return null
  } catch (error) {
    console.error('Error getting notice:', error)
    return null
  }
}

// 공지사항 생성 (관리자만)
export const createNotice = async (noticeData) => {
  try {
    const noticesRef = collection(db, 'notices')
    const docRef = await addDoc(noticesRef, {
      ...noticeData,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating notice:', error)
    return { success: false, error: error.message }
  }
}

// 공지사항 수정 (관리자만)
export const updateNotice = async (noticeId, updates) => {
  try {
    const noticeRef = doc(db, 'notices', noticeId)
    await updateDoc(noticeRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error updating notice:', error)
    return { success: false, error: error.message }
  }
}

// 공지사항 삭제 (관리자만)
export const deleteNotice = async (noticeId) => {
  try {
    const noticeRef = doc(db, 'notices', noticeId)
    await deleteDoc(noticeRef)
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting notice:', error)
    return { success: false, error: error.message }
  }
}
