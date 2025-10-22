export function parseCurriculumContent(content) {
  if (!content || typeof content !== 'string') return []

  const trimmed = content.trim()
  if (!trimmed) return []

  // Try parsing JSON array of sections
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed
          .map((section) => sanitizeSection(section))
          .filter((section) => section && (section.title || section.body || (section.steps && section.steps.length)))
      }
    } catch (error) {
      console.warn('Failed to parse curriculumContent JSON:', error)
    }
  }

  // Fallback: sections separated by lines with three or more hyphens
  const sections = trimmed.split(/\n-{3,}\n/).map((section) => section.trim()).filter(Boolean)
  if (sections.length === 0) return []

  return sections
    .map((section) => parsePlainSection(section))
    .filter((section) => section && (section.title || section.body || (section.steps && section.steps.length)))
}

function parsePlainSection(block) {
  const lines = block.split('\n')
  if (!lines.length) return null

  const section = {
    title: '',
    summary: '',
    body: '',
    steps: []
  }

  let bodyLines = []
  let foundMetadata = false

  lines.forEach((line) => {
    const trimmedLine = line.trim()
    if (trimmedLine.toLowerCase().startsWith('title:')) {
      section.title = trimmedLine.slice(6).trim()
      foundMetadata = true
    } else if (trimmedLine.toLowerCase().startsWith('summary:')) {
      section.summary = trimmedLine.slice(8).trim()
      foundMetadata = true
    } else if (trimmedLine.toLowerCase().startsWith('- ')) {
      section.steps.push(trimmedLine.slice(2).trim())
      foundMetadata = true
    } else {
      // Keep original line (including empty lines) for body
      bodyLines.push(line)
    }
  })

  section.body = bodyLines.join('\n').trim()

  if (!section.title && bodyLines.length > 0) {
    const firstNonEmpty = bodyLines.find(l => l.trim())
    section.title = firstNonEmpty ? firstNonEmpty.trim() : 'Untitled'
  }

  return sanitizeSection(section)
}

function sanitizeSection(section) {
  if (!section || typeof section !== 'object') return null

  const title = typeof section.title === 'string' ? section.title.trim() : ''
  const summary = typeof section.summary === 'string' ? section.summary.trim() : ''
  const body = typeof section.body === 'string' ? section.body.trim() : ''
  const steps = Array.isArray(section.steps)
    ? section.steps.map((step) => (typeof step === 'string' ? step.trim() : '')).filter(Boolean)
    : []

  const hints = Array.isArray(section.hints)
    ? section.hints.map((hint) => (typeof hint === 'string' ? hint.trim() : '')).filter(Boolean)
    : []

  const environment = typeof section.environment === 'string' ? section.environment.trim() : ''

  return { title, summary, body, steps, hints, environment }
}
