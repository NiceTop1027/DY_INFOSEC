import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { getCourse, getEnrollment, isUserEnrolledInCourse, updateEnrollmentProgress } from '../services/courseService'
import { parseCurriculumContent } from '../utils/curriculum'
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  List,
  Lightbulb,
  AlertTriangle,
  Sparkles,
} from 'lucide-react'

export default function CourseLearn() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [error, setError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [savingProgress, setSavingProgress] = useState(false)
  const [progress, setProgress] = useState({ currentModule: 0, completedModules: 0, totalModules: 0 })

  useEffect(() => {
    if (!id) return

    const fetchCourse = async () => {
      try {
        setLoading(true)
        const data = await getCourse(id)
        if (!data) {
          setError('강의 정보를 찾을 수 없습니다.')
          return
        }
        setCourse(data)
      } catch (err) {
        console.error('Failed to load course:', err)
        setError('강의 정보를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id])

  useEffect(() => {
    if (!isAuthenticated || !user?.uid || !id) {
      setCheckingAccess(false)
      setHasAccess(false)
      return
    }

    const verifyEnrollment = async () => {
      try {
        setCheckingAccess(true)
        const enrolled = await isUserEnrolledInCourse(user.uid, id)
        setHasAccess(enrolled)
        if (!enrolled) {
          setError('이 강의에 등록된 사용자만 접근할 수 있습니다.')
        }
        if (enrolled) {
          const enrollment = await getEnrollment(user.uid, id)
          if (enrollment?.currentModuleIndex != null) {
            setActiveIndex(enrollment.currentModuleIndex)
          }
          setProgress({
            currentModule: enrollment?.currentModuleIndex || 0,
            completedModules: enrollment?.completedModules || 0,
            totalModules: enrollment?.totalLectures || 0,
          })
        }
      } catch (err) {
        console.error('Failed to verify enrollment:', err)
        setError('접근 권한을 확인하는 중 문제가 발생했습니다.')
        setHasAccess(false)
      } finally {
        setCheckingAccess(false)
      }
    }

    verifyEnrollment()
  }, [isAuthenticated, user?.uid, id])

  const curriculumSections = useMemo(() => {
    if (!course) return []
    const content = course.curriculumContent || course.briefingContent || ''
    return parseCurriculumContent(content)
  }, [course?.curriculumContent, course?.briefingContent])

  const sections = curriculumSections
  const totalModules = sections.length

  useEffect(() => {
    setProgress((prev) => ({
      ...prev,
      totalModules,
    }))

    if (totalModules === 0) {
      setActiveIndex(0)
      return
    }

    setActiveIndex((prev) => {
      if (prev >= totalModules) {
        return totalModules - 1
      }
      return prev
    })
  }, [totalModules])

  useEffect(() => {
    if (!checkingAccess && isAuthenticated && !hasAccess && id) {
      const timeout = setTimeout(() => {
        navigate(`/courses/${id}`)
      }, 2500)
      return () => clearTimeout(timeout)
    }
  }, [checkingAccess, isAuthenticated, hasAccess, navigate, id])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-yellow-400" />
        <p className="text-gray-400">로그인이 필요합니다.</p>
        <Link to="/login" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold">
          로그인하러 가기
        </Link>
      </div>
    )
  }

  if (loading || checkingAccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono tracking-[0.2em] uppercase">LOADING</p>
        </div>
      </div>
    )
  }

  if (error || !hasAccess) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center space-y-4 px-6">
        <AlertTriangle className="w-12 h-12 text-yellow-400" />
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-lg">{error || '접근이 제한되었습니다.'}</p>
        <Link
          to={id ? `/courses/${id}` : '/courses'}
          className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
        >
          강의 정보로 돌아가기
        </Link>
      </div>
    )
  }

  const title = course?.title || '강의'

  const goToModule = async (nextIndex) => {
    if (savingProgress || !user?.uid || !id) return
    if (nextIndex < 0 || nextIndex > totalModules - 1) return

    setActiveIndex(nextIndex)
    const newlyCompleted = Math.max(progress.completedModules || 0, nextIndex)
    setProgress((prev) => ({
      ...prev,
      currentModule: nextIndex,
      completedModules: newlyCompleted,
    }))

    try {
      setSavingProgress(true)
      await updateEnrollmentProgress(user.uid, id, {
        currentModuleIndex: nextIndex,
        completedModules: newlyCompleted,
        progress: totalModules > 0 ? Math.round(((newlyCompleted + 1) / totalModules) * 100) : 0,
        totalLectures: totalModules,
      })
    } catch (err) {
      console.error('Failed to save module progress:', err)
    } finally {
      setSavingProgress(false)
    }
  }

  const handlePrev = () => {
    goToModule(activeIndex - 1)
  }

  const handleNext = () => {
    goToModule(activeIndex + 1)
  }

  const currentSection = totalModules > 0 ? sections[activeIndex] : null
  const completedForDisplay = Math.max(progress.completedModules || 0, activeIndex)
  const progressPercent = totalModules > 0 ? Math.min(100, Math.round(((completedForDisplay + 1) / totalModules) * 100)) : 0

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <header className="border-b border-white/10 bg-black/60 backdrop-blur px-6 sm:px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <p className="text-xs text-gray-500 tracking-[0.3em]">COURSE LEARN</p>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-xs text-emerald-400 uppercase tracking-[0.3em]">ENROLLED</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 sm:px-10 py-10 space-y-10">
        <section className="bg-black/40 border border-white/10 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">커리큘럼 안내</h2>
              <p className="text-sm text-gray-400 mt-2">
                실습 중심의 모듈형 커리큘럼입니다. 각 모듈을 순서대로 진행하면서 학습 내용을 실습하세요.
              </p>
            </div>
          </div>

          {sections.length === 0 ? (
            <div className="text-gray-500 text-sm">
              커리큘럼 내용이 아직 등록되지 않았습니다. 담당자에게 문의해 주세요.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/5 border border-white/10 px-5 py-4">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Sparkles className="w-4 h-4 text-purple-300" />
                  <span>현재 모듈 {String(activeIndex + 1).padStart(2, '0')} / {totalModules.toString().padStart(2, '0')}</span>
                </div>
                <div className="w-full sm:w-1/2">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 text-right">완료율 {progressPercent}%</p>
                </div>
              </div>

              <article className="border border-white/10 bg-white/5">
                <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-mono">SECTION {String(activeIndex + 1).padStart(2, '0')}</p>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1">{currentSection?.title || `섹션 ${activeIndex + 1}`}</h3>
                    {currentSection?.summary && (
                      <p className="text-sm text-gray-400 mt-1">{currentSection.summary}</p>
                    )}
                  </div>
                  {currentSection?.steps?.length > 0 && (
                    <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                      <List className="w-4 h-4" />
                      <span>{currentSection.steps.length} 단계</span>
                    </div>
                  )}
                </div>

                <div className="px-6 py-6 space-y-6">
                  {currentSection?.body && (
                    <div 
                      className="prose prose-invert max-w-none text-sm leading-relaxed text-gray-200"
                      dangerouslySetInnerHTML={{
                        __html: currentSection.body
                          .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto my-4 rounded border border-white/10" />')
                          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
                          .replace(/```([\s\S]*?)```/g, '<pre class="bg-black/60 border border-white/10 p-4 rounded my-4 overflow-x-auto"><code>$1</code></pre>')
                          .replace(/`([^`]+)`/g, '<code class="bg-purple-500/10 border border-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-xs">$1</code>')
                          .replace(/\n/g, '<br/>')
                      }}
                    />
                  )}

                  {currentSection?.environment && (
                    <div className="bg-blue-500/5 border border-blue-500/20 px-4 py-3 text-sm text-blue-200 flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 mt-1" />
                      <div>
                        <p className="font-semibold text-blue-300">환경 구성</p>
                        <div 
                          className="prose prose-invert max-w-none leading-relaxed text-sm"
                          dangerouslySetInnerHTML={{
                            __html: currentSection.environment
                              .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto my-2 rounded" />')
                              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-300 hover:text-blue-200 underline">$1</a>')
                              .replace(/\n/g, '<br/>')
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {currentSection?.steps && currentSection.steps.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-3">
                        <List className="w-4 h-4 text-purple-300" />
                        <span>진행 단계</span>
                      </div>
                      <ol className="space-y-3 text-sm text-gray-300">
                        {currentSection.steps.map((step, stepIdx) => (
                          <li key={stepIdx} className="flex gap-3">
                            <span className="text-purple-300 font-semibold">{stepIdx + 1}.</span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {currentSection?.hints && currentSection.hints.length > 0 && (
                    <div className="bg-white/5 border border-purple-500/20 px-4 py-4 text-sm text-purple-200">
                      <div className="flex items-center gap-2 font-semibold"><Lightbulb className="w-4 h-4" /> 힌트</div>
                      <ul className="mt-3 space-y-2">
                        {currentSection.hints.map((hint, hintIdx) => (
                          <li key={hintIdx} className="leading-relaxed flex gap-2">
                            <span className="text-purple-300">•</span>
                            <span>{hint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </article>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>모듈 {activeIndex + 1}/{totalModules}</span>
                  {savingProgress && <span className="text-purple-300">저장 중...</span>}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    disabled={activeIndex === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 text-sm text-gray-300 hover:text-white hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" /> 이전
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={activeIndex === totalModules - 1}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-sm font-bold text-white hover:shadow-lg hover:shadow-purple-500/40 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    다음 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <Link to={`/courses/${id}`} className="flex items-center gap-2 hover:text-white transition">
            <ChevronLeft className="w-4 h-4" />
            강의 정보로 돌아가기
          </Link>
          <span>최종 업데이트: {course?.updatedAt?.toDate ? course.updatedAt.toDate().toLocaleString('ko-KR') : '확인 필요'}</span>
        </div>
      </main>
    </div>
  )
}
