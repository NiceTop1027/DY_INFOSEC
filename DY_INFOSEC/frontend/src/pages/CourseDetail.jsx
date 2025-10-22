import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { getCourse, isUserEnrolledInCourse } from '../services/courseService'
import { getUserCourseApplication } from '../services/applicationService'
import CourseBriefingViewer from '../components/CourseBriefingViewer'
import { Clock, Users, BookOpen, Award, CheckCircle, Layers, Flag, Calendar, ChevronLeft, Lock } from 'lucide-react'

export default function CourseDetail() {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuthStore()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [application, setApplication] = useState(null)
  const [applicationLoading, setApplicationLoading] = useState(false)

  useEffect(() => {
    loadCourse()
  }, [id])

  useEffect(() => {
    if (!isAuthenticated || !user?.uid || !id) {
      setIsEnrolled(false)
      return
    }

    const checkEnrollment = async () => {
      try {
        const enrolled = await isUserEnrolledInCourse(user.uid, id)
        setIsEnrolled(enrolled)
      } catch (err) {
        console.error('Failed to check enrollment:', err)
        setIsEnrolled(false)
      }
    }

    checkEnrollment()
  }, [isAuthenticated, user?.uid, id, course?.updatedAt])

  useEffect(() => {
    if (!isAuthenticated || !user?.uid || !id) return
    if (isEnrolled) return

    let cancelled = false
    const poll = async () => {
      try {
        const enrolled = await isUserEnrolledInCourse(user.uid, id)
        if (!cancelled && enrolled) {
          setIsEnrolled(true)
        }
      } catch (err) {
        console.error('Failed to poll enrollment status:', err)
      }
    }

    const interval = setInterval(poll, 10000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [isAuthenticated, user?.uid, id, isEnrolled])

  const loadCourse = async () => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      const data = await getCourse(id)
      setCourse(data)
    } catch (error) {
      console.error('Failed to fetch course:', error)
      setError('강의 정보를 불러오는 중 문제가 발생했습니다.')
      setCourse(null)
    } finally {
      setLoading(false)
    }
  }

  const safeCourse = course || {}

  useEffect(() => {
    if (!isAuthenticated || !user?.uid || !id) {
      setApplication(null)
      return
    }

    const loadApplication = async () => {
      try {
        setApplicationLoading(true)
        const data = await getUserCourseApplication(user.uid, id)
        setApplication(data)
      } catch (err) {
        console.error('Failed to fetch user application:', err)
        setApplication(null)
      } finally {
        setApplicationLoading(false)
      }
    }

    loadApplication()
  }, [isAuthenticated, user?.uid, id])

  const courseTitle = safeCourse.title || '강의 정보 없음'
  const courseDescription = safeCourse.description || '강의 설명이 아직 등록되지 않았습니다.'
  const instructorName = safeCourse.instructor || '미정'

  const lectures = safeCourse.lectures || []
  const syllabusItems = typeof safeCourse.syllabus === 'string'
    ? safeCourse.syllabus.split('\n').filter(Boolean)
    : []
  const prerequisites = Array.isArray(safeCourse.prerequisites)
    ? safeCourse.prerequisites
    : (safeCourse.prerequisites ? [safeCourse.prerequisites] : [])
  const outcomes = Array.isArray(safeCourse.learningOutcomes)
    ? safeCourse.learningOutcomes
    : (safeCourse.learningOutcomes ? [safeCourse.learningOutcomes] : [])
  const benefits = Array.isArray(safeCourse.benefits)
    ? safeCourse.benefits
    : (safeCourse.benefits ? safeCourse.benefits.split('\n').filter(Boolean) : [])

  const levelLabel = (safeCourse.level || 'beginner').toString().toUpperCase()
  const categoryLabel = (safeCourse.category || 'GENERAL').toString().toUpperCase()
  const rawCapacity = safeCourse.maxStudents ?? safeCourse.capacity ?? null
  const capacity = typeof rawCapacity === 'number' && rawCapacity > 0 ? rawCapacity : null
  const enrolled = safeCourse.enrollmentCount || safeCourse.enrolledCount || 0
  const durationLabel = safeCourse.duration || `${lectures.reduce((sum, l) => sum + (l.duration || 0), 0)}분`
  const deadlineDate = (() => {
    if (!safeCourse.applicationDeadline) return null
    if (typeof safeCourse.applicationDeadline.toDate === 'function') {
      return safeCourse.applicationDeadline.toDate()
    }
    const parsed = new Date(safeCourse.applicationDeadline)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  })()
  const deadlineMillis = deadlineDate ? deadlineDate.getTime() : null
  const nowMillis = Date.now()
  const isDeadlinePassed = typeof deadlineMillis === 'number' ? nowMillis >= deadlineMillis : false
  const deadlineLabel = deadlineDate ? deadlineDate.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : '상시 모집'
  const isCourseFull = capacity ? enrolled >= capacity : false
  const applicationStatus = application?.status || null

  const APPLICATION_STATUS_META = {
    SUBMITTED: { label: '지원서 검토 중', message: '관리자가 지원서를 검토하고 있습니다.' },
    DOCUMENT_PASS: { label: '서류 합격', message: '면접 또는 추가 안내를 기다려 주세요.' },
    DOCUMENT_FAIL: { label: '서류 불합격', message: '아쉽게도 이번 과정에는 참여하실 수 없습니다.' },
    INTERVIEW_SCHEDULED: { label: '면접 예정', message: '면접 일정을 확인하고 준비해 주세요.' },
    FINAL_PASS: { label: '최종 합격', message: '등록 확정 전까지 학습 콘텐츠는 잠시 잠겨 있습니다.' },
    FINAL_FAIL: { label: '최종 불합격', message: '다음 기회를 기약해 주세요.' },
    ENROLLED: { label: '등록 완료', message: '학습 콘텐츠가 곧 열립니다. 잠시 후 다시 확인해 주세요.' }
  }

  const applicationStatusMeta = applicationStatus ? APPLICATION_STATUS_META[applicationStatus] : null

  let applyDisabledReason = ''
  if (isEnrolled) {
    applyDisabledReason = '이미 수강 등록이 완료되었습니다.'
  } else if (applicationStatus === 'ENROLLED') {
    applyDisabledReason = '등록이 완료되었습니다. 잠시 후 학습이 열립니다.'
  } else if (applicationStatus === 'FINAL_PASS') {
    applyDisabledReason = '최종 합격되었습니다. 관리자 등록 확정을 기다려 주세요.'
  } else if (applicationStatus && applicationStatus !== 'FINAL_FAIL') {
    applyDisabledReason = '이미 지원이 진행 중입니다.'
  } else if (applicationStatus === 'FINAL_FAIL' || applicationStatus === 'DOCUMENT_FAIL') {
    applyDisabledReason = '해당 강의 신청이 종료되었습니다.'
  } else if (isDeadlinePassed) {
    applyDisabledReason = '신청 기간이 종료된 강의입니다.'
  } else if (isCourseFull) {
    applyDisabledReason = '정원이 마감된 강의입니다.'
  }

  const isApplyDisabled = Boolean(applyDisabledReason)

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono tracking-[0.2em]">LOADING</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-2xl font-black text-white mb-3">COURSE NOT FOUND</p>
          <p className="text-gray-500 mb-6">{error || '요청하신 강의를 찾을 수 없습니다.'}</p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold tracking-wide hover:shadow-lg hover:shadow-purple-500/40 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            강의 목록으로
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link to="/courses" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              BACK TO COURSES
            </Link>
            <div className="flex items-center gap-2">
              <span className="px-4 py-1 bg-purple-500/20 border border-purple-500/50 text-purple-300 text-xs font-bold tracking-widest">
                {categoryLabel}
              </span>
              <span className="px-4 py-1 bg-blue-500/20 border border-blue-500/50 text-blue-300 text-xs font-bold tracking-widest">
                {levelLabel}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-300" />
              <span>{safeCourse.updatedAt?.toDate?.().toLocaleDateString?.() || safeCourse.updatedAt || '업데이트 정보 없음'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-10">
              <h1 className="text-4xl font-black text-white mb-4 leading-tight">{courseTitle}</h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">{courseDescription}</p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-300" />
                  <span className="font-mono">{durationLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-300" />
                  <span className="font-mono">{enrolled}/{capacity || '-'}명</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-300" />
                  <span className="font-semibold text-white/90">{instructorName}</span>
                </div>
              </div>
            </div>

            {isEnrolled ? (
              <>
                <CourseBriefingViewer course={course} />
                <div className="bg-black/20 border border-white/10 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Layers className="w-5 h-5 text-purple-300" />
                    <h2 className="text-2xl font-black text-white">LECTURE PLAYLIST</h2>
                  </div>
                  {lectures.length > 0 ? (
                    <div className="space-y-3">
                      {lectures.map((lecture, index) => (
                        <div key={lecture.id || index} className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold">
                              {String(index + 1).padStart(2, '0')}
                            </div>
                            <div>
                              <p className="text-white font-semibold">{lecture.title}</p>
                              {lecture.summary && <p className="text-xs text-gray-500 mt-1">{lecture.summary}</p>}
                            </div>
                          </div>
                          <span className="text-sm text-gray-400 font-mono">{lecture.duration ? `${lecture.duration}분` : '시간 미정'}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">등록된 세부 강의가 없습니다.</div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/20 border border-white/10 p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Flag className="w-5 h-5 text-blue-300" />
                      <h2 className="text-xl font-black text-white">SYLLABUS</h2>
                    </div>
                    {syllabusItems.length > 0 ? (
                      <ul className="space-y-3 text-gray-400 text-sm">
                        {syllabusItems.map((item, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="text-purple-300 font-mono">{String(idx + 1).padStart(2, '0')}</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">강의 계획 정보가 등록되지 않았습니다.</p>
                    )}
                  </div>

                  <div className="bg-black/20 border border-white/10 p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-300" />
                      <h2 className="text-xl font-black text-white">LEARNING OUTCOMES</h2>
                    </div>
                    {outcomes.length > 0 ? (
                      <ul className="space-y-2 text-gray-400 text-sm">
                        {outcomes.map((item, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-green-300">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">학습 목표 정보가 없습니다.</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/20 border border-white/10 p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Layers className="w-5 h-5 text-cyan-300" />
                      <h2 className="text-xl font-black text-white">PREREQUISITES</h2>
                    </div>
                    {prerequisites.length > 0 ? (
                      <ul className="space-y-2 text-gray-400 text-sm">
                        {prerequisites.map((item, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-cyan-300">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">선수 지식 정보가 없습니다.</p>
                    )}
                  </div>

                  <div className="bg-black/20 border border-white/10 p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="w-5 h-5 text-yellow-300" />
                      <h2 className="text-xl font-black text-white">BENEFITS</h2>
                    </div>
                    {benefits.length > 0 ? (
                      <ul className="space-y-2 text-gray-400 text-sm">
                        {benefits.map((item, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-yellow-300">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">등록된 혜택 정보가 없습니다.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-black/20 border border-white/10 p-10 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-purple-300" />
                </div>
                <h2 className="text-2xl font-black text-white">학습 콘텐츠 잠금 상태</h2>
                {applicationStatusMeta ? (
                  <p className="text-gray-400 max-w-xl">
                    {applicationStatusMeta.message}
                  </p>
                ) : (
                  <p className="text-gray-400 max-w-xl">
                    이 강의의 세부 커리큘럼과 학습 자료는 관리자 최종 합격 처리 후 열람할 수 있습니다.
                    {applyDisabledReason && (
                      <>
                        <br />
                        <span className="text-purple-300">{applyDisabledReason}</span>
                      </>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 sticky top-8">
              <div className="aspect-video bg-gradient-to-br from-purple-500/60 to-blue-500/60 border border-white/20 flex items-center justify-center mb-6">
                <BookOpen className="w-16 h-16 text-white" />
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>수강 인원</span>
                  <span className="font-semibold text-white">{enrolled}/{capacity || '-'}명</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>강의 시간</span>
                  <span className="font-semibold text-white">{durationLabel}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>난이도</span>
                  <span className="font-semibold text-white">{levelLabel}</span>
                </div>
              </div>

              <div className="space-y-3">
                {isEnrolled ? (
                  <Link
                    to="/my-classroom"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold tracking-wide hover:shadow-lg hover:shadow-blue-500/40 transition-all"
                  >
                    학습 바로가기
                  </Link>
                ) : (
                  <>
                    {isAuthenticated ? (
                      isApplyDisabled || applicationLoading ? (
                        <button
                          type="button"
                          disabled
                          className="w-full inline-flex items-center justify-center px-6 py-3 font-bold tracking-wide bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed"
                        >
                          {applicationLoading ? '상태 확인 중...' : (applicationStatus === 'FINAL_PASS' ? '등록 대기 중' : applicationStatus === 'ENROLLED' ? '등록 완료' : '지원 불가')}
                        </button>
                      ) : (
                        <Link
                          to={`/applications/new/${safeCourse.id || id}`}
                          className="w-full inline-flex items-center justify-center px-6 py-3 font-bold tracking-wide bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/40 transition-all"
                        >
                          지원 신청하기
                        </Link>
                      )
                    ) : (
                      <Link
                        to="/login"
                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold tracking-wide hover:shadow-lg hover:shadow-purple-500/40 transition-all"
                      >
                        로그인하고 신청하기
                      </Link>
                    )}
                    {applyDisabledReason && (
                      <p className="text-xs text-gray-500 text-center">{applyDisabledReason}</p>
                    )}
                  </>
                )}
              </div>

              <div className="mt-8 border border-white/10 p-6">
                <h3 className="font-semibold text-white mb-4 tracking-wide">COURSE BENEFITS</h3>
                {benefits.length > 0 ? (
                  <ul className="text-sm text-gray-400 space-y-2">
                    {benefits.map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-purple-300">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">혜택 정보가 아직 준비 중입니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
