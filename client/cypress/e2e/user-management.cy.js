import { describe, beforeEach, it } from "mocha"
import { cy } from "cypress"
import Cypress from "cypress"

describe("User Management E2E Tests", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/users", { fixture: "users.json" }).as("getUsers")
    cy.intercept("GET", "/api/users/*", { fixture: "user.json" }).as("getUser")
    cy.intercept("POST", "/api/users", { fixture: "user.json" }).as("createUser")
    cy.intercept("PUT", "/api/users/*", { fixture: "user.json" }).as("updateUser")
    cy.intercept("DELETE", "/api/users/*", { message: "User deleted successfully" }).as("deleteUser")
  })

  it("should display users list", () => {
    cy.visit("/users")

    cy.wait("@getUsers")
    cy.get('[data-testid="user-list"]').should("be.visible")
    cy.get('[data-testid="user-card-1"]').should("contain", "John Doe")
    cy.get('[data-testid="user-card-2"]').should("contain", "Jane Smith")
  })

  it("should create a new user", () => {
    cy.visit("/users")
    cy.get('[data-testid="add-user-button"]').click()

    cy.url().should("include", "/users/new")
    cy.get('[data-testid="user-form"]').should("be.visible")

    cy.get('[data-testid="name-input"]').type("New User")
    cy.get('[data-testid="email-input"]').type("newuser@example.com")
    cy.get('[data-testid="submit-button"]').click()

    cy.wait("@createUser")
    cy.url().should("eq", Cypress.config().baseUrl + "/users")
  })

  it("should edit an existing user", () => {
    cy.visit("/users")
    cy.wait("@getUsers")

    cy.get('[data-testid="edit-user-1"]').click()
    cy.wait("@getUser")

    cy.url().should("include", "/users/edit/1")
    cy.get('[data-testid="name-input"]').should("have.value", "John Doe")

    cy.get('[data-testid="name-input"]').clear().type("John Updated")
    cy.get('[data-testid="submit-button"]').click()

    cy.wait("@updateUser")
    cy.url().should("eq", Cypress.config().baseUrl + "/users")
  })

  it("should delete a user", () => {
    cy.visit("/users")
    cy.wait("@getUsers")

    cy.get('[data-testid="delete-user-1"]').click()

    // Handle confirmation dialog
    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(true)
    })

    cy.wait("@deleteUser")
  })

  it("should show empty state when no users", () => {
    cy.intercept("GET", "/api/users", { users: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } }).as(
      "getEmptyUsers",
    )

    cy.visit("/users")
    cy.wait("@getEmptyUsers")

    cy.get('[data-testid="empty-state"]').should("be.visible")
    cy.get('[data-testid="empty-state"]').should("contain", "No users found")
  })

  it("should handle API errors gracefully", () => {
    cy.intercept("GET", "/api/users", { statusCode: 500, body: { message: "Server error" } }).as("getUsersError")

    cy.visit("/users")
    cy.wait("@getUsersError")

    cy.get('[data-testid="error-message"]').should("be.visible")
    cy.get('[data-testid="error-message"]').should("contain", "Error loading users")
    cy.get('[data-testid="retry-button"]').should("be.visible")
  })

  it("should validate form inputs", () => {
    cy.visit("/users/new")

    // Submit empty form
    cy.get('[data-testid="submit-button"]').click()

    cy.get('[data-testid="name-error"]').should("be.visible")
    cy.get('[data-testid="email-error"]').should("be.visible")

    // Test invalid email
    cy.get('[data-testid="email-input"]').type("invalid-email")
    cy.get('[data-testid="submit-button"]').click()

    cy.get('[data-testid="email-error"]').should("contain", "Invalid email address")
  })
})
