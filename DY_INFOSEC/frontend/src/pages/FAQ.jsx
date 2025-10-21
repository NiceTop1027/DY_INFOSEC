import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function FAQ() {
  const [openId, setOpenId] = useState(null)

  const faqs = [
    {
      id: 1,
      category: 'GENERAL',
      question: '두경정보보안학교는 어떤 곳인가요?',
      answer: '두경정보보안학교는 미래의 화이트해커를 양성하는 정보보안 전문 교육기관입니다. 실무 중심의 교육과 현직 전문가 멘토링을 통해 실전 역량을 키울 수 있습니다.'
    },
    {
      id: 2,
      category: 'APPLICATION',
      question: '지원 자격이 어떻게 되나요?',
      answer: '정보보안에 관심이 있는 대학생 및 취업준비생이라면 누구나 지원 가능합니다. 기초 프로그래밍 지식이 있으면 더욱 좋습니다.'
    },
    {
      id: 3,
      category: 'COURSE',
      question: '교육 과정은 어떻게 구성되어 있나요?',
      answer: '기초 교육부터 심화 교육, 팀 프로젝트까지 단계별로 구성되어 있습니다. 온라인 강의와 오프라인 실습을 병행하여 진행됩니다.'
    },
    {
      id: 4,
      category: 'COURSE',
      question: '수강료는 얼마인가요?',
      answer: '본 교육은 무료로 제공되며, 우수 교육생에게는 교육 지원금도 지급됩니다.'
    },
    {
      id: 5,
      category: 'GENERAL',
      question: '수료 후 혜택은 무엇인가요?',
      answer: '수료증 발급, 우수 수료생 특전, 취업 연계 지원, 네트워킹 이벤트 참가 기회 등 다양한 혜택이 제공됩니다.'
    }
  ]

  const getCategoryLabel = (category) => {
    const labels = {
      GENERAL: 'GENERAL',
      APPLICATION: 'APPLICATION',
      COURSE: 'COURSE',
      TECHNICAL: 'TECHNICAL',
      PAYMENT: 'PAYMENT'
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
