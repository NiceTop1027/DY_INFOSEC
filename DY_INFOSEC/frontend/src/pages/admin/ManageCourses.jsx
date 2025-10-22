import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllCourses, createCourse, updateCourse, deleteCourse } from '../../services/courseService'
import { BookOpen, Plus, Edit, Trash2, X } from 'lucide-react'

export default function ManageCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    duration: '',
    instructor: '',
    instructorId: '',
    thumbnail: '',
    price: 0,
    maxStudents: 30,
    applicationDeadline: ''
  })

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    const data = await getAllCourses()
    setCourses(data)
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (editingCourse) {
      await updateCourse(editingCourse.id, formData)
    } else {
      await createCourse(formData)
    }
    
    setShowModal(false)
    setEditingCourse(null)
    setFormData({
      title: '',
      description: '',
      category: '',
      level: 'beginner',
      duration: '',
      instructor: '',
      instructorId: '',
      thumbnail: '',
      price: 0,
      maxStudents: 30,
      applicationDeadline: ''
    })
    loadCourses()
  }

  const handleEdit = (course) => {
    setEditingCourse(course)
    const deadlineDate = course.applicationDeadline?.toDate
      ? course.applicationDeadline.toDate()
      : course.applicationDeadline
        ? new Date(course.applicationDeadline)
        : null

    setFormData({
      title: course.title || '',
      description: course.description || '',
      category: course.category || '',
      level: course.level || 'beginner',
      duration: course.duration || '',
      instructor: course.instructor || '',
      instructorId: course.instructorId || '',
      thumbnail: course.thumbnail || '',
      price: course.price || 0,
      maxStudents: course.maxStudents ?? course.capacity ?? 30,
      applicationDeadline: deadlineDate ? deadlineDate.toISOString().slice(0, 16) : ''
    })
    setShowModal(true)
  }

  const handleDelete = async (courseId) => {
    if (confirm('정말 이 강의를 삭제하시겠습니까?')) {
      await deleteCourse(courseId)
      loadCourses()
    }
  }

  return (
    <div className="min-h-screen bg-black py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <Link to="/admin" className="text-gray-400 hover:text-white mb-2 inline-block">← Back to Admin</Link>
            <h1 className="text-5xl font-black text-white mb-3">MANAGE COURSES</h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mb-4"></div>
            <Link
              to="/admin/course-manager"
              className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-white"
            >
고급 커리큘럼 편집기로 이동 →
            </Link>
          </div>
          <button
            onClick={() => {
              setEditingCourse(null)
              setFormData({
                title: '',
                description: '',
                category: '',
                level: 'beginner',
                duration: '',
                instructor: '',
                instructorId: '',
                thumbnail: '',
                price: 0,
                maxStudents: 30,
                applicationDeadline: '',
                briefingContent: '',
                curriculumContent: ''
              })
              setShowModal(true)
            }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            새 강의 추가
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 hover:border-blue-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <BookOpen className="w-8 h-8 text-blue-400" />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="p-2 bg-white/5 border border-white/10 text-blue-400 hover:bg-white/10 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-2 bg-white/5 border border-white/10 text-red-400 hover:bg-white/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-black text-white mb-2">{course.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">등록: {course.enrollmentCount || 0} / {course.maxStudents || '∞'}명</span>
                  <span className={`px-3 py-1 text-xs font-bold ${
                    course.isActive 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {course.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                {course.applicationDeadline && (
                  <div className="mt-3 text-xs text-gray-500">
                    신청 마감: {course.applicationDeadline.toDate ? course.applicationDeadline.toDate().toLocaleString() : new Date(course.applicationDeadline).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-black text-white">
                    {editingCourse ? 'EDIT COURSE' : 'NEW COURSE'}
                  </h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">TITLE</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">DESCRIPTION</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">CATEGORY</label>
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">LEVEL</label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({...formData, level: e.target.value})}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">DURATION</label>
                      <input
                        type="text"
                        placeholder="e.g., 8 weeks"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">INSTRUCTOR</label>
                      <input
                        type="text"
                        value={formData.instructor}
                        onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">INSTRUCTOR UID</label>
                      <input
                        type="text"
                        value={formData.instructorId}
                        onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">MAX STUDENTS</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxStudents}
                        onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">APPLICATION DEADLINE</label>
                      <input
                        type="datetime-local"
                        value={formData.applicationDeadline}
                        onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">INSTRUCTOR UID</label>
                      <input
                        type="text"
                        value={formData.instructorId}
                        onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3 bg-white/5 border border-white/20 text-white font-bold hover:bg-white/10 transition-all"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                    >
                      {editingCourse ? '수정' : '생성'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
