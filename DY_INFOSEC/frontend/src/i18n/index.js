import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 번역 데이터
const translations = {
  ko: {
    // Navbar
    nav: {
      courses: '교육과정',
      notice: '공지사항',
      faq: 'FAQ',
      admin: '관리자',
      classroom: '나의 강의실',
      apply: '지원신청',
      login: '로그인',
      signup: '회원가입',
      profile: '프로필',
      dashboard: '대시보드',
      adminPanel: '관리자 패널',
      logout: '로그아웃',
    },
    
    // Home
    home: {
      title: '사이버 보안 교육의',
      titleHighlight: '새로운 시작',
      subtitle: '실무 중심의 화이트햇 해킹 교육으로 미래의 보안 전문가가 되어보세요',
      getStarted: '시작하기',
      learnMore: '더 알아보기',
      stats: {
        students: '수강생',
        courses: '교육과정',
        completion: '수료율',
        satisfaction: '만족도',
      },
      features: {
        title: '왜 DY_WHITEHAT인가?',
        practical: {
          title: '실무 중심 교육',
          desc: '실제 보안 시나리오를 기반으로 한 실습 중심 커리큘럼',
        },
        expert: {
          title: '전문가 멘토링',
          desc: '현직 보안 전문가의 1:1 멘토링 및 피드백',
        },
        certificate: {
          title: '공인 자격증',
          desc: '교육 수료 후 공인된 보안 자격증 취득 지원',
        },
      },
    },
    
    // Dashboard
    dashboard: {
      title: '대시보드',
      welcome: '환영합니다',
      enrolledCourses: '수강 중인 강의',
      completed: '완료',
      applications: '지원신청',
      avgProgress: '평균 진도',
      recentCourses: '최근 수강 과정',
      quickLinks: '바로가기',
      myClassroom: '나의 강의실',
      profile: '마이페이지',
      noEnrollments: '수강 중인 강의가 없습니다.',
      browseCourses: '강의 둘러보기',
      startLearning: '학습하기',
    },
    
    // My Classroom
    classroom: {
      title: '나의 강의실',
      subtitle: '수강 중인 과정과 학습 현황을 확인하세요',
      tabs: {
        courses: '수강 과정',
        assignments: '과제',
        projects: '프로젝트',
        certificates: '수료증',
      },
      progress: '진도',
      lectures: '강의',
      completed: '완료',
      noAssignments: '제출할 과제가 없습니다.',
      noProjects: '진행 중인 프로젝트가 없습니다.',
      noCertificates: '발급된 수료증이 없습니다.',
    },
    
    // Applications
    applications: {
      title: '지원 신청',
      subtitle: '교육과정 지원 현황을 확인하세요',
      newApplication: '새 과정 지원하기',
      noApplications: '지원한 과정이 없습니다.',
      browseCourses: '교육과정 둘러보기',
      applicationNumber: '지원번호',
      applicationDate: '지원일',
      viewDetails: '상세보기',
      status: {
        submitted: '서류 심사 중',
        documentPass: '서류 합격',
        documentFail: '서류 불합격',
        interviewScheduled: '면접 예정',
        finalPass: '최종 합격',
        finalFail: '최종 불합격',
      },
    },
    
    // Profile
    profile: {
      title: '마이페이지',
      subtitle: '계정 정보를 관리하세요',
      tabs: {
        profile: '프로필',
        security: '보안',
        notifications: '알림 설정',
        privacy: '개인정보',
      },
      profileInfo: '프로필 정보',
      displayName: '표시 이름',
      email: '이메일',
      role: '역할',
      userId: '사용자 ID',
      phone: '전화번호',
      save: '저장',
      cancel: '취소',
      success: '프로필이 업데이트되었습니다.',
      error: '업데이트에 실패했습니다.',
    },
    
    // Admin
    admin: {
      title: '관리자 패널',
      welcome: '환영합니다',
      stats: {
        totalUsers: '전체 사용자',
        totalCourses: '전체 강의',
        totalNotices: '전체 공지',
        totalApplications: '신청서',
      },
      userManagement: '사용자 관리',
      name: '이름',
      email: '이메일',
      role: '역할',
      joined: '가입일',
      actions: '작업',
      view: '보기',
      quickActions: '빠른 작업',
      manageCourses: '강의 관리',
      manageNotices: '공지사항 관리',
      manageApplications: '신청서 관리',
      createEdit: '생성 및 수정',
      postAnnouncements: '공지 작성',
      reviewApplications: '신청서 검토',
    },
    
    // Manage Courses
    manageCourses: {
      title: '강의 관리',
      backToAdmin: '관리자로 돌아가기',
      addNew: '새 강의 추가',
      edit: '수정',
      delete: '삭제',
      enrolled: '등록',
      students: '명',
      active: '활성',
      inactive: '비활성',
      newCourse: '새 강의',
      editCourse: '강의 수정',
      courseTitle: '강의 제목',
      description: '설명',
      category: '카테고리',
      level: '난이도',
      duration: '기간',
      instructor: '강사',
      beginner: '초급',
      intermediate: '중급',
      advanced: '고급',
      create: '생성',
      update: '수정',
      cancel: '취소',
      confirmDelete: '정말 이 강의를 삭제하시겠습니까?',
    },
    
    // Manage Notices
    manageNotices: {
      title: '공지사항 관리',
      backToAdmin: '관리자로 돌아가기',
      addNew: '새 공지 작성',
      edit: '수정',
      delete: '삭제',
      pinned: '고정됨',
      author: '작성자',
      date: '작성일',
      views: '조회수',
      newNotice: '새 공지',
      editNotice: '공지 수정',
      title: '제목',
      content: '내용',
      category: '카테고리',
      pinToTop: '상단 고정',
      categories: {
        general: '일반',
        event: '이벤트',
        update: '업데이트',
        important: '중요',
      },
      create: '작성',
      update: '수정',
      cancel: '취소',
      confirmDelete: '정말 이 공지사항을 삭제하시겠습니까?',
    },
    
    // Common
    common: {
      loading: '로딩 중...',
      save: '저장',
      cancel: '취소',
      edit: '수정',
      delete: '삭제',
      create: '생성',
      update: '업데이트',
      search: '검색',
      filter: '필터',
      sort: '정렬',
      close: '닫기',
      confirm: '확인',
      yes: '예',
      no: '아니오',
    },
  },
  
  en: {
    // Navbar
    nav: {
      courses: 'COURSES',
      notice: 'NOTICE',
      faq: 'FAQ',
      admin: 'ADMIN',
      classroom: 'CLASSROOM',
      apply: 'APPLY',
      login: 'LOGIN',
      signup: 'SIGN UP',
      profile: 'Profile',
      dashboard: 'Dashboard',
      adminPanel: 'Admin Panel',
      logout: 'Logout',
    },
    
    // Home
    home: {
      title: 'A New Beginning in',
      titleHighlight: 'Cybersecurity Education',
      subtitle: 'Become a future security expert with practical white hat hacking education',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      stats: {
        students: 'Students',
        courses: 'Courses',
        completion: 'Completion',
        satisfaction: 'Satisfaction',
      },
      features: {
        title: 'Why DY_WHITEHAT?',
        practical: {
          title: 'Practical Training',
          desc: 'Hands-on curriculum based on real security scenarios',
        },
        expert: {
          title: 'Expert Mentoring',
          desc: '1:1 mentoring and feedback from active security professionals',
        },
        certificate: {
          title: 'Certification',
          desc: 'Support for obtaining certified security qualifications after completion',
        },
      },
    },
    
    // Dashboard
    dashboard: {
      title: 'DASHBOARD',
      welcome: 'Welcome back',
      enrolledCourses: 'ENROLLED COURSES',
      completed: 'COMPLETED',
      applications: 'APPLICATIONS',
      avgProgress: 'AVG PROGRESS',
      recentCourses: 'RECENT COURSES',
      quickLinks: 'QUICK LINKS',
      myClassroom: 'My Classroom',
      profile: 'My Profile',
      noEnrollments: 'No enrolled courses.',
      browseCourses: 'Browse Courses',
      startLearning: 'Start Learning',
    },
    
    // My Classroom
    classroom: {
      title: 'MY CLASSROOM',
      subtitle: 'Check your enrolled courses and learning progress',
      tabs: {
        courses: 'Courses',
        assignments: 'Assignments',
        projects: 'Projects',
        certificates: 'Certificates',
      },
      progress: 'Progress',
      lectures: 'lectures',
      completed: 'completed',
      noAssignments: 'No assignments to submit.',
      noProjects: 'No ongoing projects.',
      noCertificates: 'No certificates issued.',
    },
    
    // Applications
    applications: {
      title: 'APPLICATIONS',
      subtitle: 'Check your course application status',
      newApplication: 'Apply for New Course →',
      noApplications: 'No applications submitted.',
      browseCourses: 'Browse Courses',
      applicationNumber: 'Application No.',
      applicationDate: 'Applied on',
      viewDetails: 'View Details →',
      status: {
        submitted: 'Under Review',
        documentPass: 'Document Passed',
        documentFail: 'Document Failed',
        interviewScheduled: 'Interview Scheduled',
        finalPass: 'Final Pass',
        finalFail: 'Final Fail',
      },
    },
    
    // Profile
    profile: {
      title: 'MY PROFILE',
      subtitle: 'Manage your account information',
      tabs: {
        profile: 'Profile',
        security: 'Security',
        notifications: 'Notifications',
        privacy: 'Privacy',
      },
      profileInfo: 'PROFILE INFO',
      displayName: 'DISPLAY NAME',
      email: 'EMAIL',
      role: 'ROLE',
      userId: 'USER ID',
      phone: 'PHONE',
      save: 'Save',
      cancel: 'Cancel',
      success: 'Profile updated successfully.',
      error: 'Failed to update profile.',
    },
    
    // Admin
    admin: {
      title: 'ADMIN PANEL',
      welcome: 'Welcome',
      stats: {
        totalUsers: 'Total Users',
        totalCourses: 'Total Courses',
        totalNotices: 'Total Notices',
        totalApplications: 'Applications',
      },
      userManagement: 'USER MANAGEMENT',
      name: 'NAME',
      email: 'EMAIL',
      role: 'ROLE',
      joined: 'JOINED',
      actions: 'ACTIONS',
      view: 'View',
      quickActions: 'QUICK ACTIONS',
      manageCourses: 'Manage Courses',
      manageNotices: 'Manage Notices',
      manageApplications: 'Manage Applications',
      createEdit: 'Create and edit courses',
      postAnnouncements: 'Post announcements',
      reviewApplications: 'Review student applications',
    },
    
    // Manage Courses
    manageCourses: {
      title: 'MANAGE COURSES',
      backToAdmin: '← Back to Admin',
      addNew: 'Add New Course',
      edit: 'Edit',
      delete: 'Delete',
      enrolled: 'Enrolled',
      students: 'students',
      active: 'ACTIVE',
      inactive: 'INACTIVE',
      newCourse: 'NEW COURSE',
      editCourse: 'EDIT COURSE',
      courseTitle: 'TITLE',
      description: 'DESCRIPTION',
      category: 'CATEGORY',
      level: 'LEVEL',
      duration: 'DURATION',
      instructor: 'INSTRUCTOR',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      create: 'Create',
      update: 'Update',
      cancel: 'Cancel',
      confirmDelete: 'Are you sure you want to delete this course?',
    },
    
    // Manage Notices
    manageNotices: {
      title: 'MANAGE NOTICES',
      backToAdmin: '← Back to Admin',
      addNew: 'Write New Notice',
      edit: 'Edit',
      delete: 'Delete',
      pinned: 'PINNED',
      author: 'Author',
      date: 'Date',
      views: 'Views',
      newNotice: 'NEW NOTICE',
      editNotice: 'EDIT NOTICE',
      title: 'TITLE',
      content: 'CONTENT',
      category: 'CATEGORY',
      pinToTop: 'PIN TO TOP',
      categories: {
        general: 'General',
        event: 'Event',
        update: 'Update',
        important: 'Important',
      },
      create: 'Create',
      update: 'Update',
      cancel: 'Cancel',
      confirmDelete: 'Are you sure you want to delete this notice?',
    },
    
    // Common
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      create: 'Create',
      update: 'Update',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      close: 'Close',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
    },
  },
}

// 언어 스토어
export const useLanguageStore = create(
  persist(
    (set, get) => ({
      language: 'ko',
      
      setLanguage: (lang) => set({ language: lang }),
      
      t: (key) => {
        const lang = get().language
        const keys = key.split('.')
        let value = translations[lang]
        
        for (const k of keys) {
          value = value?.[k]
        }
        
        return value || key
      },
    }),
    {
      name: 'language-storage',
    }
  )
)
