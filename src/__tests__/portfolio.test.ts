import request from "supertest"
import express from "express"
import portfolioRoutes from "../routes/portfolio.routes"

const app = express()
app.use(express.json())
app.use("/api/v1", portfolioRoutes)

describe("Portfolio API Routes", () => {
   describe("GET /api/v1/skills", () => {
      it("should return skills array", async () => {
         const res = await request(app).get("/api/v1/skills")
         expect(res.status).toBe(200)
         expect(Array.isArray(res.body)).toBeTruthy()
      })
   })

   describe("GET /api/v1/skill-categories", () => {
      it("should return skill categories array", async () => {
         const res = await request(app).get("/api/v1/skill-categories")
         expect(res.status).toBe(200)
         expect(Array.isArray(res.body)).toBeTruthy()
      })
   })

   describe("GET /api/v1/projects", () => {
      it("should return projects array", async () => {
         const res = await request(app).get("/api/v1/projects")
         expect(res.status).toBe(200)
         expect(Array.isArray(res.body)).toBeTruthy()
      })
   })

   describe("GET /api/v1/feedbacks", () => {
      it("should return feedbacks array", async () => {
         const res = await request(app).get("/api/v1/feedbacks")
         expect(res.status).toBe(200)
         expect(Array.isArray(res.body)).toBeTruthy()
      })
   })
})
