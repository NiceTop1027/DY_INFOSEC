import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { getAllNotices, createNotice, updateNotice, deleteNotice } from '../../services/noticeService'
import { FileText, Plus, Edit, Trash2, X } from 'lucide-react'

export default function ManageNotices() {
  const { user } = useAuthStore()
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    isPinned: false
  })

  useEffect(() => {
    loadNotices()
  }, [])

  const loadNotices = async () => {
    const data = await getAllNotices(100)
    setNotices(data)
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const noticeData = {
      ...formData,
      author: user?.displayName || user?.email,
      authorId: user?.uid
    }
    
    if (editingNotice) {
      await updateNotice(editingNotice.id, noticeData)
    } else {
      await createNotice(noticeData)
    }
    
    setShowModal(false)
    setEditingNotice(null)
    setFormData({
      title: '',
      content: '',
      category: 'general',
      isPinned: false
    })
    loadNotices()
  }

  const handleEdit = (notice) => {
    setEditingNotice(notice)
    setFormData({
      title: notice.title || '',
      content: notice.content || '',
      category: notice.category || 'general',
      isPinned: notice.isPinned || false
    })
    setShowModal(true)
  }

  const handleDelete = async (noticeId) => {
    if (confirm('정말 이 공지사항을 삭제하시겠습니까?')) {
      await deleteNotice(noticeId)
      loadNotices()
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return '-'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('ko-KR')
  }

  return (
    <div className="min-h-screen bg-black py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <Link to="/admin" className="text-gray-400 hover:text-white mb-2 inline-block">← Back to Admin</Link>
            <h1 className="text-5xl font-black text-white mb-3">MANAGE NOTICES</h1>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mb-4"></div>
          </div>
          <button
            onClick={() => {
              setEditingNotice(null)
              setFormData({
                title: '',
                content: '',
                category: 'general',
                isPinned: false
              })
              setShowModal(true)
            }}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            새 공지 작성
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div key={notice.id} className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 hover:border-purple-500/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {notice.isPinned && (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold border border-yellow-500/30">
                          PINNED
                        </span>
                      )}
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30">
                        {notice.category?.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">{notice.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{notice.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>작성자: {notice.author}</span>
                      <span>•</span>
                      <span>작성일: {formatDate(notice.createdAt)}</span>
                      <span>•</span>
                      <span>조회수: {notice.views || 0}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(notice)}
                      className="p-2 bg-white/5 border border-white/10 text-purple-400 hover:bg-white/10 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(notice.id)}
                      className="p-2 bg-white/5 border border-white/10 text-red-400 hover:bg-white/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black border border-white/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-black text-white">
                    {editingNotice ? 'EDIT NOTICE' : 'NEW NOTICE'}
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
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">CONTENT</label>
                    <textarea
                      required
                      rows={10}
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">CATEGORY</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="general">일반</option>
                        <option value="event">이벤트</option>
                        <option value="update">업데이트</option>
                        <option value="important">중요</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isPinned}
                          onChange={(e) => setFormData({...formData, isPinned: e.target.checked})}
                          className="w-5 h-5"
                        />
                        <span className="text-sm font-bold text-gray-300">PIN TO TOP</span>
                      </label>
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
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                    >
                      {editingNotice ? '수정' : '작성'}
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
