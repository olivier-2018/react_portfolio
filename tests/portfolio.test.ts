import request from "supertest"
import { app } from "../src/app"
import { supabase } from "../src/config/supabase"

describe("Supabase connection", () => {
   it("should connect and fetch from skills table using SDK", async () => {
      const { data, error } = await supabase.from("skills").select("*").limit(1)
      expect(error).toBeNull()
      expect(Array.isArray(data)).toBeTruthy()
   })
})

describe("Portfolio backend API main Routes", () => {
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

describe("Portfolio backend API extra Routes", () => {
   let testProjectName: string = "TEST PROJECT"
   let testProjectCat: string = "Data Science"

   beforeAll(async () => {
      // Insert a test project (no route for this)
      const { data, error } = await supabase.from("projects").insert({
         name: testProjectName,
         category: testProjectCat,
         project_description: "This is a test",
         likes_count: 0,
      })
      if (error) throw error
   })

   afterAll(async () => {
      // Remove the test project (no route for this)
      await supabase.from("projects").delete().eq("name", testProjectName)
   })

   it("GET /api/v1/projects/:ID/likes (initial likes count of 0)", async () => {
      const res = await request(app).get(`/api/v1/projects/${testProjectName}/likes`)
      expect(res.status).toBe(200)
      expect(res.body.likes_count).toBe(0)
   })

   it("POST /api/v1/projects/:ID/likes (increment likes count to 1)", async () => {
      const res = await request(app).post(`/api/v1/projects/${testProjectName}/likes`)
      expect(res.status).toBe(200)
      expect(res.body.likes_count).toBe(1)

      // Confirm incremented value
      const res2 = await request(app).get(`/api/v1/projects/${testProjectName}/likes`)
      expect(res2.body.likes_count).toBe(1)
   })
})
