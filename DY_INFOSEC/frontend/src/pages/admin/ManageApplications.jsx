import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAllApplications,
  updateApplicationStatus,
  confirmApplicationEnrollment,
} from '../../services/applicationService'
import { enrollCourseForApplication } from '../../services/courseService'
import { Loader2, Filter, Search, FileText, CheckCircle, Clock, XCircle, AlertCircle, Users } from 'lucide-react'

const STATUS_META = {
  SUBMITTED: { label: '서류 심사 중', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/40', icon: Clock },
  DOCUMENT_PASS: { label: '서류 합격', badge: 'bg-green-500/20 text-green-400 border-green-500/40', icon: CheckCircle },
  DOCUMENT_FAIL: { label: '서류 불합격', badge: 'bg-red-500/20 text-red-400 border-red-500/40', icon: XCircle },
  INTERVIEW_SCHEDULED: { label: '면접 예정', badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40', icon: AlertCircle },
  FINAL_PASS: { label: '최종 합격', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', icon: CheckCircle },
  FINAL_FAIL: { label: '최종 불합격', badge: 'bg-rose-500/20 text-rose-400 border-rose-500/40', icon: XCircle },
  ENROLLED: { label: '등록 완료', badge: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40', icon: CheckCircle }
}

const STATUS_OPTIONS = Object.entries(STATUS_META).map(([value, meta]) => ({ value, label: meta.label }))

const FILTER_OPTIONS = [{ value: 'ALL', label: '전체' }, ...STATUS_OPTIONS]

export default function ManageApplications() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusDrafts, setStatusDrafts] = useState({})
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [confirmingId, setConfirmingId] = useState(null)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const data = await getAllApplications()
      setApplications(data)
      const initialDrafts = data.reduce((drafts, app) => {
        drafts[app.id] = {
          status: app.status || 'SUBMITTED',
          note: app.statusNote || ''
        }
        return drafts
      }, {})
      setStatusDrafts(initialDrafts)
    } catch (error) {
      console.error('Failed to load applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmEnrollment = async (applicationId) => {
    try {
      setConfirmingId(applicationId)
      await confirmApplicationEnrollment(applicationId)
      await loadApplications()
    } catch (error) {
      console.error('Failed to confirm enrollment:', error)
    } finally {
      setConfirmingId(null)
    }
  }

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (statusFilter !== 'ALL' && app.status !== statusFilter) return false
      if (!searchTerm) return true
      const keyword = searchTerm.toLowerCase()
      return (
        app.applicationNumber?.toLowerCase().includes(keyword) ||
        app.user?.displayName?.toLowerCase().includes(keyword) ||
        app.user?.email?.toLowerCase().includes(keyword) ||
        app.course?.title?.toLowerCase().includes(keyword)
      )
    })
  }, [applications, statusFilter, searchTerm])

  const handleDraftChange = (id, field, value) => {
    setStatusDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }))
  }

  const handleUpdateStatus = async (applicationId) => {
    const handleStatusUpdate = async (applicationId, newStatus, note) => {
      setUpdatingId(applicationId)
      try {
        const result = await updateApplicationStatus(applicationId, newStatus, note)
        if (!result.success) {
          throw new Error(result.error || '상태 업데이트에 실패했습니다.')
        }

        if (newStatus === 'FINAL_PASS') {
          const application = applications.find((app) => app.id === applicationId)
          if (application) {
            const enrollmentResult = await enrollCourseForApplication({
              userId: application.userId,
              courseId: application.courseId,
            })

            if (!enrollmentResult.success) {
              console.warn('Enrollment update failed:', enrollmentResult.error)
            }
          }
        }

        setStatusDrafts((prev) => ({
          ...prev,
          [applicationId]: {
            status: newStatus,
            note: note
          }
        }))
        loadApplications()
      } catch (error) {
        console.error('Failed to update status:', error)
      } finally {
        setUpdatingId(null)
      }
    }

    const draft = statusDrafts[applicationId]
    if (!draft) return
    handleStatusUpdate(applicationId, draft.status, draft.note)
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

  return (
    <div className="min-h-screen bg-black py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-white mb-3">MANAGE APPLICATIONS</h1>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mb-4"></div>
            <p className="text-gray-400 text-sm">지원서를 검토하고 합격 상태를 업데이트하세요.</p>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              <span>총 지원서 {applications.length}건</span>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <div className="relative">
                <Filter className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 text-sm text-gray-300 focus:outline-none focus:border-purple-500"
                >
                  {FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="지원번호 / 이름 / 이메일 / 강의명 검색"
                  className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 text-sm text-gray-300 focus:outline-none focus:border-purple-500 min-w-[240px]"
                />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-16 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-16 text-center">
            <FileText className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <p className="text-gray-400">조건에 맞는 지원서가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application) => {
              const meta = STATUS_META[application.status] || STATUS_META.SUBMITTED
              const Icon = meta.icon
              const draft = statusDrafts[application.id] || { status: application.status, note: application.statusNote || '' }

              return (
                <div key={application.id} className="bg-black/40 backdrop-blur-xl border border-white/10 p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-4 py-2 text-xs font-bold tracking-wider border border-white/10 text-gray-400">
                          {application.applicationNumber}
                        </span>
                        <span className={`px-4 py-2 text-xs font-bold flex items-center gap-2 ${meta.badge}`}>
                          <Icon className="w-4 h-4" />
                          {meta.label}
                        </span>
                        <span className="px-4 py-2 text-xs font-bold text-purple-300 bg-purple-500/10 border border-purple-500/30">
                          {application.course?.title || 'Unknown Course'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                        <div>
                          <p className="text-xs text-gray-500">지원자</p>
                          <p className="text-white font-semibold">{application.user?.displayName || application.userName || 'N/A'}</p>
                          <p className="font-mono text-xs text-purple-300">{application.user?.email || application.userEmail}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">지원일</p>
                          <p>{formatDateTime(application.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">최근 업데이트</p>
                          <p>{formatDateTime(application.updatedAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">신청 마감</p>
                          <p>{application.course?.applicationDeadline ? formatDateTime(application.course.applicationDeadline) : '상시 모집'}</p>
                        </div>
                      </div>

                      {application.statusNote && (
                        <div className="p-4 bg-white/5 border border-white/10 text-sm text-gray-300">
                          <p className="text-xs text-gray-500 mb-1">관리자 메모</p>
                          <p className="leading-relaxed">{application.statusNote}</p>
                        </div>
                      )}
                    </div>

                    <div className="w-full max-w-xs border border-white/10 p-4 bg-black/30">
                      <label className="block text-xs font-bold text-gray-400 tracking-[0.2em] mb-2">상태 업데이트</label>
                      <select
                        value={draft.status}
                        onChange={(e) => handleDraftChange(application.id, 'status', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 text-sm text-gray-200 focus:outline-none focus:border-purple-500"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <label className="block text-xs font-bold text-gray-400 tracking-[0.2em] mt-4 mb-2">관리자 메모</label>
                      <textarea
                        value={draft.note}
                        onChange={(e) => handleDraftChange(application.id, 'note', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 text-sm text-gray-200 focus:outline-none focus:border-purple-500 resize-none"
                        placeholder="지원자에게 전달할 메모를 작성하세요"
                      />
                      <div className="mt-4 flex flex-col gap-3">
                        {application.status === 'FINAL_PASS' && (
                          <button
                            onClick={() => handleConfirmEnrollment(application.id)}
                            disabled={confirmingId === application.id}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-bold tracking-wide hover:shadow-lg hover:shadow-emerald-500/40 transition-all disabled:opacity-50"
                          >
                            {confirmingId === application.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {confirmingId === application.id ? '등록 처리 중...' : '등록 확정'}
                          </button>
                        )}
                        {application.status === 'ENROLLED' && (
                          <div className="w-full px-4 py-2 text-center text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30">
                            등록이 완료된 지원서입니다.
                          </div>
                        )}
                        <button
                          onClick={() => handleUpdateStatus(application.id)}
                          disabled={updatingId === application.id}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold tracking-wide hover:shadow-lg hover:shadow-purple-500/40 transition-all disabled:opacity-50"
                        >
                          {updatingId === application.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          {updatingId === application.id ? '업데이트 중...' : '상태 저장'}
                        </button>
                        <button
                          onClick={() => navigate(`/admin/applications/${application.id}`)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white text-sm font-bold tracking-wide hover:bg-white/10 transition-all"
                        >
                          상세 보기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
