import { describe, it, expect, beforeEach, vi } from 'vitest'
import { saveToStorage, getFromStorage } from '~/utils/storage'

describe('Storage Utils', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear()

        // Reset process.client
        vi.stubGlobal('process', { client: true })
    })

    describe('saveToStorage', () => {
        it('saves data to localStorage when in client mode', () => {
            const key = 'testKey'
            const value = { test: 'data' }

            saveToStorage(key, value)

            expect(localStorage.getItem(key)).toBe(JSON.stringify(value))
        })

        it('does not save data when not in client mode', () => {
            vi.stubGlobal('process', { client: false })

            const key = 'testKey'
            const value = { test: 'data' }

            saveToStorage(key, value)

            expect(localStorage.getItem(key)).toBeNull()
        })
    })

    describe('getFromStorage', () => {
        it('retrieves data from localStorage when in client mode', () => {
            const key = 'testKey'
            const value = { test: 'data' }
            localStorage.setItem(key, JSON.stringify(value))

            const result = getFromStorage(key, null)

            expect(result).toEqual(value)
        })

        it('returns default value when key not found', () => {
            const key = 'nonexistentKey'
            const defaultValue = { default: 'value' }

            const result = getFromStorage(key, defaultValue)

            expect(result).toEqual(defaultValue)
        })

        it('returns default value when not in client mode', () => {
            vi.stubGlobal('process', { client: false })

            const key = 'testKey'
            const defaultValue = { default: 'value' }

            const result = getFromStorage(key, defaultValue)

            expect(result).toEqual(defaultValue)
        })
    })
})