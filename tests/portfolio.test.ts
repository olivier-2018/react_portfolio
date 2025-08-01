import request from "supertest"
import express from "express"
import portfolioRoutes from "../src/routes/portfolio.routes"
import { supabase } from "../src/config/supabase"

const app = express()
app.use(express.json())
app.use("/api/v1", portfolioRoutes)

describe("Supabase connection", () => {
   it("should connect and fetch from the skills table", async () => {
      const { data, error } = await supabase.from("skills").select("*").limit(1)
      expect(error).toBeNull()
      expect(Array.isArray(data)).toBeTruthy()
   })
})

describe("Portfolio backend API Routes", () => {
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

   describe("GET /api/v1/projects-categories", () => {
      it("should return projects categories array", async () => {
         const res = await request(app).get("/api/v1/project-categories")
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
