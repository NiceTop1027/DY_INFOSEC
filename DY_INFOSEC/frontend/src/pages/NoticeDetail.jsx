import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getNotice } from '../services/noticeService'
import { ArrowLeft, Eye, Calendar, User, Tag } from 'lucide-react'

export default function NoticeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotice()
  }, [id])

  const loadNotice = async () => {
    try {
      const data = await getNotice(id)
      setNotice(data)
    } catch (error) {
      console.error('Error loading notice:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return '-'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryLabel = (category) => {
    const labels = {
      general: 'GENERAL',
      event: 'EVENT',
      update: 'UPDATE',
      important: 'IMPORTANT'
    }
    const normalizedCategory = category?.toLowerCase() || 'general'
    return labels[normalizedCategory] || 'GENERAL'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">LOADING...</p>
        </div>
      </div>
    )
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black text-white mb-4">Notice Not Found</h2>
          <button
            onClick={() => navigate('/notices')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Back to Notices
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Back to List</span>
        </button>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="border-b border-white/10 p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 text-purple-300 text-xs font-bold tracking-wider">
                {getCategoryLabel(notice.category)}
              </span>
              {notice.isPinned && (
                <span className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-xs font-bold tracking-wider">
                  PINNED
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-black text-white mb-6 leading-tight">{notice.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-purple-400" />
                <span className="font-mono">{notice.author || 'Admin'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="font-mono">{formatDate(notice.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="font-mono">{notice.views || 0} views</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                {notice.content}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-8">
            <button
              onClick={() => navigate('/notices')}
              className="px-8 py-3 bg-white/5 border border-white/20 text-white font-bold hover:bg-white/10 hover:border-purple-500/50 transition-all"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
