import { afterEach } from 'vitest'

// Cleanup after each test
afterEach(() => {
  if (global.localStorage) {
    localStorage.clear()
  }
})

// Mock localStorage with functional implementation
class LocalStorageMock {
  constructor() {
    this.store = {}
  }

  getItem(key) {
    return this.store[key] || null
  }

  setItem(key, value) {
    this.store[key] = String(value)
  }

  removeItem(key) {
    delete this.store[key]
  }

  clear() {
    this.store = {}
  }
}

global.localStorage = new LocalStorageMock()
