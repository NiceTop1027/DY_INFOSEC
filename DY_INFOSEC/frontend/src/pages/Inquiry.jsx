import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MessageSquare, Send, Shield, Mail, User, AlertCircle } from 'lucide-react'
import { db } from '../config/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuthStore } from '../store/authStore'

export default function Inquiry() {
  const { user } = useAuthStore()
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || ''
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    try {
      await addDoc(collection(db, 'contacts'), {
        name: data.name,
        email: data.email,
        category: data.category,
        subject: data.subject,
        message: data.message,
        userId: user?.uid || null,
        status: 'pending',
        createdAt: serverTimestamp()
      })
      
      setSuccess(true)
      reset()
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      console.error('Error submitting inquiry:', err)
      setError('문의 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-6 relative">
            <MessageSquare className="w-12 h-12 text-white" />
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
          <h1 className="text-5xl font-black text-white mb-3">CONTACT US</h1>
          <p className="text-gray-400 text-lg">문의사항을 남겨주시면 빠른 시일 내에 답변드리겠습니다</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10">
          {success && (
            <div className="mb-6 p-6 bg-green-500/10 border border-green-500/50">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-green-400 mb-2">문의 접수 완료!</h3>
                  <p className="text-gray-300">
                    문의가 성공적으로 등록되었습니다. 빠른 시일 내에 답변드리겠습니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400 font-mono text-sm">ERROR: {error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wider">
                  NAME *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    {...register('name', { required: '이름을 입력하세요' })}
                    type="text"
                    className="w-full bg-black/40 border border-white/20 text-white pl-12 pr-4 py-3 focus:outline-none focus:border-purple-500 transition-colors font-mono"
                    placeholder="이름"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400 font-mono">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wider">
                  EMAIL *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    {...register('email', { 
                      required: '이메일을 입력하세요',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: '올바른 이메일 형식이 아닙니다'
                      }
                    })}
                    type="email"
                    className="w-full bg-black/40 border border-white/20 text-white pl-12 pr-4 py-3 focus:outline-none focus:border-purple-500 transition-colors font-mono"
                    placeholder="email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400 font-mono">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wider">
                CATEGORY *
              </label>
              <select
                {...register('category', { required: '문의 유형을 선택하세요' })}
                className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors font-mono"
              >
                <option value="" className="bg-black">선택하세요</option>
                <option value="general" className="bg-black">일반 문의</option>
                <option value="application" className="bg-black">지원 관련</option>
                <option value="course" className="bg-black">교육 과정</option>
                <option value="technical" className="bg-black">기술 지원</option>
                <option value="other" className="bg-black">기타</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-400 font-mono">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wider">
                SUBJECT *
              </label>
              <input
                {...register('subject', { required: '제목을 입력하세요' })}
                type="text"
                className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors font-mono"
                placeholder="문의 제목"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-400 font-mono">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wider">
                MESSAGE *
              </label>
              <textarea
                {...register('message', { 
                  required: '내용을 입력하세요',
                  minLength: {
                    value: 10,
                    message: '최소 10자 이상 입력해주세요'
                  }
                })}
                rows={8}
                className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors font-mono resize-none"
                placeholder="문의 내용을 상세히 작성해주세요..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-400 font-mono">{errors.message.message}</p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 font-bold tracking-wider hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  SENDING...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  SEND MESSAGE
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
