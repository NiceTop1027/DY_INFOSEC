import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllNotices } from '../services/noticeService'
import { Bell, Pin, AlertCircle, Eye, ChevronRight } from 'lucide-react'

export default function Notices() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotices()
  }, [])

  const loadNotices = async () => {
    try {
      const data = await getAllNotices(50)
      setNotices(data)
    } catch (error) {
      console.error('Error loading notices:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return '-'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
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

  return (
    <div className="min-h-screen bg-black py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">NOTICE</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg">Stay updated with latest news</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 mt-4 font-mono">LOADING...</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-white mb-3">No Notices Available</h3>
            <p className="text-gray-400">공지사항이 아직 등록되지 않았습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
            <Link
              key={notice.id}
              to={`/notices/${notice.id}`}
              className="group block bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 p-6 transition-all duration-500 relative overflow-hidden"
            >
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500"></div>
              
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {notice.isPinned && (
                      <Pin className="w-5 h-5 text-purple-400" />
                    )}
                    {notice.isImportant && (
                      <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
                    )}
                    <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 text-purple-300 text-xs font-bold tracking-wider">
                      {getCategoryLabel(notice.category)}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-purple-400 transition-colors">
                    {notice.title}
                  </h3>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span className="font-mono">{formatDate(notice.createdAt)}</span>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-purple-400" />
                      <span className="font-mono">{notice.views || 0}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-2 transition-all" />
              </div>
              
              {/* Bottom Line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
          ))}
          </div>
        )}
      </div>
    </div>
  )
}
