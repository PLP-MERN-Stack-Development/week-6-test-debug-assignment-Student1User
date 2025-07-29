import { describe, beforeEach, it } from "mocha"
import { cy } from "cypress"

describe("Authentication E2E Tests", () => {
  beforeEach(() => {
    cy.intercept("POST", "/api/auth/login", { fixture: "auth.json" }).as("login")
    cy.intercept("POST", "/api/auth/register", { fixture: "auth.json" }).as("register")
  })

  it("should login with valid credentials", () => {
    cy.visit("/login")

    cy.get('[data-testid="email-input"]').type("test@example.com")
    cy.get('[data-testid="password-input"]').type("password123")
    cy.get('[data-testid="login-button"]').click()

    cy.wait("@login")

    // Should store token in localStorage
    cy.window().its("localStorage").invoke("getItem", "token").should("exist")
  })

  it("should show validation errors for invalid login data", () => {
    cy.visit("/login")

    // Submit empty form
    cy.get('[data-testid="login-button"]').click()

    cy.get('[data-testid="email-error"]').should("be.visible")
    cy.get('[data-testid="password-error"]').should("be.visible")
  })

  it("should handle login errors", () => {
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 401,
      body: { message: "Invalid credentials" },
    }).as("loginError")

    cy.visit("/login")

    cy.get('[data-testid="email-input"]').type("wrong@example.com")
    cy.get('[data-testid="password-input"]').type("wrongpassword")
    cy.get('[data-testid="login-button"]').click()

    cy.wait("@loginError")
    cy.get('[data-testid="login-error"]').should("contain", "Invalid credentials")
  })

  it("should show loading state during login", () => {
    cy.intercept("POST", "/api/auth/login", { delay: 1000, fixture: "auth.json" }).as("slowLogin")

    cy.visit("/login")

    cy.get('[data-testid="email-input"]').type("test@example.com")
    cy.get('[data-testid="password-input"]').type("password123")
    cy.get('[data-testid="login-button"]').click()

    cy.get('[data-testid="login-button"]').should("contain", "Logging in...")
    cy.get('[data-testid="login-button"]').should("be.disabled")
  })
})
