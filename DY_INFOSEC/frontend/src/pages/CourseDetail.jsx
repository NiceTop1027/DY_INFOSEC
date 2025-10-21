import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Clock, Users, BookOpen, Award, CheckCircle } from 'lucide-react'

export default function CourseDetail() {
  const { id } = useParams()
  const { isAuthenticated } = useAuthStore()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourseDetail()
  }, [id])

  const fetchCourseDetail = async () => {
    try {
      // Placeholder - implement actual API call
      const mockCourse = {
        id: 1,
        title: '웹 해킹 기초',
        description: '웹 애플리케이션의 취약점을 이해하고 모의해킹 실습을 진행합니다.',
        category: 'BASIC',
        level: 'BEGINNER',
        duration: 40,
        enrolledCount: 25,
        capacity: 30,
        instructor: '김보안',
        syllabus: '1주차: 웹 기초\n2주차: SQL Injection\n3주차: XSS\n4주차: CSRF',
        prerequisites: 'HTML, CSS, JavaScript 기초 지식',
        learningOutcomes: '웹 취약점 분석 능력, 모의해킹 실습 경험',
        benefits: '수료증 발급, 우수 수료생 특전',
        lectures: [
          { id: 1, title: '웹 보안 개요', duration: 60 },
          { id: 2, title: 'SQL Injection 이론', duration: 90 },
          { id: 3, title: 'SQL Injection 실습', duration: 120 }
        ]
      }
      setCourse(mockCourse)
    } catch (error) {
      console.error('Failed to fetch course:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">과정을 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}시간</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{course.enrolledCount}/{course.capacity}명</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>{course.instructor}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">학습 내용</h2>
              <div className="space-y-3">
                {course.lectures.map((lecture) => (
                  <div key={lecture.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600" />
                      <span>{lecture.title}</span>
                    </div>
                    <span className="text-sm text-gray-600">{lecture.duration}분</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">강의 계획</h2>
              <p className="text-gray-700 whitespace-pre-line">{course.syllabus}</p>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">선수 지식</h2>
              <p className="text-gray-700">{course.prerequisites}</p>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">학습 목표</h2>
              <p className="text-gray-700">{course.learningOutcomes}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <div className="aspect-video bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg mb-6 flex items-center justify-center">
                <BookOpen className="w-20 h-20 text-white" />
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">수강 인원</span>
                  <span className="font-semibold">{course.enrolledCount}/{course.capacity}명</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">강의 시간</span>
                  <span className="font-semibold">{course.duration}시간</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">난이도</span>
                  <span className="font-semibold">초급</span>
                </div>
              </div>

              {isAuthenticated ? (
                <div className="space-y-3">
                  <Link to={`/applications/new/${course.id}`} className="btn btn-primary w-full py-3">
                    지원 신청하기
                  </Link>
                  <button className="btn btn-outline w-full py-3">
                    찜하기
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link to="/login" className="btn btn-primary w-full py-3">
                    로그인하고 신청하기
                  </Link>
                </div>
              )}

              <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                <h3 className="font-semibold text-primary-900 mb-2">수강 혜택</h3>
                <ul className="text-sm text-primary-800 space-y-1">
                  <li>• 수료증 발급</li>
                  <li>• 우수 수료생 특전</li>
                  <li>• 멘토링 지원</li>
                  <li>• 취업 연계</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
