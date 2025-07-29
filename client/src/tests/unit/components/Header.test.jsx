import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import Header from "../../../components/Header"

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe("Header Component", () => {
  test("renders navigation links", () => {
    renderWithRouter(<Header />)

    expect(screen.getByTestId("home-link")).toBeInTheDocument()
    expect(screen.getByTestId("users-link")).toBeInTheDocument()
    expect(screen.getByTestId("login-link")).toBeInTheDocument()
  })

  test("displays brand name", () => {
    renderWithRouter(<Header />)

    expect(screen.getByText("MERN Testing App")).toBeInTheDocument()
  })

  test("navigation links have correct href attributes", () => {
    renderWithRouter(<Header />)

    expect(screen.getByTestId("home-link")).toHaveAttribute("href", "/")
    expect(screen.getByTestId("users-link")).toHaveAttribute("href", "/users")
    expect(screen.getByTestId("login-link")).toHaveAttribute("href", "/login")
  })
})
