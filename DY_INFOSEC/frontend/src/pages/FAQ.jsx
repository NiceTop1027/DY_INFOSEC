import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function FAQ() {
  const [openId, setOpenId] = useState(null)

  const faqs = [
    {
      id: 1,
      category: 'GENERAL',
      question: '덕영고등학교 정보보안소프트웨어과는 어떤 곳인가요?',
      answer: '덕영고등학교 정보보안소프트웨어과는 미래의 화이트해커와 정보보안 전문가를 양성하는 특성화 학과입니다. 실무 중심의 교육과 현직 전문가 멘토링을 통해 실전 역량을 키울 수 있습니다.'
    },
    {
      id: 2,
      category: 'APPLICATION',
      question: '동아리 가입은 어떻게 하나요?',
      answer: '덕영고등학교 정보보안소프트웨어과 재학생이라면 누구나 지원 가능합니다. 정보보안에 대한 열정과 배우고자 하는 의지가 있다면 환영합니다.'
    },
    {
      id: 3,
      category: 'COURSE',
      question: '교육 과정은 어떻게 구성되어 있나요?',
      answer: '기초 보안 개념부터 실전 해킹 기법, 팀 프로젝트까지 단계별로 구성되어 있습니다. 방과 후 활동과 주말 세미나를 통해 심화 학습을 진행합니다.'
    },
    {
      id: 4,
      category: 'ACTIVITY',
      question: '동아리 활동은 어떻게 진행되나요?',
      answer: '주 2회 정기 모임을 통해 이론 학습과 실습을 진행하며, 월 1회 외부 전문가 특강과 해킹 대회 참가 기회가 제공됩니다. 방학 중에는 집중 프로젝트를 수행합니다.'
    },
    {
      id: 5,
      category: 'GENERAL',
      question: '동아리 활동을 통해 얻을 수 있는 것은?',
      answer: '정보보안 실무 역량 강화, 각종 보안 대회 참가 및 수상 경력, 생활기록부 기재를 통한 입시 우대, 선배-후배 멘토링 네트워크 구축 등 다양한 혜택이 있습니다.'
    }
  ]

  const getCategoryLabel = (category) => {
    const labels = {
      GENERAL: 'GENERAL',
      APPLICATION: 'APPLICATION',
      COURSE: 'COURSE',
      ACTIVITY: 'ACTIVITY',
      TECHNICAL: 'TECHNICAL'
    }
    return labels[category] || 'GENERAL'
  }

  return (
    <div className="min-h-screen bg-black py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-6 relative">
            <HelpCircle className="w-10 h-10 text-white" />
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">FAQ</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg">Find answers to common questions</p>
        </div>

        <div className="space-y-4 mb-10">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500">
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between text-left p-6 hover:bg-white/5 transition-all"
              >
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 text-purple-300 text-xs font-bold tracking-wider">
                      {getCategoryLabel(faq.category)}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-white">{faq.question}</span>
                </div>
                {openId === faq.id ? (
                  <ChevronUp className="w-6 h-6 text-purple-400 ml-4" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-600 ml-4" />
                )}
              </button>
              
              {openId === faq.id && (
                <div className="px-6 pb-6 pt-2 border-t border-white/10 animate-fadeIn">
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 p-8 text-center">
          <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <p className="text-gray-300 text-lg mb-4">
            찾으시는 답변이 없으신가요?
          </p>
          <Link to="/inquiry" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
            문의하기
          </Link>
        </div>
      </div>
    </div>
  )
}
