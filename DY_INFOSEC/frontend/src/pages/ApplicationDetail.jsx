import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getApplication } from '../services/applicationService'
import { Loader2, ArrowLeft, FileText, Calendar, User, Mail, BookOpen, Target } from 'lucide-react'

const STATUS_META = {
  SUBMITTED: { label: '서류 심사 중', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  DOCUMENT_PASS: { label: '서류 합격', badge: 'bg-green-500/20 text-green-400 border-green-500/40' },
  DOCUMENT_FAIL: { label: '서류 불합격', badge: 'bg-red-500/20 text-red-400 border-red-500/40' },
  INTERVIEW_SCHEDULED: { label: '면접 예정', badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
  FINAL_PASS: { label: '최종 합격', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  FINAL_FAIL: { label: '최종 불합격', badge: 'bg-rose-500/20 text-rose-400 border-rose-500/40' }
}

const SECTION_FIELDS = [
  { key: 'motivation', label: '지원 동기' },
  { key: 'studyPlan', label: '학습 계획' },
  { key: 'careerGoal', label: '진로 목표' },
  { key: 'technicalSkills', label: '보유 기술' },
  { key: 'certifications', label: '보유 자격증' },
  { key: 'projects', label: '프로젝트 경험' }
]

export default function ApplicationDetail() {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadApplication()
  }, [applicationId])

  const loadApplication = async () => {
    if (!applicationId) return
    try {
      setLoading(true)
      const data = await getApplication(applicationId)
      if (!data) {
        setApplication(null)
        setError('신청서를 찾을 수 없습니다.')
        return
      }
      setApplication(data)
    } catch (err) {
      console.error('Failed to load application detail:', err)
      setError('신청서를 불러오는 중 문제가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '-'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const statusMeta = useMemo(() => STATUS_META[application?.status] || STATUS_META.SUBMITTED, [application])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-2xl font-black text-white mb-3">APPLICATION NOT FOUND</p>
          <p className="text-gray-500 mb-6">{error || '요청한 신청서를 찾을 수 없습니다.'}</p>
          <button
            onClick={() => navigate('/applications')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/40 transition-all"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <button
            onClick={() => navigate('/applications')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로
          </button>
          <div className="text-right">
            <p className="text-xs text-gray-500 tracking-[0.3em] mb-2">APPLICATION</p>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3">{application.applicationNumber}</h1>
            <div className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold ${statusMeta.badge}`}>
              {statusMeta.label}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-black/40 backdrop-blur-xl border border-white/10 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">지원자</p>
                <div className="flex items-center gap-2 text-white font-semibold">
                  <User className="w-4 h-4 text-purple-300" />
                  {application.user?.displayName || application.userName || 'N/A'}
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-purple-300">
                  <Mail className="w-4 h-4" />
                  {application.user?.email || application.userEmail}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">지원일</p>
                <p>{formatDateTime(application.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">최근 업데이트</p>
                <p>{formatDateTime(application.updatedAt)}</p>
              </div>
            </div>
          </section>

          <section className="bg-black/40 backdrop-blur-xl border border-white/10 p-8">
            <h2 className="text-sm font-bold tracking-[0.3em] text-gray-500 mb-4">COURSE INFORMATION</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white text-xl font-black">
                <BookOpen className="w-5 h-5 text-purple-300" />
                {application.course?.title || 'Unknown Course'}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{application.course?.description || '강의 설명이 등록되지 않았습니다.'}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                <div>
                  <p className="text-xs text-gray-500">카테고리</p>
                  <p className="text-white font-semibold">{application.course?.category || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">난이도</p>
                  <p className="text-white font-semibold">{application.course?.level || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">강사</p>
                  <p className="text-white font-semibold">{application.course?.instructor || 'TBA'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">신청 마감</p>
                  <p className="text-white font-semibold">{application.course?.applicationDeadline ? formatDateTime(application.course.applicationDeadline) : '상시 모집'}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 space-y-6">
            <h2 className="text-sm font-bold tracking-[0.3em] text-gray-500">APPLICATION RESPONSES</h2>
            {SECTION_FIELDS.map(({ key, label }) => {
              const value = application[key]
              if (!value) return null
              return (
                <div key={key}>
                  <div className="flex items-center gap-2 text-xs text-purple-300 mb-2">
                    <Target className="w-4 h-4" />
                    <span className="tracking-[0.2em]">{label}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                    {value}
                  </div>
                </div>
              )
            })}
          </section>

          {application.statusNote && (
            <section className="bg-black/40 backdrop-blur-xl border border-white/10 p-8">
              <h2 className="text-sm font-bold tracking-[0.3em] text-gray-500 mb-3">관리자 메모</h2>
              <p className="text-sm text-gray-200 leading-relaxed bg-white/5 border border-white/10 p-4">{application.statusNote}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
