import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { getUserApplications } from '../services/applicationService'
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function Applications() {
  const { user } = useAuthStore()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApplications()
  }, [user])

  const loadApplications = async () => {
    if (!user?.uid) return
    
    try {
      const userApplications = await getUserApplications(user.uid)
      setApplications(userApplications)
      setLoading(false)
    } catch (error) {
      console.error('Error loading applications:', error)
      setLoading(false)
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return '-'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('ko-KR')
  }

  const getStatusBadge = (status) => {
    const badges = {
      SUBMITTED: { icon: Clock, className: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: '서류 심사 중' },
      DOCUMENT_PASS: { icon: CheckCircle, className: 'bg-green-500/20 text-green-400 border-green-500/30', label: '서류 합격' },
      DOCUMENT_FAIL: { icon: XCircle, className: 'bg-red-500/20 text-red-400 border-red-500/30', label: '서류 불합격' },
      INTERVIEW_SCHEDULED: { icon: AlertCircle, className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: '면접 예정' },
      FINAL_PASS: { icon: CheckCircle, className: 'bg-green-500/20 text-green-400 border-green-500/30', label: '최종 합격' },
      FINAL_FAIL: { icon: XCircle, className: 'bg-red-500/20 text-red-400 border-red-500/30', label: '최종 불합격' }
    }
    return badges[status] || badges.SUBMITTED
  }

  return (
    <div className="min-h-screen bg-black py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black text-white mb-3">APPLICATIONS</h1>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mb-4"></div>
            <p className="text-gray-400 text-lg">교육과정 지원 현황을 확인하세요</p>
          </div>
          <Link to="/courses" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
            새 과정 지원하기 →
          </Link>
        </div>

        {loading ? (
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-12">
            <div className="text-center py-12">
              <div className="text-gray-400">Loading...</div>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-12">
            <div className="text-center py-12">
              <FileText className="w-20 h-20 text-purple-400 mx-auto mb-6" />
              <p className="text-gray-400 text-lg mb-6">지원한 과정이 없습니다.</p>
              <Link to="/courses" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all inline-block">
                교육과정 둘러보기
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => {
              const statusBadge = getStatusBadge(application.status)
              const StatusIcon = statusBadge.icon
              const courseInfo = application.course || {}
              const courseTitle = courseInfo.title || '강의 정보 없음'

              return (
                <div key={application.id} className="group bg-black/40 backdrop-blur-xl border border-white/10 p-8 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <h3 className="text-2xl font-black text-white">{courseTitle}</h3>
                        <span className={`px-4 py-2 border text-sm font-bold flex items-center space-x-2 ${statusBadge.className}`}>
                          <StatusIcon className="w-4 h-4" />
                          <span>{statusBadge.label}</span>
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 space-y-2 font-mono">
                        <p>지원번호: <span className="text-purple-400">{application.applicationNumber}</span></p>
                        <p>지원일: <span className="text-blue-400">{formatDate(application.createdAt)}</span></p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        to={`/applications/${application.id}`}
                        className="px-6 py-3 bg-white/5 border border-white/20 text-white font-bold hover:bg-white/10 hover:border-purple-500/50 transition-all"
                      >
                        상세보기 →
                      </Link>
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
