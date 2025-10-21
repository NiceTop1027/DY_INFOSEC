import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from '../lib/api'
import { FileText, Upload } from 'lucide-react'

export default function ApplicationForm() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      await api.post(`/applications`, {
        courseId: parseInt(courseId),
        ...data
      })
      alert('지원이 완료되었습니다!')
      navigate('/applications')
    } catch (err) {
      setError(err.response?.data?.message || '지원 신청에 실패했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">교육과정 지원신청</h1>
          <p className="text-gray-600 mt-2">정확한 정보를 입력해주세요</p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 지원 동기 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                지원 동기 *
              </label>
              <textarea
                {...register('motivation', { required: '지원 동기를 입력하세요' })}
                rows={5}
                className="input"
                placeholder="본 교육과정에 지원하게 된 동기를 작성해주세요"
              />
              {errors.motivation && (
                <p className="mt-1 text-sm text-red-600">{errors.motivation.message}</p>
              )}
            </div>

            {/* 학습 계획 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                학습 계획 *
              </label>
              <textarea
                {...register('studyPlan', { required: '학습 계획을 입력하세요' })}
                rows={5}
                className="input"
                placeholder="교육과정 수료 후 학습 계획을 작성해주세요"
              />
              {errors.studyPlan && (
                <p className="mt-1 text-sm text-red-600">{errors.studyPlan.message}</p>
              )}
            </div>

            {/* 진로 목표 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                진로 목표 *
              </label>
              <textarea
                {...register('careerGoal', { required: '진로 목표를 입력하세요' })}
                rows={5}
                className="input"
                placeholder="정보보안 분야에서의 진로 목표를 작성해주세요"
              />
              {errors.careerGoal && (
                <p className="mt-1 text-sm text-red-600">{errors.careerGoal.message}</p>
              )}
            </div>

            {/* 보유 기술 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보유 기술
              </label>
              <textarea
                {...register('technicalSkills')}
                rows={4}
                className="input"
                placeholder="보유하고 있는 기술 스택을 작성해주세요 (예: Python, Java, Linux 등)"
              />
            </div>

            {/* 자격증 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보유 자격증
              </label>
              <textarea
                {...register('certifications')}
                rows={3}
                className="input"
                placeholder="보유하고 있는 자격증을 작성해주세요"
              />
            </div>

            {/* 프로젝트 경험 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로젝트 경험
              </label>
              <textarea
                {...register('projects')}
                rows={4}
                className="input"
                placeholder="진행했던 프로젝트 경험을 작성해주세요"
              />
            </div>

            {/* 파일 업로드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이력서 (선택)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">파일을 선택하거나 드래그하세요</p>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  포트폴리오 (선택)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">파일을 선택하거나 드래그하세요</p>
                  <input type="file" className="hidden" accept=".pdf,.zip" />
                </div>
              </div>
            </div>

            {/* 동의 */}
            <div className="border-t border-gray-200 pt-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  제출한 정보가 사실임을 확인하며, 허위 정보 제출 시 불이익을 받을 수 있음을 이해합니다.
                </span>
              </label>
            </div>

            {/* 제출 버튼 */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary flex-1 py-3"
              >
                취소
              </button>
              <button type="submit" className="btn btn-primary flex-1 py-3">
                지원 신청하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
