import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { db } from '../config/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Shield, Users, BookOpen, FileText, Settings, BarChart3, Mail } from 'lucide-react'

export default function Admin() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalNotices: 0,
    totalApplications: 0,
    totalContacts: 0,
  })
  const [users, setUsers] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const usersCollection = collection(db, 'users')
      const coursesCollection = collection(db, 'courses')
      const noticesCollection = collection(db, 'notices')
      const applicationsCollection = collection(db, 'applications')
      const contactsCollection = collection(db, 'contacts')

      const [usersSnapshot, coursesSnapshot, noticesSnapshot, applicationsSnapshot, contactsSnapshot] = await Promise.all([
        getDocs(usersCollection),
        getDocs(coursesCollection),
        getDocs(noticesCollection),
        getDocs(applicationsCollection),
        getDocs(contactsCollection),
      ])

      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })).sort((a, b) => {
        // createdAt으로 정렬 (최신순)
        const aTime = a.createdAt?.toMillis?.() || 0
        const bTime = b.createdAt?.toMillis?.() || 0
        return bTime - aTime
      })

      const contactsData = contactsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })).sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0
        const bTime = b.createdAt?.toMillis?.() || 0
        return bTime - aTime
      })

      setUsers(usersData)
      setContacts(contactsData)
      setStats({
        totalUsers: usersData.length,
        totalCourses: coursesSnapshot.size,
        totalNotices: noticesSnapshot.size,
        totalApplications: applicationsSnapshot.size,
        totalContacts: contactsData.length,
      })
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">ADMIN PANEL</h1>
              <p className="text-gray-400">Welcome, {user?.displayName}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-purple-400" />
              <span className="text-3xl font-black text-white">{stats.totalUsers}</span>
            </div>
            <h3 className="text-gray-400 font-medium">Total Users</h3>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 text-blue-400" />
              <span className="text-3xl font-black text-white">{stats.totalCourses}</span>
            </div>
            <h3 className="text-gray-400 font-medium">Total Courses</h3>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-cyan-400" />
              <span className="text-3xl font-black text-white">{stats.totalNotices}</span>
            </div>
            <h3 className="text-gray-400 font-medium">Total Notices</h3>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-green-400" />
              <span className="text-3xl font-black text-white">{stats.totalApplications}</span>
            </div>
            <h3 className="text-gray-400 font-medium">Applications</h3>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <Mail className="w-8 h-8 text-yellow-400" />
              <span className="text-3xl font-black text-white">{stats.totalContacts}</span>
            </div>
            <h3 className="text-gray-400 font-medium">Contact Messages</h3>
          </div>
        </div>

        {/* Contact Messages */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 mb-12">
          <h2 className="text-2xl font-black text-white mb-6">CONTACT MESSAGES</h2>
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <p className="text-gray-400 text-center py-8">문의 내역이 없습니다.</p>
            ) : (
              contacts.slice(0, 5).map((contact) => (
                <div key={contact.id} className="bg-black/40 border border-white/10 p-5 hover:border-purple-500/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <Mail className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-bold">{contact.name}</p>
                          <span className="px-2 py-0.5 text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            {contact.category?.toUpperCase() || 'GENERAL'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm font-mono">{contact.email}</p>
                        {contact.subject && (
                          <p className="text-white text-sm font-semibold mt-2">{contact.subject}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {contact.createdAt?.toDate().toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm ml-8 line-clamp-2">{contact.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
          <h2 className="text-2xl font-black text-white mb-6">USER MANAGEMENT</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-bold">NAME</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-bold">EMAIL</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-bold">ROLE</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-bold">JOINED</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-bold">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{user.displayName}</td>
                    <td className="py-3 px-4 text-gray-400 font-mono text-sm">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 text-xs font-bold border ${
                        user.role === 'admin' 
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}>
                        {user.role?.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {user.createdAt?.toDate().toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Link to="/admin/courses" className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-purple-500/50 transition-all group block">
            <BookOpen className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-black text-white mb-2">Manage Courses</h3>
            <p className="text-gray-400 text-sm">Create and edit courses</p>
          </Link>

          <Link to="/admin/notices" className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-blue-500/50 transition-all group block">
            <FileText className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-black text-white mb-2">Manage Notices</h3>
            <p className="text-gray-400 text-sm">Post announcements</p>
          </Link>

          <Link to="/admin/applications" className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-cyan-500/50 transition-all group block">
            <Settings className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-black text-white mb-2">Manage Applications</h3>
            <p className="text-gray-400 text-sm">Review student applications</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
