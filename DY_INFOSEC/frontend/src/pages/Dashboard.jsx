import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { getUserEnrollments } from '../services/courseService'
import { getUserApplications } from '../services/applicationService'
import { BookOpen, FileText, Award, TrendingUp, Clock, CheckCircle, Zap, Target } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    applications: 0,
    averageProgress: 0
  })
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    if (!user?.uid) return
    
    try {
      // 수강 중인 강의 가져오기
      const userEnrollments = await getUserEnrollments(user.uid)
      setEnrollments(userEnrollments)
      
      // 신청서 가져오기
      const userApplications = await getUserApplications(user.uid)
      
      // 통계 계산
      const completedCount = userEnrollments.filter(e => e.progress === 100).length
      const avgProgress = userEnrollments.length > 0
        ? Math.round(userEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / userEnrollments.length)
        : 0
      
      setStats({
        enrolledCourses: userEnrollments.length,
        completedCourses: completedCount,
        applications: userApplications.length,
        averageProgress: avgProgress
      })
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-3">DASHBOARD</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mb-4"></div>
          <p className="text-gray-400 text-lg">Welcome back, <span className="text-purple-400 font-bold">{user?.displayName || user?.email?.split('@')[0]}</span></p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group relative bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-6 hover:border-purple-500/50 transition-all duration-500">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-8 h-8 text-purple-400" />
                <div className="text-4xl font-black text-white">{stats.enrolledCourses}</div>
              </div>
              <p className="text-sm text-gray-400 font-bold tracking-wider">ENROLLED COURSES</p>
              <div className="mt-4 h-1 bg-gradient-to-r from-purple-500 to-transparent"></div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 p-6 hover:border-green-500/50 transition-all duration-500">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/20 rounded-full blur-2xl group-hover:bg-green-500/30 transition-all"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div className="text-4xl font-black text-white">{stats.completedCourses}</div>
              </div>
              <p className="text-sm text-gray-400 font-bold tracking-wider">COMPLETED</p>
              <div className="mt-4 h-1 bg-gradient-to-r from-green-500 to-transparent"></div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/20 p-6 hover:border-blue-500/50 transition-all duration-500">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 text-blue-400" />
                <div className="text-4xl font-black text-white">{stats.applications}</div>
              </div>
              <p className="text-sm text-gray-400 font-bold tracking-wider">APPLICATIONS</p>
              <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-xl border border-pink-500/20 p-6 hover:border-pink-500/50 transition-all duration-500">
            <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/20 rounded-full blur-2xl group-hover:bg-pink-500/30 transition-all"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-pink-400" />
                <div className="text-4xl font-black text-white">{stats.averageProgress}%</div>
              </div>
              <p className="text-sm text-gray-400 font-bold tracking-wider">AVG PROGRESS</p>
              <div className="mt-4 h-1 bg-gradient-to-r from-pink-500 to-transparent"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Courses */}
          <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-white/10 p-8">
            <h2 className="text-2xl font-black text-white mb-6 tracking-wider">RECENT COURSES</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-400">Loading...</div>
              </div>
            ) : enrollments.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">수강 중인 강의가 없습니다.</p>
                <Link to="/courses" className="mt-4 inline-block px-6 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold hover:bg-purple-500/30 transition-all">
                  강의 둘러보기
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment, index) => {
                  const gradients = [
                    'from-purple-500 to-blue-500',
                    'from-blue-500 to-cyan-500',
                    'from-cyan-500 to-teal-500',
                    'from-pink-500 to-purple-500'
                  ]
                  const gradient = gradients[index % gradients.length]
                  
                  return (
                  <div key={enrollment.id} className="group flex items-center justify-between p-6 bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
                        <BookOpen className="w-7 h-7 text-white relative z-10" />
                        <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-all"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg">{enrollment.course?.title || '강의'}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 max-w-xs h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500`} style={{width: `${enrollment.progress || 0}%`}}></div>
                          </div>
                          <span className="text-sm text-gray-400 font-mono font-bold">{enrollment.progress || 0}%</span>
                        </div>
                      </div>
                    </div>
                    <Link to={`/courses/${enrollment.courseId}/learn`} className="px-6 py-2 bg-white/5 border border-white/20 text-white font-bold hover:bg-white/10 transition-all">
                      학습하기
                    </Link>
                  </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8">
            <h2 className="text-2xl font-black text-white mb-6 tracking-wider">QUICK LINKS</h2>
            <div className="space-y-3">
              <Link to="/my-classroom" className="group block p-4 bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">나의 강의실</span>
                </div>
              </Link>
              
              <Link to="/applications" className="group block p-4 bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">지원신청</span>
                </div>
              </Link>
              
              <Link to="/courses" className="group block p-4 bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">교육과정</span>
                </div>
              </Link>
              
              <Link to="/profile" className="group block p-4 bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-white/10 transition-all">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">마이페이지</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
