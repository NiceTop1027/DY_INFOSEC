import { useEffect, useMemo, useState } from 'react'
import { NavLink, Routes, Route, Navigate, useParams, useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, BookOpen, PenSquare, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { getCoursesByInstructor, updateCourseCurriculum } from '../../services/courseService'
import { parseCurriculumContent } from '../../utils/curriculum'

export default function InstructorDashboard() {
  const { user } = useAuthStore()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user?.uid) return

    let mounted = true
    const load = async () => {
      try {
        setLoading(true)
        const data = await getCoursesByInstructor(user.uid)
        if (mounted) {
          setCourses(data)
          setError(null)
        }
      } catch (err) {
        console.error('Failed to load instructor courses:', err)
        if (mounted) {
          setError('강의 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [user?.uid])

  const navItems = [
    { to: '', label: '개요', icon: LayoutDashboard, end: true },
    { to: 'courses', label: '내 강좌', icon: BookOpen }
  ]

  if (!user?.uid) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-sm text-blue-300 tracking-[0.3em] uppercase">Instructor Console</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-2">강사 전용 관리</h1>
          <p className="text-gray-400 mt-3 text-sm sm:text-base">담당 강좌의 커리큘럼과 학습 자료를 직접 업데이트해 주세요.</p>
        </div>

        <div className="grid lg:grid-cols-[240px,1fr] gap-6">
          <aside className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 border border-white/10 transition-all ${
                      isActive
                        ? 'bg-white/10 text-white border-blue-500/40'
                        : 'bg-black/40 hover:bg-white/5 text-gray-300'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-semibold tracking-wide text-sm">{item.label}</span>
                </NavLink>
              )
            })}
          </aside>

          <section className="bg-black/40 border border-white/10 min-h-[480px]">
            <Routes>
              <Route index element={<InstructorOverview courses={courses} loading={loading} error={error} />} />
              <Route path="courses" element={<InstructorCourses courses={courses} loading={loading} error={error} />} />
              <Route
                path="courses/:courseId"
                element={
                  <InstructorCourseCurriculumEditor
                    courses={courses}
                    loading={loading}
                    onCurriculumUpdated={async () => {
                      if (!user?.uid) return
                      const refreshed = await getCoursesByInstructor(user.uid)
                      setCourses(refreshed)
                    }}
                  />
                }
              />
              <Route path="*" element={<Navigate to="" replace />} />
            </Routes>
          </section>
        </div>
      </div>
    </div>
  )
}

