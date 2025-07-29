import { render, screen } from "@testing-library/react"
import LoadingSpinner from "../../../components/LoadingSpinner"

describe("LoadingSpinner Component", () => {
  test("renders with default message", () => {
    render(<LoadingSpinner />)

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument()
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  test("renders with custom message", () => {
    const customMessage = "Please wait..."
    render(<LoadingSpinner message={customMessage} />)

    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })

  test("applies correct size class", () => {
    render(<LoadingSpinner size="large" />)

    const spinner = screen.getByTestId("loading-spinner")
    expect(spinner).toHaveClass("loading-spinner", "large")
  })
})
