import { validateEmail, validatePassword, validateName, debounce } from "../../../utils/validation"

describe("Validation Utils", () => {
  describe("validateEmail", () => {
    test("returns true for valid email", () => {
      expect(validateEmail("test@example.com")).toBe(true)
      expect(validateEmail("user.name@domain.co.uk")).toBe(true)
    })

    test("returns false for invalid email", () => {
      expect(validateEmail("invalid-email")).toBe(false)
      expect(validateEmail("test@")).toBe(false)
      expect(validateEmail("@example.com")).toBe(false)
    })
  })

  describe("validatePassword", () => {
    test("returns true for valid password", () => {
      expect(validatePassword("password123")).toBe(true)
      expect(validatePassword("123456")).toBe(true)
    })

    test("returns false for invalid password", () => {
      expect(validatePassword("12345")).toBe(false)
      expect(validatePassword("")).toBe(false)
      expect(validatePassword(null)).toBe(false)
    })
  })

  describe("validateName", () => {
    test("returns true for valid name", () => {
      expect(validateName("John Doe")).toBe(true)
      expect(validateName("Jane")).toBe(true)
    })

    test("returns false for invalid name", () => {
      expect(validateName("J")).toBe(false)
      expect(validateName("")).toBe(false)
      expect(validateName("   ")).toBe(false)
    })
  })

  describe("debounce", () => {
    jest.useFakeTimers()

    test("delays function execution", () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    test("cancels previous calls", () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })
})
</merged_code>
