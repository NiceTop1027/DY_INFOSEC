import { useLanguageStore } from '../i18n'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore()

  return (
    <button
      onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium"
      title={language === 'ko' ? 'Switch to English' : '한국어로 변경'}
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-bold">{language === 'ko' ? 'EN' : 'KO'}</span>
    </button>
  )
}
