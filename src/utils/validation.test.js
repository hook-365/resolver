import { describe, it, expect } from 'vitest'
import {
  validateSelfName,
  validateAuthorityName,
  validateObservation,
  validateUserName,
  canAddMoreSelves,
  sanitizeInput
} from './validation'

describe('validateSelfName', () => {
  it('should accept valid self names', () => {
    const result = validateSelfName('Work Me')
    expect(result.isValid).toBe(true)
    expect(result.value).toBe('Work Me')
  })

  it('should reject empty names', () => {
    const result = validateSelfName('')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Name cannot be empty')
  })

  it('should reject names that are too long', () => {
    const longName = 'a'.repeat(51)
    const result = validateSelfName(longName)
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Name must be 50 characters or less')
  })

  it('should trim whitespace', () => {
    const result = validateSelfName('  Work Me  ')
    expect(result.isValid).toBe(true)
    expect(result.value).toBe('Work Me')
  })

  it('should reject invalid characters', () => {
    const result = validateSelfName('Work<script>Me')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Name contains invalid characters')
  })
})

describe('validateAuthorityName', () => {
  it('should accept valid authority names', () => {
    const result = validateAuthorityName('My Manager')
    expect(result.isValid).toBe(true)
    expect(result.value).toBe('My Manager')
  })

  it('should reject empty authority names', () => {
    const result = validateAuthorityName('   ')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Authority name cannot be empty')
  })

  it('should accept special characters in quotes', () => {
    const result = validateAuthorityName('My "Inner" Self')
    expect(result.isValid).toBe(true)
    expect(result.value).toBe('My "Inner" Self')
  })
})

describe('validateObservation', () => {
  it('should accept valid observations', () => {
    const result = validateObservation('I need to deliver on deadlines')
    expect(result.isValid).toBe(true)
    expect(result.value).toBe('I need to deliver on deadlines')
  })

  it('should reject empty observations', () => {
    const result = validateObservation('')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Observation cannot be empty')
  })

  it('should reject observations that are too long', () => {
    const longObservation = 'a'.repeat(501)
    const result = validateObservation(longObservation)
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Observation must be 500 characters or less')
  })
})

describe('validateUserName', () => {
  it('should accept valid user names', () => {
    const result = validateUserName('John Doe')
    expect(result.isValid).toBe(true)
    expect(result.value).toBe('John Doe')
  })

  it('should reject null/undefined names', () => {
    const result = validateUserName(null)
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('User name is required')
  })

  it('should reject names that are too long', () => {
    const longName = 'a'.repeat(101)
    const result = validateUserName(longName)
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('User name must be 100 characters or less')
  })
})

describe('canAddMoreSelves', () => {
  it('should allow adding when under limit', () => {
    expect(canAddMoreSelves([])).toBe(true)
    expect(canAddMoreSelves([{ id: 1 }])).toBe(true)
    expect(canAddMoreSelves([{ id: 1 }, { id: 2 }])).toBe(true)
  })

  it('should not allow adding when at limit', () => {
    expect(canAddMoreSelves([{ id: 1 }, { id: 2 }, { id: 3 }])).toBe(false)
  })
})

describe('sanitizeInput', () => {
  it('should remove script tags', () => {
    const result = sanitizeInput('Hello<script>alert("xss")</script>World')
    expect(result).toBe('HelloWorld')
  })

  it('should remove iframe tags', () => {
    const result = sanitizeInput('Hello<iframe src="evil.com"></iframe>World')
    expect(result).toBe('HelloWorld')
  })

  it('should remove javascript: protocol', () => {
    const result = sanitizeInput('javascript:alert("xss")')
    expect(result).toBe('alert("xss")')
  })

  it('should remove event handlers', () => {
    const result = sanitizeInput('Hello onclick="alert()"')
    expect(result).toBe('Hello')
  })

  it('should preserve normal text', () => {
    const result = sanitizeInput('Hello World! This is a test.')
    expect(result).toBe('Hello World! This is a test.')
  })

  it('should handle non-string input', () => {
    expect(sanitizeInput(null)).toBe('')
    expect(sanitizeInput(undefined)).toBe('')
    expect(sanitizeInput(123)).toBe('')
  })
})