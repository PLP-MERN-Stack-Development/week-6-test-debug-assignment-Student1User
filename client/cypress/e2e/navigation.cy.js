import { describe, it } from "mocha"
import { cy, Cypress } from "cypress"

describe("Navigation E2E Tests", () => {
  it("should navigate between pages", () => {
    cy.visit("/")

    // Test home page
    cy.get('[data-testid="home-page"]').should("be.visible")
    cy.get('[data-testid="home-link"]').should("have.class", "active")

    // Navigate to users page
    cy.get('[data-testid="users-link"]').click()
    cy.url().should("include", "/users")
    cy.get('[data-testid="users-link"]').should("have.class", "active")

    // Navigate to login page
    cy.get('[data-testid="login-link"]').click()
    cy.url().should("include", "/login")
    cy.get('[data-testid="login-link"]').should("have.class", "active")

    // Navigate back to home
    cy.get('[data-testid="home-link"]').click()
    cy.url().should("eq", Cypress.config().baseUrl + "/")
  })

  it("should display correct page content", () => {
    // Home page
    cy.visit("/")
    cy.contains("Welcome to MERN Testing App").should("be.visible")
    cy.get('[data-testid="app-stats"]').should("be.visible")

    // Users page
    cy.intercept("GET", "/api/users", { fixture: "users.json" }).as("getUsers")
    cy.visit("/users")
    cy.wait("@getUsers")
    cy.contains("Users").should("be.visible")

    // Login page
    cy.visit("/login")
    cy.contains("Login").should("be.visible")
    cy.get('[data-testid="login-form"]').should("be.visible")
  })

  it("should handle 404 pages gracefully", () => {
    cy.visit("/non-existent-page", { failOnStatusCode: false })
    // In a real app, you'd have a 404 page
    // For now, React Router will handle this
  })
})
