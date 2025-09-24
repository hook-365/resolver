import '@testing-library/jest-dom'

// Mock localStorage with actual storage
class LocalStorageMock {
  constructor() {
    this.store = {}
  }

  getItem = vi.fn((key) => {
    return this.store[key] || null
  })

  setItem = vi.fn((key, value) => {
    this.store[key] = value.toString()
  })

  removeItem = vi.fn((key) => {
    delete this.store[key]
  })

  clear = vi.fn(() => {
    this.store = {}
  })

  // Helper for tests to directly set values
  __setMockStorage(newStore) {
    this.store = { ...newStore }
  }
}

const localStorageMock = new LocalStorageMock()
global.localStorage = localStorageMock

// Reset mocks and storage before each test
beforeEach(() => {
  localStorageMock.store = {}
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
})

// Mock window.confirm
global.confirm = vi.fn(() => true)

// Mock window.prompt
global.prompt = vi.fn(() => 'Test Input')