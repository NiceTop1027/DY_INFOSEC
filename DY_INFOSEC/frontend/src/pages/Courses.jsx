import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllCourses } from '../services/courseService'
import { Clock, Users, BookOpen, Filter, Zap, Code, Shield, Target } from 'lucide-react'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [filter])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const allCourses = await getAllCourses()
      
      // 필터 적용
      let filteredCourses = allCourses
      if (filter !== 'ALL') {
        filteredCourses = allCourses.filter(course => 
          course.category?.toUpperCase() === filter
        )
      }
      
      setCourses(filteredCourses)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLevelBadge = (level) => {
    const badges = {
      beginner: 'bg-green-500/20 text-green-400 border-green-500/50',
      intermediate: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      advanced: 'bg-purple-500/20 text-purple-400 border-purple-500/50'
    }
    const labels = {
      beginner: '초급',
      intermediate: '중급',
      advanced: '고급'
    }
    const normalizedLevel = level?.toLowerCase() || 'beginner'
    return { 
      className: badges[normalizedLevel] || badges.beginner, 
      label: labels[normalizedLevel] || labels.beginner 
    }
  }

  return (
    <div className="min-h-screen bg-black py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">COURSES</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg">Master the art of cybersecurity</p>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 mb-10">
          <div className="flex flex-wrap items-center gap-4">
            <Filter className="w-5 h-5 text-purple-400" />
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-6 py-2 font-bold tracking-wider transition-all ${
                  filter === 'ALL' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50' 
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                ALL
              </button>
              <button
                onClick={() => setFilter('BASIC')}
                className={`px-6 py-2 font-bold tracking-wider transition-all ${
                  filter === 'BASIC' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50' 
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                BASIC
              </button>
              <button
                onClick={() => setFilter('ADVANCED')}
                className={`px-6 py-2 font-bold tracking-wider transition-all ${
                  filter === 'ADVANCED' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50' 
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                ADVANCED
              </button>
              <button
                onClick={() => setFilter('PROJECT')}
                className={`px-6 py-2 font-bold tracking-wider transition-all ${
                  filter === 'PROJECT' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50' 
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                PROJECT
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 mt-4 font-mono">LOADING...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-white mb-3">No Courses Available</h3>
            <p className="text-gray-400 mb-8">강의가 아직 등록되지 않았습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const levelBadge = getLevelBadge(course.level)
              return (
                <Link key={course.id} to={`/courses/${course.id}`} className="group relative bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 overflow-hidden">
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-500"></div>
                  
                  <div className="relative p-6">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-6 relative">
                      <Code className="w-8 h-8 text-white" />
                      <div className="absolute inset-0 bg-white/20 transform scale-0 group-hover:scale-100 transition-transform"></div>
                    </div>
                    
                    {/* Badge */}
                    <div className="mb-4">
                      <span className={`px-3 py-1 border text-xs font-bold tracking-wider ${levelBadge.className}`}>
                        {levelBadge.label}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-black text-white mb-3 group-hover:text-purple-400 transition-colors">{course.title}</h3>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">{course.description}</p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="font-mono">{course.duration || 0}h</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span className="font-mono">{course.enrollmentCount || 0}/{course.maxStudents || 30}</span>
                      </div>
                    </div>
                    
                    {/* Instructor */}
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-400">
                        <span className="text-purple-400 font-bold">INSTRUCTOR:</span> {course.instructor || 'TBA'}
                      </p>
                    </div>
                    
                    {/* Bottom Line */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
