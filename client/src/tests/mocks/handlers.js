import { rest } from "msw"

const API_BASE_URL = "http://localhost:5000/api"

export const handlers = [
  // Users endpoints
  rest.get(`${API_BASE_URL}/users`, (req, res, ctx) => {
    return res(
      ctx.json([
        { _id: "1", name: "John Doe", email: "john@example.com" },
        { _id: "2", name: "Jane Smith", email: "jane@example.com" },
      ]),
    )
  }),

  rest.get(`${API_BASE_URL}/users/:id`, (req, res, ctx) => {
    const { id } = req.params
    return res(ctx.json({ _id: id, name: "John Doe", email: "john@example.com" }))
  }),

  rest.post(`${API_BASE_URL}/users`, (req, res, ctx) => {
    return res(ctx.json({ _id: "3", name: "New User", email: "new@example.com" }))
  }),

  rest.put(`${API_BASE_URL}/users/:id`, (req, res, ctx) => {
    const { id } = req.params
    return res(ctx.json({ _id: id, name: "Updated User", email: "updated@example.com" }))
  }),

  rest.delete(`${API_BASE_URL}/users/:id`, (req, res, ctx) => {
    return res(ctx.json({ message: "User deleted successfully" }))
  }),

  // Auth endpoints
  rest.post(`${API_BASE_URL}/auth/login`, (req, res, ctx) => {
    return res(ctx.json({ token: "mock-jwt-token", user: { id: "1", email: "test@example.com" } }))
  }),

  rest.post(`${API_BASE_URL}/auth/register`, (req, res, ctx) => {
    return res(ctx.json({ token: "mock-jwt-token", user: { id: "2", email: "new@example.com" } }))
  }),
]
