const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// 관리자 이메일 목록 (서버 측에서만 관리)
const ADMIN_EMAILS = ['mistarcodm@gmail.com'];

/**
 * 사용자 생성 시 자동으로 역할 할당
 * 클라이언트에서 역할을 조작할 수 없도록 서버에서만 처리
 */
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    const email = user.email?.toLowerCase();
    const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'student';
    
    // Firestore에 사용자 프로필 생성
    await db.collection('users').doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || email.split('@')[0],
      photoURL: user.photoURL || null,
      role: role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      studentInfo: {
        grade: null,
        class: null,
        studentNumber: null,
        phone: null,
      },
      enrollments: [],
      submissions: [],
    });
    
    // Custom Claims 설정 (더 강력한 보안)
    await admin.auth().setCustomUserClaims(user.uid, { role });
    
    console.log(`User ${user.email} created with role: ${role}`);
    return { success: true, role };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create user profile');
  }
});

/**
 * 역할 확인 함수 (서버 측)
 */
async function checkUserRole(uid, requiredRole) {
  const userDoc = await db.collection('users').doc(uid).get();
  
  if (!userDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'User not found');
  }
  
  const userData = userDoc.data();
  const roleHierarchy = {
    admin: 3,
    teacher: 2,
    student: 1,
  };
  
  return roleHierarchy[userData.role] >= roleHierarchy[requiredRole];
}

/**
 * 강의 생성 (관리자만)
 */
exports.createCourse = functions.https.onCall(async (data, context) => {
  // 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  // 관리자 권한 확인
  const isAdmin = await checkUserRole(context.auth.uid, 'admin');
  if (!isAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can create courses');
  }
  
  try {
    const courseData = {
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      enrollmentCount: 0,
      isActive: true,
    };
    
    const docRef = await db.collection('courses').add(courseData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating course:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create course');
  }
});

/**
 * 강의 수정 (관리자만)
 */
exports.updateCourse = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const isAdmin = await checkUserRole(context.auth.uid, 'admin');
  if (!isAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can update courses');
  }
  
  try {
    const { courseId, updates } = data;
    await db.collection('courses').doc(courseId).update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating course:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update course');
  }
});

/**
 * 강의 삭제 (관리자만)
 */
exports.deleteCourse = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const isAdmin = await checkUserRole(context.auth.uid, 'admin');
  if (!isAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can delete courses');
  }
  
  try {
    await db.collection('courses').doc(data.courseId).delete();
    return { success: true };
  } catch (error) {
    console.error('Error deleting course:', error);
    throw new functions.https.HttpsError('internal', 'Failed to delete course');
  }
});

/**
 * 공지사항 생성 (관리자만)
 */
exports.createNotice = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const isAdmin = await checkUserRole(context.auth.uid, 'admin');
  if (!isAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can create notices');
  }
  
  try {
    const noticeData = {
      ...data,
      authorId: context.auth.uid,
      views: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    const docRef = await db.collection('notices').add(noticeData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating notice:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create notice');
  }
});

/**
 * 공지사항 수정 (관리자만)
 */
exports.updateNotice = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const isAdmin = await checkUserRole(context.auth.uid, 'admin');
  if (!isAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can update notices');
  }
  
  try {
    const { noticeId, updates } = data;
    await db.collection('notices').doc(noticeId).update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating notice:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update notice');
  }
});

/**
 * 공지사항 삭제 (관리자만)
 */
exports.deleteNotice = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const isAdmin = await checkUserRole(context.auth.uid, 'admin');
  if (!isAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can delete notices');
  }
  
  try {
    await db.collection('notices').doc(data.noticeId).delete();
    return { success: true };
  } catch (error) {
    console.error('Error deleting notice:', error);
    throw new functions.https.HttpsError('internal', 'Failed to delete notice');
  }
});

/**
 * 사용자 역할 변경 (관리자만)
 */
exports.updateUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const isAdmin = await checkUserRole(context.auth.uid, 'admin');
  if (!isAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can update user roles');
  }
  
  try {
    const { userId, newRole } = data;
    
    // Firestore 업데이트
    await db.collection('users').doc(userId).update({
      role: newRole,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // Custom Claims 업데이트
    await admin.auth().setCustomUserClaims(userId, { role: newRole });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update user role');
  }
});

/**
 * 강의 등록 (학생)
 */
exports.enrollCourse = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  try {
    const { courseId } = data;
    const userId = context.auth.uid;
    
    // 이미 등록했는지 확인
    const enrollmentQuery = await db.collection('enrollments')
      .where('userId', '==', userId)
      .where('courseId', '==', courseId)
      .get();
    
    if (!enrollmentQuery.empty) {
      throw new functions.https.HttpsError('already-exists', 'Already enrolled in this course');
    }
    
    // 등록 생성
    await db.collection('enrollments').add({
      userId,
      courseId,
      progress: 0,
      completedLectures: 0,
      totalLectures: 0,
      enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
      lastAccessedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // 강의 등록 수 증가
    const courseRef = db.collection('courses').doc(courseId);
    await courseRef.update({
      enrollmentCount: admin.firestore.FieldValue.increment(1),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error enrolling course:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * 신청서 상태 업데이트 (관리자만)
 */
exports.updateApplicationStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const isAdmin = await checkUserRole(context.auth.uid, 'admin');
  if (!isAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can update application status');
  }
  
  try {
    const { applicationId, status, note } = data;
    
    await db.collection('applications').doc(applicationId).update({
      status,
      statusNote: note || '',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating application status:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update application status');
  }
});
