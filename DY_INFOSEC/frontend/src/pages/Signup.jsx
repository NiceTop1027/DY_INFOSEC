import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../store/authStore'
import { Terminal, User, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react'

export default function Signup() {
  const navigate = useNavigate()
  const { signup, loading } = useAuthStore()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    setError('')
    setSuccess(false)
    const result = await signup(data.email, data.password, data.displayName)
    
    if (result.success && result.needsVerification) {
      setSuccess(true)
      setUserEmail(data.email)
    } else if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || '회원가입에 실패했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="max-w-4xl w-full mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-6 relative">
            <Terminal className="w-12 h-12 text-white" />
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
          <h2 className="text-5xl font-black text-white mb-3">CREATE ACCOUNT</h2>
          <p className="text-gray-400 text-lg">Join the elite security community</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10">
          {success && (
            <div className="mb-6 p-6 bg-green-500/10 border border-green-500/50">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-green-400 mb-2">회원가입 완료!</h3>
                  <p className="text-gray-300 mb-3">
                    <span className="font-bold text-white">{userEmail}</span>로 인증 이메일이 발송되었습니다.
                  </p>
                  <div className="bg-black/30 border border-yellow-500/30 p-4 rounded mb-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-300">
                        <p className="font-bold text-yellow-400 mb-1">이메일이 보이지 않나요?</p>
                        <ul className="space-y-1 text-gray-400">
                          <li>• <span className="text-white font-semibold">스팸 메일함</span>을 확인해주세요</li>
                          <li>• 이메일 도착까지 최대 5분 소요될 수 있습니다</li>
                          <li>• 이메일 주소를 정확히 입력했는지 확인해주세요</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    이메일의 인증 링크를 클릭한 후 <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold underline">로그인</Link>해주세요.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400">
              <span className="font-mono text-sm">ERROR: {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wider">
                DISPLAY NAME *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  {...register('displayName', { 
                    required: '이름을 입력하세요',
                    minLength: { value: 2, message: '2자 이상 입력하세요' }
                  })}
                  type="text"
                  className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors font-mono"
                  placeholder="Enter your name"
                />
              </div>
              {errors.displayName && (
                <p className="mt-2 text-sm text-red-400 font-mono">{errors.displayName.message}</p>
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
                  className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors font-mono"
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-400 font-mono">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wider">
                  PASSWORD *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    {...register('password', { 
                      required: '비밀번호를 입력하세요',
                      minLength: { value: 6, message: '6자 이상 입력하세요' }
                    })}
                    type="password"
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors font-mono"
                    placeholder="Enter password"
                  />
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400 font-mono">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wider">
                  CONFIRM PASSWORD *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    {...register('confirmPassword', { 
                      required: '비밀번호를 다시 입력하세요',
                      validate: value => value === password || '비밀번호가 일치하지 않습니다'
                    })}
                    type="password"
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors font-mono"
                    placeholder="Confirm password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-400 font-mono">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 bg-black/50 border border-white/10 checked:bg-purple-500 focus:ring-0"
              />
              <label className="ml-3 text-sm text-gray-400">
                <Link to="/terms" className="text-purple-400 hover:text-purple-300">이용약관</Link> 및{' '}
                <Link to="/privacy" className="text-purple-400 hover:text-purple-300">개인정보처리방침</Link>에 동의합니다.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold tracking-wider hover:shadow-lg hover:shadow-purple-500/50 transition-all relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">{loading ? 'CREATING...' : 'CREATE ACCOUNT'}</span>
              <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
