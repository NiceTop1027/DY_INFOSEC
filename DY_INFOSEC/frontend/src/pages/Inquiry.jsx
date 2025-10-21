import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MessageSquare } from 'lucide-react'
import api from '../lib/api'

export default function Inquiry() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      await api.post('/inquiries', data)
      setSuccess(true)
      setError('')
      reset()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || '문의 등록에 실패했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">문의하기</h1>
          <p className="text-gray-600 mt-2">궁금한 사항을 문의해주세요</p>
        </div>

        <div className="card">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              문의가 성공적으로 등록되었습니다. 빠른 시일 내에 답변드리겠습니다.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                문의 유형 *
              </label>
              <select
                {...register('category', { required: '문의 유형을 선택하세요' })}
                className="input"
              >
                <option value="">선택하세요</option>
                <option value="GENERAL">일반 문의</option>
                <option value="APPLICATION">지원 관련</option>
                <option value="COURSE">교육 과정</option>
                <option value="TECHNICAL">기술 지원</option>
                <option value="OTHER">기타</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                {...register('title', { required: '제목을 입력하세요' })}
                type="text"
                className="input"
                placeholder="문의 제목을 입력하세요"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 *
              </label>
              <textarea
                {...register('content', { required: '내용을 입력하세요' })}
                rows={8}
                className="input"
                placeholder="문의 내용을 상세히 작성해주세요"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            <button type="submit" className="w-full btn btn-primary py-3">
              문의 등록
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
