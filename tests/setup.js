import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  if (global.localStorage) {
    localStorage.clear()
  }
})

// Mock localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
