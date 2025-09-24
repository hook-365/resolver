export const validateSelfName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Name is required' }
  }

  const trimmed = name.trim()

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Name cannot be empty' }
  }

  if (trimmed.length > 50) {
    return { isValid: false, error: 'Name must be 50 characters or less' }
  }

  if (!/^[a-zA-Z0-9\s\-_.,!?'"()]+$/.test(trimmed)) {
    return { isValid: false, error: 'Name contains invalid characters' }
  }

  return { isValid: true, value: trimmed }
}

export const validateAuthorityName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Authority name is required' }
  }

  const trimmed = name.trim()

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Authority name cannot be empty' }
  }

  if (trimmed.length > 50) {
    return { isValid: false, error: 'Authority name must be 50 characters or less' }
  }

  if (!/^[a-zA-Z0-9\s\-_.,!?'"()]+$/.test(trimmed)) {
    return { isValid: false, error: 'Authority name contains invalid characters' }
  }

  return { isValid: true, value: trimmed }
}

export const validateObservation = (text) => {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Observation text is required' }
  }

  const trimmed = text.trim()

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Observation cannot be empty' }
  }

  if (trimmed.length > 500) {
    return { isValid: false, error: 'Observation must be 500 characters or less' }
  }

  return { isValid: true, value: trimmed }
}

export const validateUserName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'User name is required' }
  }

  const trimmed = name.trim()

  if (trimmed.length === 0) {
    return { isValid: false, error: 'User name cannot be empty' }
  }

  if (trimmed.length > 100) {
    return { isValid: false, error: 'User name must be 100 characters or less' }
  }

  return { isValid: true, value: trimmed }
}

export const canAddMoreSelves = (currentSelves) => {
  const MAX_SELVES = 3
  return currentSelves.length < MAX_SELVES
}

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return ''

  // Remove any potential script tags or dangerous HTML
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}