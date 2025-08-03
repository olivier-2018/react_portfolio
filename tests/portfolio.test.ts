import request from "supertest"
import { app } from "../src/app"
import { supabase } from "../src/config/supabase"

const API_PREFIX = process.env.API_PREFIX || "/api/v1"

describe("Supabase connections", () => {
   it("Should connect and fetch from skills table using SDK", async () => {
      const { data, error } = await supabase.from("skills").select("*").limit(1)
      expect(error).toBeNull()
      expect(Array.isArray(data)).toBeTruthy()
   })
})

describe("Portfolio backend API routes", () => {
   describe(`GET ${API_PREFIX}/skills`, () => {
      it("skills route - should return skills array", async () => {
         const res = await request(app).get(`${API_PREFIX}/skills`)
         expect(res.status).toBe(200)
         expect(Array.isArray(res.body)).toBeTruthy()
      })
   })

   describe(`GET ${API_PREFIX}/skill-categories`, () => {
      it("skills categories route - should return skill categories array", async () => {
         const res = await request(app).get(`${API_PREFIX}/skill-categories`)
         expect(res.status).toBe(200)
         expect(Array.isArray(res.body)).toBeTruthy()
      })
   })

   describe(`GET ${API_PREFIX}/projects`, () => {
      it("projects route - should return projects array", async () => {
         const res = await request(app).get(`${API_PREFIX}/projects`)
         expect(res.status).toBe(200)
         expect(Array.isArray(res.body)).toBeTruthy()
      })
   })

   describe(`GET ${API_PREFIX}/project-categories`, () => {
      it("project categories route - should return projects categories array", async () => {
         const res = await request(app).get(`${API_PREFIX}/project-categories`)
         expect(res.status).toBe(200)
         expect(Array.isArray(res.body)).toBeTruthy()
      })
   })

   describe(`GET ${API_PREFIX}/feedbacks`, () => {
      it("feedbacks route - should return feedbacks array", async () => {
         const res = await request(app).get(`${API_PREFIX}/feedbacks`)
         expect(res.status).toBe(200)
         expect(Array.isArray(res.body)).toBeTruthy()
      })
   })
})

describe("Portfolio backend API routes (Likes)", () => {
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

   it(`GET ${API_PREFIX}/projects/likes (TEST project with 0 Likes)`, async () => {
      const res = await request(app).get(
         `${API_PREFIX}/projects/likes?projectName=${encodeURIComponent(testProjectName)}`
      )
      expect(res.status).toBe(200)
      expect(res.body.likes_count).toBe(0)
   })

   it(`POST ${API_PREFIX}/projects/likes (increment Likes count to 1)`, async () => {
      const res = await request(app).post(
         `${API_PREFIX}/projects/likes?projectName=${encodeURIComponent(testProjectName)}`
      )
      expect(res.status).toBe(200)
      expect(res.body.likes_count).toBe(1)

      // Confirm incremented value
      const res2 = await request(app).get(
         `${API_PREFIX}/projects/likes?projectName=${encodeURIComponent(testProjectName)}`
      )
      expect(res2.body.likes_count).toBe(1)
   })
})
