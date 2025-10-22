import { useMemo } from 'react'
import { buildBriefingSlides } from '../utils/briefing'

export default function CourseBriefingViewer({ course, title = 'COURSE BRIEFING', className = '' }) {
  const sections = useMemo(() => buildBriefingSlides(course), [course])

  if (!sections.length) {
    return (
      <div className={`bg-black/20 border border-white/10 p-8 ${className}`}>
        <h2 className="text-sm font-bold tracking-[0.3em] text-gray-500">{title}</h2>
        <p className="mt-4 text-sm text-gray-400 whitespace-pre-line">
          강의 브리핑 자료가 아직 등록되지 않았습니다. 합격 후 담당자에게 문의해 주세요.
        </p>
      </div>
    )
  }

  return (
    <div className={`bg-black/20 border border-white/10 p-8 space-y-8 ${className}`}>
      <div>
        <h2 className="text-sm font-bold tracking-[0.3em] text-gray-500">{title}</h2>
        <p className="mt-2 text-xs text-gray-500">최종 합격자 전용 안내입니다.</p>
      </div>

      {sections.map((section, idx) => (
        <div key={idx} className="border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 font-mono">SECTION {String(idx + 1).padStart(2, '0')}</p>
              <h3 className="text-xl font-black text-white mt-1">{section.title || '제목 미정'}</h3>
              {section.subtitle && (
                <p className="text-sm text-gray-400 mt-1">{section.subtitle}</p>
              )}
            </div>
          </div>

          {section.body && (
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{section.body}</p>
          )}

          {section.list && section.list.length > 0 && (
            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              {section.list.map((item, itemIdx) => (
                <li key={itemIdx} className="flex gap-2">
                  <span className="text-purple-300">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
