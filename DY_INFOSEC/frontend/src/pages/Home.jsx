import { Link } from 'react-router-dom'
import { Shield, Users, Award, BookOpen, Target, Zap, ArrowRight, Star, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative snap-y snap-mandatory overflow-y-scroll h-screen">
      {/* Global Grid Background - 전체 페이지에 적용 */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>
      
      {/* Hero Section - Bento Grid Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden snap-start snap-always">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent"></div>
        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent"></div>
        
        {/* Floating Elements with Animation */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Floating Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-sm font-medium text-white/90">Next Generation Security Education</span>
            </div>
            
            {/* Main Title with Glitch Effect */}
            <h1 className="text-6xl md:text-8xl font-black mb-8 relative">
              <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent blur-sm">
                DYㅣWHITE HAT
              </span>
              <span className="relative bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                DYㅣWHITE HAT
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              코드로 세상을 지키는 사람들의 이야기가 시작됩니다
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses" className="group relative px-8 py-4 bg-white text-black font-bold overflow-hidden">
                <span className="relative z-10 group-hover:opacity-0 transition-opacity duration-300">교육과정 보기</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                <span className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white font-bold transition-opacity duration-300">
                  Let's Go →
                </span>
              </Link>
              <Link to="/signup" className="px-8 py-4 border-2 border-white/20 text-white font-bold hover:bg-white/5 backdrop-blur-sm transition-all">
                지금 시작하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Diagonal Layout */}
      <section className="relative min-h-screen flex items-center overflow-hidden snap-start snap-always">
        {/* Top Fade */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black to-transparent"></div>
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              Why Choose Us
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto"></div>
          </div>
          
          {/* Diagonal Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Tilted */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/20 p-10 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <Shield className="w-16 h-16 mb-6 text-purple-400" />
                <h3 className="text-3xl font-black mb-4 text-white">실무 중심</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  현직 보안 전문가의 멘토링과 실제 프로젝트 경험
                </p>
                <div className="mt-6 w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              </div>
            </div>
            
            {/* Feature 2 - Tilted Opposite */}
            <div className="group relative lg:mt-12">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-500/30 transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-blue-500/20 p-10 transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <Users className="w-16 h-16 mb-6 text-blue-400" />
                <h3 className="text-3xl font-black mb-4 text-white">소수정예</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  체계적인 선발 과정을 통한 맞춤형 교육 제공
                </p>
                <div className="mt-6 w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              </div>
            </div>
            
            {/* Feature 3 - Tilted */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-cyan-500/30 transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-cyan-500/20 p-10 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <Award className="w-16 h-16 mb-6 text-cyan-400" />
                <h3 className="text-3xl font-black mb-4 text-white">다양한 혜택</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  교육 지원금, 수료증, 우수 수료생 특전 및 취업 연계
                </p>
                <div className="mt-6 w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories - Hexagon Grid */}
      <section className="relative min-h-screen flex items-center overflow-hidden snap-start snap-always">
        {/* Top Fade */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
              CURRICULUM
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto"></div>
          </div>
          
          {/* Staggered Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/courses" className="group relative overflow-hidden bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-500/20 p-8 hover:border-purple-500 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
              <BookOpen className="w-12 h-12 text-purple-400 mb-6 relative z-10" />
              <h3 className="text-2xl font-black text-white mb-3 relative z-10">기초 교육</h3>
              <p className="text-gray-400 leading-relaxed relative z-10">
                정보보안 기초 이론 및 윤리, 법규 교육
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
            
            <Link to="/courses" className="group relative overflow-hidden bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-sm border border-blue-500/20 p-8 hover:border-blue-500 transition-all duration-500 md:mt-12">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
              <Target className="w-12 h-12 text-blue-400 mb-6 relative z-10" />
              <h3 className="text-2xl font-black text-white mb-3 relative z-10">웹 해킹</h3>
              <p className="text-gray-400 leading-relaxed relative z-10">
                웹 취약점 분석 및 모의해킹 실습
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
            
            <Link to="/courses" className="group relative overflow-hidden bg-gradient-to-br from-cyan-900/50 to-teal-900/50 backdrop-blur-sm border border-cyan-500/20 p-8 hover:border-cyan-500 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
              <Zap className="w-12 h-12 text-cyan-400 mb-6 relative z-10" />
              <h3 className="text-2xl font-black text-white mb-3 relative z-10">시스템 해킹</h3>
              <p className="text-gray-400 leading-relaxed relative z-10">
                시스템 보안 및 리버스 엔지니어링
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
            
            <Link to="/courses" className="group relative overflow-hidden bg-gradient-to-br from-teal-900/50 to-purple-900/50 backdrop-blur-sm border border-teal-500/20 p-8 hover:border-teal-500 transition-all duration-500 md:mt-12">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all"></div>
              <Shield className="w-12 h-12 text-teal-400 mb-6 relative z-10" />
              <h3 className="text-2xl font-black text-white mb-3 relative z-10">프로젝트</h3>
              <p className="text-gray-400 leading-relaxed relative z-10">
                팀 프로젝트 및 CTF 대회 참가
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Split Screen */}
      <section className="relative min-h-screen flex items-center overflow-hidden snap-start snap-always">
        {/* Left Side - Dark */}
        <div className="w-full lg:w-1/2 bg-black p-12 lg:p-20 min-h-screen flex items-center">
          <div className="max-w-xl">
            <div className="text-6xl font-black text-white mb-8 leading-none">
              START<br />YOUR<br />JOURNEY
            </div>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              정보보안 전문가로의 첫 걸음을 지금 시작하세요
            </p>
            <Link to="/signup" className="group inline-flex items-center gap-4 bg-white text-black px-10 py-5 font-bold text-lg relative overflow-hidden">
              <span className="relative z-10">학습 시작하기</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 transform translate-x-full group-hover:translate-x-0 transition-transform"></div>
            </Link>
          </div>
        </div>
        
        {/* Right Side - Gradient */}
        <div className="hidden lg:block w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-20 min-h-screen relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          <div className="relative z-10 h-full flex flex-col justify-center">
            <div className="space-y-8">
              <div className="flex items-center gap-4 text-white">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <div className="font-bold text-2xl">1000+</div>
                  <div className="text-white/70">수료생</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <div className="font-bold text-2xl">50+</div>
                  <div className="text-white/70">교육 과정</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <div className="font-bold text-2xl">95%</div>
                  <div className="text-white/70">만족도</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
