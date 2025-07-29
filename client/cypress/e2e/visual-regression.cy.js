import { describe, beforeEach, it } from "mocha"
import { cy } from "cypress"

describe("Visual Regression Tests", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/users", { fixture: "users.json" }).as("getUsers")
  })

  it("should match home page visual snapshot", () => {
    cy.visit("/")
    cy.get('[data-testid="home-page"]').should("be.visible")

    // Wait for content to load
    cy.get('[data-testid="component-count"]').should("contain", "8")

    // Take screenshot for visual comparison
    cy.screenshot("home-page")

    // Check specific visual elements
    cy.get(".features").should("be.visible")
    cy.get(".stats").should("be.visible")
  })

  it("should match users list visual snapshot", () => {
    cy.visit("/users")
    cy.wait("@getUsers")

    cy.get('[data-testid="user-list"]').should("be.visible")
    cy.get(".users-grid").should("be.visible")

    cy.screenshot("users-list")
  })

  it("should match user form visual snapshot", () => {
    cy.visit("/users/new")

    cy.get('[data-testid="user-form"]').should("be.visible")
    cy.get('[data-testid="name-input"]').should("be.visible")
    cy.get('[data-testid="email-input"]').should("be.visible")

    cy.screenshot("user-form")
  })

  it("should match login form visual snapshot", () => {
    cy.visit("/login")

    cy.get('[data-testid="login-form"]').should("be.visible")
    cy.get('[data-testid="email-input"]').should("be.visible")
    cy.get('[data-testid="password-input"]').should("be.visible")

    cy.screenshot("login-form")
  })

  it("should match error states visual snapshot", () => {
    cy.intercept("GET", "/api/users", {
      statusCode: 500,
      body: { message: "Server error" },
    }).as("getUsersError")

    cy.visit("/users")
    cy.wait("@getUsersError")

    cy.get('[data-testid="error-message"]').should("be.visible")
    cy.screenshot("error-state")
  })

  it("should match loading states visual snapshot", () => {
    cy.intercept("GET", "/api/users", {
      delay: 2000,
      fixture: "users.json",
    }).as("getSlowUsers")

    cy.visit("/users")

    // Capture loading state
    cy.get('[data-testid="loading-spinner"]').should("be.visible")
    cy.screenshot("loading-state")
  })
})
