import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { getUserEnrollments } from '../services/courseService'
import { BookOpen, FileText, Users, Award } from 'lucide-react'

export default function MyClassroom() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('courses')
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEnrollments()
  }, [user])

  const loadEnrollments = async () => {
    if (!user?.uid) return
    
    try {
      const userEnrollments = await getUserEnrollments(user.uid)
      setEnrollments(userEnrollments)
      setLoading(false)
    } catch (error) {
      console.error('Error loading enrollments:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-3">MY CLASSROOM</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mb-4"></div>
          <p className="text-gray-400 text-lg">수강 중인 과정과 학습 현황을 확인하세요</p>
        </div>

        {/* Tabs */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-3 font-bold tracking-wider transition-all ${
                activeTab === 'courses'
                  ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              수강 과정
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-6 py-3 font-bold tracking-wider transition-all ${
                activeTab === 'assignments'
                  ? 'bg-purple-500/20 text-purple-400 border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              과제
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-3 font-bold tracking-wider transition-all ${
                activeTab === 'projects'
                  ? 'bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              프로젝트
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-6 py-3 font-bold tracking-wider transition-all ${
                activeTab === 'certificates'
                  ? 'bg-pink-500/20 text-pink-400 border-b-2 border-pink-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              수료증
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'courses' && (
          loading ? (
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-12">
              <div className="text-center py-12">
                <div className="text-gray-400">Loading...</div>
              </div>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-12">
              <div className="text-center py-12">
                <BookOpen className="w-20 h-20 text-blue-400 mx-auto mb-6" />
                <p className="text-gray-400 text-lg mb-6">수강 중인 강의가 없습니다.</p>
                <Link to="/courses" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all inline-block">
                  강의 둘러보기 →
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="group bg-black/40 backdrop-blur-xl border border-white/10 p-8 hover:border-blue-500/50 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center relative overflow-hidden">
                      <BookOpen className="w-10 h-10 text-white relative z-10" />
                      <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-all"></div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white mb-2">{enrollment.course.title}</h3>
                      <p className="text-sm text-gray-400 font-mono">
                        진도: {enrollment.completedLectures}/{enrollment.totalLectures} 강의 완료
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-blue-400 mb-4">
                      {enrollment.progress}%
                    </div>
                    <Link
                      to={`/courses/${enrollment.course.id}/learn`}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all inline-block"
                    >
                      학습하기 →
                    </Link>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            </div>
          )
        )}

        {activeTab === 'assignments' && (
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-12">
            <div className="text-center py-12">
              <FileText className="w-20 h-20 text-purple-400 mx-auto mb-6" />
              <p className="text-gray-400 text-lg">제출할 과제가 없습니다.</p>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-12">
            <div className="text-center py-12">
              <Users className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
              <p className="text-gray-400 text-lg">진행 중인 프로젝트가 없습니다.</p>
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-12">
            <div className="text-center py-12">
              <Award className="w-20 h-20 text-pink-400 mx-auto mb-6" />
              <p className="text-gray-400 text-lg">발급된 수료증이 없습니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