function InstructorOverview({ courses, loading, error }) {
  const activeCourses = courses.filter((course) => course.isActive).length
  const totalStudents = courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0)

  return (
    <div className="p-8">
      <h2 className="text-2xl font-black text-white mb-6">대시보드</h2>
      {loading ? (
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>강의 정보를 불러오는 중입니다...</span>
        </div>
      ) : error ? (
        <p className="text-red-400 text-sm">{error}</p>
      ) : (
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-black/60 border border-blue-500/20 p-6">
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">총 강좌 수</p>
            <p className="text-3xl font-black text-white mt-3">{courses.length}</p>
          </div>
          <div className="bg-black/60 border border-purple-500/20 p-6">
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">활성 강좌</p>
            <p className="text-3xl font-black text-purple-200 mt-3">{activeCourses}</p>
          </div>
          <div className="bg-black/60 border border-emerald-500/20 p-6">
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">누적 수강생</p>
            <p className="text-3xl font-black text-emerald-200 mt-3">{totalStudents}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function InstructorCourses({ courses, loading, error }) {
  if (loading) {
    return (
      <div className="p-8 flex items-center gap-3 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>강의 정보를 불러오는 중입니다...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  if (!courses.length) {
    return (
      <div className="p-8">
        <div className="border border-white/10 bg-black/60 p-8 text-center">
          <BookOpen className="w-10 h-10 text-blue-300 mx-auto mb-4" />
          <p className="text-gray-400">등록된 강좌가 없습니다. 관리자에게 강좌 배정을 요청해 주세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">내 강좌</h2>
        <p className="text-xs text-gray-500">총 {courses.length}개 과정</p>
      </div>

      <div className="grid gap-5">
        {courses.map((course) => (
          <Link
            key={course.id}
            to={`courses/${course.id}`}
            className="group bg-black/60 border border-white/10 hover:border-blue-500/40 transition-all p-6 block"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 tracking-[0.3em]">COURSE</p>
                <h3 className="text-xl font-bold text-white mt-1">{course.title || '제목 미정'}</h3>
                <p className="text-sm text-gray-400 mt-3 line-clamp-2">{course.description || '등록된 강의 설명이 없습니다.'}</p>
              </div>
              <PenSquare className="w-5 h-5 text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-6 text-xs text-gray-400">
              <div>
                <span className="text-gray-500">진행 상태</span>
                <p className="mt-1 font-semibold text-white">{course.isActive ? '운영 중' : '비활성'}</p>
              </div>
              <div>
                <span className="text-gray-500">등록 인원</span>
                <p className="mt-1 font-semibold text-white">{course.enrollmentCount || 0}명</p>
              </div>
              <div>
                <span className="text-gray-500">마지막 업데이트</span>
                <p className="mt-1 font-semibold text-white/80">
                  {course.updatedAt?.toDate ? course.updatedAt.toDate().toLocaleString('ko-KR') : '기록 없음'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function InstructorCourseCurriculumEditor({ courses, loading, onCurriculumUpdated }) {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)

  useEffect(() => {
    if (!loading) {
      const target = courses.find((course) => course.id === courseId)
      setContent(target?.curriculumContent || '')
    }
  }, [loading, courses, courseId])

  const sections = useMemo(() => parseCurriculumContent(content), [content])
  const course = courses.find((c) => c.id === courseId)

  const handleSave = async () => {
    if (!courseId) return
    try {
      setSaving(true)
      const result = await updateCourseCurriculum(courseId, content)
      if (!result.success) {
        throw new Error(result.error || '커리큘럼 저장 실패')
      }
      setSaveMessage('커리큘럼이 저장되었습니다.')
      await onCurriculumUpdated()
    } catch (err) {
      console.error('Failed to save curriculum:', err)
      setSaveMessage('커리큘럼 저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMessage(null), 3500)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-3 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>강의 정보를 불러오는 중입니다...</span>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="p-8 space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-300 border border-white/10 hover:bg-white/5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          강좌 목록으로 돌아가기
        </button>
        <p className="text-gray-400">선택한 강좌를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 border-t border-white/10">
      <div className="p-8 space-y-4 border-b lg:border-b-0 lg:border-r border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-300 border border-white/10 hover:bg-white/5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          강좌 목록으로 돌아가기
        </button>

        <div>
          <p className="text-xs text-gray-500 tracking-[0.3em]">CURRICULUM EDITOR</p>
          <h2 className="text-2xl font-black text-white mt-2">{course.title || '제목 미정'}</h2>
          <p className="text-sm text-gray-400 mt-2">
            모듈형 커리큘럼을 작성하세요. JSON 배열 또는 `---` 구분 텍스트 형식을 지원합니다.
          </p>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={18}
          className="w-full bg-black/60 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-blue-500 transition"
          placeholder={`---\nTitle: 미션 소개\nSummary: 과정 개요\n- Step 1\n- Step 2`}
        />

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {saving ? '저장 중...' : '커리큘럼 저장'}
          </button>
          {saveMessage && <p className="text-sm text-gray-400">{saveMessage}</p>}
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div>
          <p className="text-xs text-gray-500 tracking-[0.3em]">PREVIEW</p>
          <h3 className="text-xl font-black text-white mt-2">학습자 미리보기</h3>
        </div>

        {sections.length === 0 ? (
          <p className="text-gray-500 text-sm">커리큘럼 섹션이 없습니다. 왼쪽 편집 영역에 내용을 입력해 주세요.</p>
        ) : (
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="border border-white/10 bg-black/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-mono">SECTION {String(index + 1).padStart(2, '0')}</p>
                    <h4 className="text-lg font-bold text-white mt-1">{section.title || `섹션 ${index + 1}`}</h4>
                    {section.summary && <p className="text-sm text-gray-400 mt-1">{section.summary}</p>}
                  </div>
                </div>

                {section.body && (
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line mt-4">{section.body}</p>
                )}

                {section.steps && section.steps.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 uppercase tracking-[0.2em]">Steps</p>
                    <ul className="mt-2 space-y-2 text-sm text-gray-300">
                      {section.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex gap-3">
                          <span className="text-blue-300 font-semibold">{stepIndex + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {section.hints && section.hints.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-purple-400 uppercase tracking-[0.2em]">Hints</p>
                    <ul className="mt-2 space-y-2 text-sm text-purple-200">
                      {section.hints.map((hint, hintIndex) => (
                        <li key={hintIndex} className="flex gap-2">
                          <span className="text-purple-300">•</span>
                          <span>{hint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
