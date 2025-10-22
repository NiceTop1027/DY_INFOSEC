import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, NavLink, Routes, Route, Navigate } from 'react-router-dom'
import {
  getAllCourses,
  getCourse,
  getCourseAssignments,
  createCourseAssignment,
  updateCourseAssignment,
  deleteCourseAssignment,
  getCourseEnrollments,
  updateCourseCurriculum,
} from '../../services/courseService'
import { parseCurriculumContent } from '../../utils/curriculum'
import { storage } from '../../config/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Resizer from 'react-image-file-resizer'
import {
  Loader2,
  Book,
  Users,
  ClipboardList,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
} from 'lucide-react'

export default function CourseManagerRouter() {
  const courses = useCourseOptions()

  if (courses.loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-white animate-spin" />
      </div>
    )
  }

  if (!courses.options.length) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
        <Book className="w-12 h-12 text-gray-500 mb-4" />
        <p className="text-gray-400 text-sm">등록된 강좌가 없습니다. 먼저 강좌를 생성해 주세요.</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route index element={<Navigate to={`course/${courses.options[0].id}`} replace />} />
      <Route path="course/:courseId/*" element={<CourseManager courses={courses.options} />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  )
}

function useCourseOptions() {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await getAllCourses()
        if (mounted) setOptions(data)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  return { options, loading }
}

function CourseManager({ courses }) {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [curriculum, setCurriculum] = useState('')
  const [savingCurriculum, setSavingCurriculum] = useState(false)
  const [curriculumMessage, setCurriculumMessage] = useState(null)

  const tabs = useMemo(
    () => [
      { slug: '', label: '개요', icon: Book },
      { slug: 'curriculum', label: '커리큘럼', icon: ClipboardList },
      { slug: 'assignments', label: '과제', icon: CheckCircle2 },
      { slug: 'students', label: '수강생', icon: Users },
    ],
    []
  )

  useEffect(() => {
    if (!courseId) return
    let mounted = true

    const loadCourse = async () => {
      try {
        setLoading(true)
        const [courseData, assignmentData, enrollmentData] = await Promise.all([
          getCourse(courseId),
          getCourseAssignments(courseId),
          getCourseEnrollments(courseId),
        ])
        if (mounted) {
          setCourse(courseData)
          setAssignments(assignmentData)
          setEnrollments(enrollmentData)
          setCurriculum(courseData?.curriculumContent || '')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadCourse()
    return () => {
      mounted = false
    }
  }, [courseId])

  const sections = useMemo(() => parseCurriculumContent(curriculum), [curriculum])

  const handleSaveCurriculum = async () => {
    if (!courseId) return
    try {
      setSavingCurriculum(true)
      const result = await updateCourseCurriculum(courseId, curriculum)
      if (!result.success) throw new Error(result.error)
      setCurriculumMessage('커리큘럼이 저장되었습니다.')
    } catch (error) {
      console.error('Failed to save curriculum:', error)
      setCurriculumMessage('커리큘럼 저장 중 오류가 발생했습니다.')
    } finally {
      setSavingCurriculum(false)
      setTimeout(() => setCurriculumMessage(null), 3500)
    }
  }

  const refreshAssignments = async () => {
    const data = await getCourseAssignments(courseId)
    setAssignments(data)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-white animate-spin" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
        <p className="text-gray-400 text-sm">선택한 강좌를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate('/admin/courses')}
          className="mt-6 px-5 py-2 text-sm text-gray-200 border border-white/10 hover:bg-white/5"
        >
          강좌 목록으로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/admin/courses')}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          강좌 목록으로 돌아가기
        </button>

        <div className="mt-6 mb-10">
          <p className="text-xs text-blue-300 tracking-[0.3em] uppercase">Course Management</p>
          <h1 className="text-4xl font-black text-white mt-3">{course.title}</h1>
          <p className="text-gray-400 mt-3 text-sm sm:text-base">{course.description || '등록된 설명이 없습니다.'}</p>
        </div>

        <div className="grid lg:grid-cols-[220px,1fr] gap-6">
          <aside className="space-y-3">
            <CourseSelector courses={courses} activeCourseId={courseId} />
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <NavLink
                    key={tab.slug}
                    to={
                      tab.slug === ''
                        ? `/admin/course-manager/course/${courseId}`
                        : `/admin/course-manager/course/${courseId}/${tab.slug}`
                    }
                    end={tab.slug === ''}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 border border-white/10 transition-colors ${
                        isActive ? 'bg-white/10 text-white border-blue-500/40' : 'bg-black/40 text-gray-300 hover:bg-white/5'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-semibold text-sm tracking-wide">{tab.label}</span>
                  </NavLink>
                )
              })}
            </nav>
          </aside>

          <section className="bg-black/40 border border-white/10 min-h-[520px]">
            <Routes>
              <Route
                index
                element={<CourseOverview course={course} assignments={assignments} enrollments={enrollments} />}
              />
              <Route
                path="curriculum"
                element={
                  <CourseCurriculumEditor
                    curriculum={curriculum}
                    onChange={setCurriculum}
                    onSave={handleSaveCurriculum}
                    saving={savingCurriculum}
                    message={curriculumMessage}
                    sections={sections}
                  />
                }
              />
              <Route
                path="assignments"
                element={
                  <CourseAssignments
                    courseId={courseId}
                    assignments={assignments}
                    refreshAssignments={refreshAssignments}
                  />
                }
              />
              <Route path="students" element={<CourseStudents enrollments={enrollments} />} />
              <Route path="*" element={<Navigate to="" replace />} />
            </Routes>
          </section>
        </div>
      </div>
    </div>
  )
}

