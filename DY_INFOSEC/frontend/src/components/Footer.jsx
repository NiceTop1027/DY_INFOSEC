import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Terminal, Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black text-white">
                DY_<span className="text-purple-400">WHITEHAT</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              미래의 화이트해커를 양성하는<br />정보보안 전문 교육기관
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
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4 text-purple-400" />
                <span>02-1234-5678</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>info@whitehat.kr</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>Seoul, Korea</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2024 DY_WHITEHAT SCHOOL. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Made with <span className="text-purple-400">♥</span> for Security</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
