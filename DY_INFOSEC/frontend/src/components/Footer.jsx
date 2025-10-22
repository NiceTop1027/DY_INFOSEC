import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Terminal, Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="https://i.namu.wiki/i/ObQ4LgeNZBe9Mz-E8da2_QVnq2TP-xoSU0cNj9m3c5rnVv0k1ag1X9W9a28WTtUTeksCmHmOFhBjtyBrgR3k-Q.png" 
                alt="덕영고등학교" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg font-black text-white">
                덕영고등학교<span className="text-purple-400">ㅣ정보보안소프트웨어과</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              미래의 화이트해커와<br />정보보안 전문가를 양성하는<br />특성화 학과
            </p>
            <div className="flex space-x-3 mt-6">
              <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center hover:border-purple-500/50 hover:bg-white/10 transition-all">
                <Github className="w-5 h-5 text-gray-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center hover:border-purple-500/50 hover:bg-white/10 transition-all">
                <Twitter className="w-5 h-5 text-gray-400" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 text-sm tracking-wider">QUICK LINKS</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/courses" className="text-gray-400 hover:text-purple-400 transition-colors">Courses</Link></li>
              <li><Link to="/notices" className="text-gray-400 hover:text-purple-400 transition-colors">Notice</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-purple-400 transition-colors">FAQ</Link></li>
              <li><Link to="/inquiry" className="text-gray-400 hover:text-purple-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 text-sm tracking-wider">INFORMATION</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-gray-400 hover:text-purple-400 transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 text-sm tracking-wider">CONTACT</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-4 h-4 text-purple-400 mt-0.5" />
                <span>경기도 고양시 덕양구 화정동 868</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4 text-purple-400" />
                <span>031-969-3800</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>deokyoung@hs.kr</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className="text-center md:text-left">
              <p className="font-bold text-white mb-2">덕영고등학교 정보보안소프트웨어과</p>
              <p>설립: 1974년 3월 1일 | 교훈: 성실, 근면, 봉사</p>
              <p className="mt-1">&copy; 2024 Deokyoung High School. All rights reserved.</p>
            </div>
            <p className="mt-4 md:mt-0">Made with <span className="text-purple-400">♥</span> for Security</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
