import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../store/authStore'
import { User, Lock, Bell, Shield } from 'lucide-react'
import api from '../lib/api'

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: user
  })

  const onSubmit = async (data) => {
    try {
      const response = await api.put('/users/profile', data)
      updateUser(response.data.data)
      setSuccess('프로필이 업데이트되었습니다.')
      setError('')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || '업데이트에 실패했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-black py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-3">MY PROFILE</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mb-4"></div>
          <p className="text-gray-400 text-lg">계정 정보를 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 transition-all font-bold ${
                    activeTab === 'profile'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>프로필</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 transition-all font-bold ${
                    activeTab === 'security'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  <span>보안</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 transition-all font-bold ${
                    activeTab === 'notifications'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span>알림 설정</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 transition-all font-bold ${
                    activeTab === 'privacy'
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span>개인정보</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8">
              {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 text-green-400">
                  <span className="font-mono text-sm">SUCCESS: {success}</span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400">
                  <span className="font-mono text-sm">ERROR: {error}</span>
                </div>
              )}

              {activeTab === 'profile' && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <h2 className="text-3xl font-black text-white mb-8 tracking-wider">PROFILE INFO</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wider">
                        DISPLAY NAME
                      </label>
                      <input
                        type="text"
                        value={user?.displayName}
                        disabled
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-gray-500 font-mono cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wider">
                        EMAIL
                      </label>
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-gray-500 font-mono cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wider">
                        ROLE
                      </label>
                      <input
                        type="text"
                        value={user?.role?.toUpperCase()}
                        disabled
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-purple-400 font-mono font-bold cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wider">
                        USER ID
                      </label>
                      <input
                        type="text"
                        value={user?.uid?.substring(0, 8) + '...'}
                        disabled
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-gray-500 font-mono cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wider">
                        PHONE
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        placeholder="010-1234-5678"
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wider">
                        전공
                      </label>
                      <input
                        {...register('major')}
                        type="text"
                        placeholder="전공을 입력하세요"
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <button type="submit" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                    저장하기
                  </button>
                </form>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-white mb-8 tracking-wider">SECURITY</h2>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wider">
                      현재 비밀번호
                    </label>
                    <input type="password" className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-mono" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wider">
                      새 비밀번호
                    </label>
                    <input type="password" className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-mono" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wider">
                      새 비밀번호 확인
                    </label>
                    <input type="password" className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-mono" />
                  </div>

                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all">
                    비밀번호 변경
                  </button>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-white mb-8 tracking-wider">NOTIFICATIONS</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-black/30 border border-white/10 hover:border-cyan-500/30 transition-colors">
                      <span className="text-gray-200 font-medium">이메일 알림</span>
                      <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-black/50 text-cyan-500 focus:ring-cyan-500" />
                    </label>
                    
                    <label className="flex items-center justify-between p-4 bg-black/30 border border-white/10 hover:border-cyan-500/30 transition-colors">
                      <span className="text-gray-200 font-medium">공지사항 알림</span>
                      <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-black/50 text-cyan-500 focus:ring-cyan-500" />
                    </label>
                    
                    <label className="flex items-center justify-between p-4 bg-black/30 border border-white/10 hover:border-cyan-500/30 transition-colors">
                      <span className="text-gray-200 font-medium">과제 마감 알림</span>
                      <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-black/50 text-cyan-500 focus:ring-cyan-500" />
                    </label>
                  </div>

                  <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                    저장하기
                  </button>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-white mb-8 tracking-wider">PRIVACY</h2>
                  
                  <div className="p-6 bg-yellow-500/10 border border-yellow-500/30">
                    <p className="text-sm text-yellow-300 font-medium">
                      ⚠️ 회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
                    </p>
                  </div>

                  <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all">
                    회원 탈퇴
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
