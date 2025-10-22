export function buildBriefingSlides(course) {
  if (!course) return []

  const safeCourse = course || {}
  const slidesFromCustom = parseBriefingContent(safeCourse.briefingContent)
  if (slidesFromCustom.length > 0) {
    return slidesFromCustom
  }

  const lectures = Array.isArray(safeCourse.lectures) ? safeCourse.lectures : []
  const prerequisites = normalizeArrayField(safeCourse.prerequisites)
  const outcomes = normalizeArrayField(safeCourse.learningOutcomes)
  const benefits = normalizeArrayField(safeCourse.benefits)

  const levelLabel = (safeCourse.level || 'beginner').toString().toUpperCase()
  const categoryLabel = (safeCourse.category || 'GENERAL').toString().toUpperCase()

  const slides = []

  slides.push({
    title: 'COURSE OVERVIEW',
    subtitle: `${categoryLabel} • ${levelLabel}`,
    body: safeCourse.description || '강의 소개가 준비 중입니다.'
  })

  if (lectures.length) {
    slides.push({
      title: 'LECTURE ROADMAP',
      subtitle: `${lectures.length}개의 세부 강의`,
      list: lectures.map((lecture, index) => `${String(index + 1).padStart(2, '0')}. ${lecture.title || '제목 미정'}`)
    })
  }

  if (outcomes.length) {
    slides.push({
      title: 'LEARNING OUTCOMES',
      subtitle: '수료 시 기대 역량',
      list: outcomes
    })
  }

  if (benefits.length) {
    slides.push({
      title: 'BENEFITS',
      subtitle: '참여자 혜택',
      list: benefits
    })
  }

  if (prerequisites.length) {
    slides.push({
      title: 'PREREQUISITES',
      subtitle: '학습 전 준비 사항',
      list: prerequisites
    })
  }

  return slides
}

function parseBriefingContent(content) {
  if (!content || typeof content !== 'string') return []

  const trimmed = content.trim()
  if (!trimmed) return []

  // Try JSON structure first
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed
          .map((slide) => sanitizeSlide(slide))
          .filter((slide) => slide && (slide.title || slide.body || (slide.list && slide.list.length)))
      }
    } catch (error) {
      console.warn('Failed to parse briefingContent JSON:', error)
    }
  }

  // Fallback: use --- separators
  const sections = trimmed.split(/\n-{3,}\n/).map((section) => section.trim()).filter(Boolean)
  if (sections.length === 0) return []

  return sections
    .map((section) => parseSection(section))
    .filter((slide) => slide && (slide.title || slide.body || (slide.list && slide.list.length)))
}

function parseSection(section) {
  const lines = section.split('\n').map((line) => line.trim()).filter(Boolean)
  if (!lines.length) return null

  let slide = { title: '', subtitle: '', body: '', list: [] }

  for (const line of lines) {
    if (line.toLowerCase().startsWith('title:')) {
      slide.title = line.slice(6).trim()
    } else if (line.toLowerCase().startsWith('subtitle:')) {
      slide.subtitle = line.slice(9).trim()
    } else if (line.startsWith('- ')) {
      slide.list.push(line.slice(2).trim())
    } else {
      slide.body = slide.body ? `${slide.body}\n${line}` : line
    }
  }

  if (!slide.title) {
    slide.title = lines[0]
    slide.body = slide.body ? slide.body : lines.slice(1).join('\n')
  }

  return sanitizeSlide(slide)
}

function sanitizeSlide(slide) {
  if (!slide || typeof slide !== 'object') return null

  const title = typeof slide.title === 'string' ? slide.title.trim() : ''
  const subtitle = typeof slide.subtitle === 'string' ? slide.subtitle.trim() : ''
  const body = typeof slide.body === 'string' ? slide.body.trim() : ''
  const list = Array.isArray(slide.list)
    ? slide.list.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean)
    : []

  return { title, subtitle, body, list }
}

function normalizeArrayField(field) {
  if (!field) return []
  if (Array.isArray(field)) {
    return field.map((item) => (typeof item === 'string' ? item : String(item))).filter(Boolean)
  }
  if (typeof field === 'string') {
    return field.split('\n').map((item) => item.trim()).filter(Boolean)
  }
  return []
}