function CourseOverview({ course, assignments, enrollments }) {
  const totalAssignments = assignments.length
  const upcomingAssignments = assignments.filter((assignment) => {
    const due = assignment.dueDate?.toDate?.() || (assignment.dueDate ? new Date(assignment.dueDate) : null)
    return due && due > new Date()
  }).length

  return (
    <div className="p-8 space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard
          label="총 수강생"
          value={`${course.enrollmentCount || enrollments.length || 0}명`}
          icon={Users}
          accent="from-blue-500 to-cyan-500"
        />
        <StatCard
          label="등록된 과제"
          value={`${totalAssignments}개`}
          icon={ClipboardList}
          accent="from-purple-500 to-pink-500"
        />
        <StatCard
          label="마감 예정"
          value={`${upcomingAssignments}개`}
          icon={CheckCircle2}
          accent="from-green-500 to-emerald-500"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">강좌 정보</h3>
        <div className="border border-white/10 bg-black/50 p-6 space-y-3 text-sm text-gray-300">
          <OverviewField label="카테고리" value={course.category || '미지정'} />
          <OverviewField label="레벨" value={course.level || 'beginner'} />
          <OverviewField label="강사" value={course.instructor || '미지정'} />
          <OverviewField label="수강 인원 제한" value={course.maxStudents ?? '제한 없음'} />
          <OverviewField label="신청 마감일" value={formatDate(course.applicationDeadline)} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">최근 과제</h3>
        {assignments.length === 0 ? (
          <p className="text-sm text-gray-500">등록된 과제가 없습니다.</p>
        ) : (
          <div className="grid gap-3">
            {assignments.slice(0, 3).map((assignment) => (
              <div key={assignment.id} className="border border-white/10 bg-black/50 p-4">
                <h4 className="text-white font-semibold">{assignment.title}</h4>
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                  {assignment.description || '설명이 없습니다.'}
                </p>
                <div className="text-xs text-gray-500 mt-3">
                  마감일: {formatDate(assignment.dueDate)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="p-6 border border-white/10 bg-white/5 relative overflow-hidden">
      <div className={`absolute inset-0 opacity-20 bg-gradient-to-r ${accent}`} />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">{label}</p>
          <p className="text-2xl font-black text-white mt-3">{value}</p>
        </div>
        <Icon className="w-8 h-8 text-white/70" />
      </div>
    </div>
  )
}

function OverviewField({ label, value }) {
  return (
    <div>
      <span className="text-gray-500 text-xs uppercase tracking-[0.2em]">{label}</span>
      <p className="mt-1 text-white font-medium">{value}</p>
    </div>
  )
}

function CourseCurriculumEditor({ curriculum, onChange, onSave, saving, message, sections }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [imageSize, setImageSize] = useState('800')
  const textareaRef = useState(null)[0]

  const insertAtCursor = (text) => {
    const textarea = document.querySelector('textarea')
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const before = curriculum.substring(0, start)
    const after = curriculum.substring(end)
    
    onChange(before + text + after)
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  const resizeImage = (file, maxWidth) => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        maxWidth,
        maxWidth * 2,
        'JPEG',
        90,
        0,
        (blob) => resolve(blob),
        'blob'
      )
    })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }
    
    setUploading(true)
    try {
      const maxWidth = parseInt(imageSize)
      const resizedBlob = await resizeImage(file, maxWidth)
      
      const timestamp = Date.now()
      const fileName = `curriculum/${timestamp}_${file.name}`
      const storageRef = ref(storage, fileName)
      
      await uploadBytes(storageRef, resizedBlob)
      const downloadURL = await getDownloadURL(storageRef)
      
      insertAtCursor(`![${file.name}](${downloadURL})`)
    } catch (error) {
      console.error('Image upload error:', error)
      alert('이미지 업로드 중 오류가 발생했습니다: ' + error.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const insertLink = () => {
    const url = prompt('링크 URL을 입력하세요:')
    if (!url) return
    const text = prompt('링크 텍스트를 입력하세요:', url)
    insertAtCursor(`[${text || url}](${url})`)
  }

  useEffect(() => {
    if (sections.length === 0) {
      setCurrentIndex(0)
    } else if (currentIndex > sections.length - 1) {
      setCurrentIndex(sections.length - 1)
    }
  }, [sections, currentIndex])

  const addSection = () => {
    const prefix = curriculum.trim() ? '\n---\n' : '---\n'
    const template = `${prefix}Title: 새 모듈 ${sections.length + 1}\nSummary: 섹션 요약\nBody: 학습 내용을 작성하세요\nSteps:\n- 단계 1`
    const updated = curriculum.trim() ? `${curriculum.trim()}${template}` : template
    onChange(updated)
    setCurrentIndex(sections.length)
  }

  const move = (direction) => {
    if (sections.length === 0) return
    setCurrentIndex((prev) => {
      if (direction === 'prev') return prev === 0 ? prev : prev - 1
      if (direction === 'next') return prev === sections.length - 1 ? prev : prev + 1
      return prev
    })
  }

  const current = sections[currentIndex] || null

  return (
    <div className="grid lg:grid-cols-2 border-t border-white/10">
      <div className="p-8 space-y-5 border-b lg:border-b-0 lg:border-r border-white/10">
        <div className="space-y-2">
          <p className="text-xs text-gray-500 tracking-[0.3em] uppercase">Curriculum Builder</p>
          <h2 className="text-2xl font-black text-white">모듈 기반 커리큘럼 편집기</h2>
          <p className="text-sm text-gray-400">`---` 구분자나 JSON 배열로 모듈을 작성하세요. 오른쪽에서 현재 모듈을 확인할 수 있습니다.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-3 bg-black/40 border border-white/10">
          <select
            value={imageSize}
            onChange={(e) => setImageSize(e.target.value)}
            className="px-3 py-2 text-xs bg-black/60 border border-white/10 text-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value="400">작게 (400px)</option>
            <option value="600">중간 (600px)</option>
            <option value="800">크게 (800px)</option>
            <option value="1200">매우 크게 (1200px)</option>
            <option value="9999">원본 크기</option>
          </select>
          <label className="inline-flex items-center gap-2 px-3 py-2 text-xs border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white cursor-pointer transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? '업로드 중...' : '이미지 업로드'}
          </label>
          <button
            type="button"
            onClick={insertLink}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition"
          >
            <LinkIcon className="w-4 h-4" /> 링크 삽입
          </button>
          <button
            type="button"
            onClick={() => insertAtCursor('\n\n')}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition"
          >
            빈 줄 삽입
          </button>
          <div className="ml-auto text-xs text-gray-500">
            <span className="text-blue-300">![alt](url)</span> 이미지 | <span className="text-blue-300">[text](url)</span> 링크
          </div>
        </div>

        <textarea
          value={curriculum}
          onChange={(e) => onChange(e.target.value)}
          rows={20}
          className="w-full bg-black/60 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-blue-500 transition font-mono text-sm"
          placeholder={`---\nTitle: Intro\nSummary: 과정 개요\nBody: ...`}
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={addSection}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-white/10 text-blue-300 hover:bg-white/5"
          >
            <Plus className="w-4 h-4" /> 새 모듈 추가
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-blue-500/40 transition disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {saving ? '저장 중...' : '커리큘럼 저장'}
          </button>
          {message && <p className="text-sm text-gray-400">{message}</p>}
        </div>
      </div>

      <div className="p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 tracking-[0.3em] uppercase">Module Preview</p>
            <h3 className="text-xl font-black text-white">학습자 화면 미리보기</h3>
          </div>
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => move('prev')}
              disabled={sections.length === 0 || currentIndex === 0}
              className="p-2 border border-white/10 text-gray-400 hover:text-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-400 uppercase tracking-[0.2em]">
              {sections.length === 0 ? '섹션 없음' : `SECTION ${String(currentIndex + 1).padStart(2, '0')} / ${sections.length}`}
            </span>
            <button
              type="button"
              onClick={() => move('next')}
              disabled={sections.length === 0 || currentIndex === sections.length - 1}
              className="p-2 border border-white/10 text-gray-400 hover:text-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {sections.length === 0 ? (
          <div className="border border-white/10 bg-black/50 p-6 text-sm text-gray-400">섹션이 없습니다. 왼쪽에서 모듈을 추가해 주세요.</div>
        ) : (
          <div className="border border-white/10 bg-black/50 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-blue-300" />
              <div>
                <p className="text-xs text-gray-500 font-mono">MODULE {String(currentIndex + 1).padStart(2, '0')}</p>
                <h4 className="text-lg font-bold text-white">{current?.title || `모듈 ${currentIndex + 1}`}</h4>
                {current?.summary && <p className="text-sm text-gray-400 mt-1">{current.summary}</p>}
              </div>
            </div>

            {current?.body && (
              <div 
                className="prose prose-invert max-w-none text-sm text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: current.body
                    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto my-4 rounded border border-white/10" />')
                    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
                    .replace(/```([\s\S]*?)```/g, '<pre class="bg-black/60 border border-white/10 p-3 rounded my-3 overflow-x-auto"><code>$1</code></pre>')
                    .replace(/`([^`]+)`/g, '<code class="bg-purple-500/10 border border-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded text-xs">$1</code>')
                    .replace(/\n/g, '<br/>')
                }}
              />
            )}

            {current?.steps && current.steps.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-2">Steps</p>
                <ul className="space-y-2 text-sm text-gray-300">
                  {current.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex gap-3">
                      <span className="text-blue-300 font-semibold">{stepIndex + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function CourseAssignments({ courseId, assignments, refreshAssignments }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    points: '',
  })
  const [saving, setSaving] = useState(false)

  const openForCreate = () => {
    setEditingAssignment(null)
    setFormData({ title: '', description: '', dueDate: '', points: '' })
    setIsModalOpen(true)
  }

  const openForEdit = (assignment) => {
    setEditingAssignment(assignment)
    setFormData({
      title: assignment.title || '',
      description: assignment.description || '',
      dueDate: assignment.dueDate?.toDate?.()
        ? assignment.dueDate.toDate().toISOString().slice(0, 16)
        : assignment.dueDate
        ? new Date(assignment.dueDate).toISOString().slice(0, 16)
        : '',
      points: assignment.points || '',
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!courseId) return
    try {
      setSaving(true)
      if (editingAssignment) {
        await updateCourseAssignment(courseId, editingAssignment.id, formData)
      } else {
        await createCourseAssignment(courseId, formData)
      }
      await refreshAssignments()
      closeModal()
    } catch (error) {
      console.error('Failed to save assignment:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (assignmentId) => {
    if (!courseId) return
    if (!confirm('이 과제를 삭제하시겠습니까?')) return
    try {
      await deleteCourseAssignment(courseId, assignmentId)
      await refreshAssignments()
    } catch (error) {
      console.error('Failed to delete assignment:', error)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">과제 관리</h2>
          <p className="text-sm text-gray-400 mt-2">단계별 실습 과제를 구성하고 관리할 수 있습니다.</p>
        </div>
        <button
          onClick={openForCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-blue-500/40"
        >
          <Plus className="w-4 h-4" />
          새 과제 추가
        </button>
      </div>

      {assignments.length === 0 ? (
        <div className="border border-white/10 bg-black/50 p-6 text-sm text-gray-400">
          아직 등록된 과제가 없습니다. "새 과제 추가" 버튼을 눌러 첫 과제를 등록하세요.
        </div>
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="border border-white/10 bg-black/50 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{assignment.title}</h3>
                  <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                    {assignment.description || '설명이 없습니다.'}
                  </p>
                  <div className="text-xs text-gray-500 mt-3 space-x-4">
                    <span>마감일: {formatDate(assignment.dueDate)}</span>
                    <span>배점: {assignment.points ?? '없음'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openForEdit(assignment)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-xs border border-white/10 text-blue-300 hover:bg-white/5"
                  >
                    <Edit className="w-3 h-3" />
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(assignment.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-xs border border-white/10 text-red-300 hover:bg-white/5"
                  >
                    <Trash2 className="w-3 h-3" />
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-black border border-white/10 w-full max-w-lg">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">{editingAssignment ? '과제 수정' : '새 과제 생성'}</h3>
              <p className="text-sm text-gray-400 mt-1">과제의 세부 내용을 입력하세요.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-[0.2em] mb-2">제목</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-[0.2em] mb-2">설명</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-[0.2em] mb-2">마감일</label>
                  <input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-[0.2em] mb-2">배점</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-300 border border-white/10 hover:bg-white/5"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-60"
                >
                  {saving ? '저장 중...' : editingAssignment ? '과제 수정' : '과제 생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function CourseStudents({ enrollments }) {
  const total = enrollments.length
  const rows = enrollments
    .map((enrollment) => {
      const enrolledAt = enrollment.enrolledAt?.toDate?.()
        ? enrollment.enrolledAt.toDate()
        : enrollment.enrolledAt
        ? new Date(enrollment.enrolledAt)
        : null

      const profile = enrollment.user || {}
      const studentInfo = profile.studentInfo || {}

      return {
        id: enrollment.id,
        name: profile.displayName || enrollment.userName || enrollment.userEmail || enrollment.userId,
        email: profile.email || enrollment.userEmail,
        classInfo: studentInfo.grade
          ? `${studentInfo.grade}학년 ${studentInfo.class || '-'}반 ${studentInfo.studentNumber || '-'}번`
          : '미등록',
        enrolledAt,
        progress: enrollment.progress ?? null,
      }
    })
    .sort((a, b) => (b.enrolledAt?.getTime?.() || 0) - (a.enrolledAt?.getTime?.() || 0))

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">수강생 관리</h2>
        <p className="text-sm text-gray-400 mt-2">총 {total}명의 수강생이 등록되어 있습니다.</p>
      </div>

      {total === 0 ? (
        <div className="border border-white/10 bg-black/50 p-6 text-sm text-gray-400">아직 등록된 수강생이 없습니다.</div>
      ) : (
        <div className="border border-white/10 bg-black/40">
          <div className="grid grid-cols-[2fr,1.2fr,1fr,0.8fr] gap-4 px-6 py-3 border-b border-white/10 text-xs text-gray-500 uppercase tracking-[0.2em]">
            <span>수강생</span>
            <span>학급 정보</span>
            <span>등록일</span>
            <span>진행률</span>
          </div>
          <ul className="divide-y divide-white/10 max-h-[28rem] overflow-y-auto">
            {rows.map((row) => (
              <li key={row.id} className="px-6 py-4 grid grid-cols-[2fr,1.2fr,1fr,0.8fr] gap-4 text-sm text-gray-300">
                <div>
                  <p className="font-semibold text-white">{row.name}</p>
                  {row.email && <p className="text-xs text-gray-500">{row.email}</p>}
                </div>
                <span>{row.classInfo}</span>
                <span>{row.enrolledAt ? row.enrolledAt.toLocaleString('ko-KR') : '기록 없음'}</span>
                <span>{row.progress != null ? `${row.progress}%` : '미집계'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function formatDate(value) {
  if (!value) return '미정'
  const date = value?.toDate?.() || (typeof value === 'string' || value instanceof Date ? new Date(value) : null)
  if (!date || Number.isNaN(date.getTime())) return '미정'
  return date.toLocaleString('ko-KR')
}

function CourseSelector({ courses, activeCourseId }) {
  const navigate = useNavigate()
  return (
    <div className="border border-white/10 bg-black/40">
      <div className="px-4 py-3 border-b border-white/10 text-xs text-gray-500 uppercase tracking-[0.3em]">
        강좌 선택
      </div>
      <ul className="max-h-72 overflow-y-auto">
        {courses.map((course) => (
          <li key={course.id}>
            <button
              onClick={() => navigate(`/admin/course-manager/course/${course.id}`)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-white/5 last:border-b-0 ${
                course.id === activeCourseId
                  ? 'bg-blue-500/20 text-white border-blue-400/40'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <p className="font-semibold line-clamp-1">{course.title || '제목 미정'}</p>
              <p className="text-xs text-gray-400">등록 {course.enrollmentCount || 0}명</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
