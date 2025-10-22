import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../store/authStore'
import { getCourse } from '../services/courseService'
import { createApplication } from '../services/applicationService'
import { FileText, Loader2, ArrowLeft, Send } from 'lucide-react'

export default function ApplicationForm() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [error, setError] = useState('')
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true)
        const data = await getCourse(courseId)
        setCourse(data)
      } catch (err) {
        console.error('Failed to load course for application:', err)
        setCourse(null)
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      loadCourse()
    }
  }, [courseId])

  const onSubmit = async (data) => {
    try {
      if (!user) {
        setError('로그인이 필요합니다.')
        return
      }

      setSubmitting(true)
      setError('')

      const payload = {
        userId: user.uid,
        userName: user.displayName || user.email,
        userEmail: user.email,
        courseId,
        courseTitle: course?.title || '',
        motivation: data.motivation,
        studyPlan: data.studyPlan,
        careerGoal: data.careerGoal,
        technicalSkills: data.technicalSkills || '',
        certifications: data.certifications || '',
        projects: data.projects || '',
      }

      const result = await createApplication(payload)

      if (!result.success) {
        throw new Error(result.error || '지원 신청에 실패했습니다.')
      }

      navigate('/applications', { replace: true })
    } catch (err) {
        console.error('Application submission failed:', err)
        setError(err.message || '지원 신청에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </button>

          {course && (
            <div className="text-right">
              <p className="text-xs text-gray-500 tracking-[0.3em] mb-2">APPLY FOR COURSE</p>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{course.title}</h1>
              <p className="text-gray-500 mt-2 text-sm">{course.instructor ? `담당 강사: ${course.instructor}` : '담당 강사 배정 예정'}</p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="bg-black/40 border border-white/10 p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : (
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">지원 신청서</h2>
                <p className="text-gray-500 text-sm">정확한 정보를 입력해 주세요.</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 border border-red-500/40 bg-red-500/10 text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-sm font-bold tracking-[0.3em] text-gray-500">WHY THIS COURSE?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 tracking-[0.2em] mb-2">지원 동기 *</label>
                    <textarea
                      {...register('motivation', { required: '지원 동기를 입력하세요' })}
                      rows={5}
                      className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-blue-500"
                      placeholder="본 교육과정에 지원하게 된 동기를 작성해주세요"
                    />
                    {errors.motivation && (
                      <p className="mt-2 text-xs text-red-300">{errors.motivation.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 tracking-[0.2em] mb-2">학습 계획 *</label>
                    <textarea
                      {...register('studyPlan', { required: '학습 계획을 입력하세요' })}
                      rows={5}
                      className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-blue-500"
                      placeholder="교육과정 수료 후 학습 계획을 작성해주세요"
                    />
                    {errors.studyPlan && (
                      <p className="mt-2 text-xs text-red-300">{errors.studyPlan.message}</p>
                    )}
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-bold tracking-[0.3em] text-gray-500">CAREER VISION</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 tracking-[0.2em] mb-2">진로 목표 *</label>
                    <textarea
                      {...register('careerGoal', { required: '진로 목표를 입력하세요' })}
                      rows={5}
                      className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-blue-500"
                      placeholder="정보보안 분야에서의 진로 목표를 작성해주세요"
                    />
                    {errors.careerGoal && (
                      <p className="mt-2 text-xs text-red-300">{errors.careerGoal.message}</p>
                    )}
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 tracking-[0.2em] mb-2">보유 기술</label>
                      <textarea
                        {...register('technicalSkills')}
                        rows={2}
                        className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-blue-500"
                        placeholder="예: Python, Java, Linux, Burp Suite"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 tracking-[0.2em] mb-2">보유 자격증</label>
                      <textarea
                        {...register('certifications')}
                        rows={2}
                        className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-blue-500"
                        placeholder="예: 정보보안기사, CISSP 등"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-bold tracking-[0.3em] text-gray-500">PROJECT EXPERIENCE</h3>
                <textarea
                  {...register('projects')}
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-blue-500"
                  placeholder="진행했던 프로젝트나 팀 활동, 해커톤 경험 등을 작성해주세요"
                />
              </section>

              <section className="space-y-4">
                <label className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/20 p-4">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-4 h-4 rounded border-blue-500/40 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300 leading-relaxed">
                    제출한 정보가 사실임을 확인하며, 허위 정보 제출 시 합격이 취소될 수 있음을 이해합니다.
                  </span>
                </label>
              </section>

              <div className="flex flex-col md:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white font-bold tracking-wide hover:bg-white/10 transition-all"
                  disabled={submitting}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold tracking-wide hover:shadow-lg hover:shadow-blue-500/40 transition-all disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {submitting ? '제출 중...' : '지원 신청하기'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
