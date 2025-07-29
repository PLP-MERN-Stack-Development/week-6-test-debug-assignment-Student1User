import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import UserForm from "../../components/UserForm"

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

const renderWithProviders = (component) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>,
  )
}

describe("UserForm Integration Tests", () => {
  test("submits form with valid data", async () => {
    const user = userEvent.setup()
    renderWithProviders(<UserForm />)

    const nameInput = screen.getByTestId("name-input")
    const emailInput = screen.getByTestId("email-input")
    const submitButton = screen.getByTestId("submit-button")

    await user.type(nameInput, "John Doe")
    await user.type(emailInput, "john@example.com")
    await user.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toHaveTextContent("Saving...")
    })
  })

  test("displays validation errors for invalid data", async () => {
    const user = userEvent.setup()
    renderWithProviders(<UserForm />)

    const submitButton = screen.getByTestId("submit-button")
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId("name-error")).toBeInTheDocument()
      expect(screen.getByTestId("email-error")).toBeInTheDocument()
    })
  })

  test("validates email format", async () => {
    const user = userEvent.setup()
    renderWithProviders(<UserForm />)

    const emailInput = screen.getByTestId("email-input")
    const submitButton = screen.getByTestId("submit-button")

    await user.type(emailInput, "invalid-email")
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByTestId("email-error")).toHaveTextContent("Invalid email address")
    })
  })
})
