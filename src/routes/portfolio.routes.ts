import express from "express"
import {
   getSkillCategories,
   getSkills,
   getProjectCategories,
   getProjects,
   getFeedbacks,
   submitFeedback,
   getProjectLikes,
   incrementProjectLikes,
} from "../controllers/portfolio.controller"

const router = express.Router()

// Skills routes
router.get("/skill-categories", getSkillCategories)
router.get("/skills", getSkills)

// Projects routes
router.get("/project-categories", getProjectCategories)
router.get("/projects", getProjects)

// Feedbacks routes
router.get("/feedbacks", getFeedbacks)
router.post("/feedbacks", submitFeedback) // Assuming you have a submitFeedbacks function

// Project Likes routes
router.get("/projects/likes", getProjectLikes)
router.post("/projects/likes", incrementProjectLikes)

// Copilot Studio Direct Line token endpoint (proxied through backend to bypass CORS)
router.post("/chatbot/directline-token", async (req: express.Request, res: express.Response) => {
   try {
      const directLineSecret = process.env.VITE_COPILOT_DIRECTLINE_SECRET

      if (!directLineSecret) {
         return res.status(500).json({
            error: "Direct Line secret not configured",
         })
      }

      const tokenResponse = await fetch("https://directline.botframework.com/v3/directline/tokens/generate", {
         method: "POST",
         headers: {
            Authorization: `Bearer ${directLineSecret}`,
            "Content-Type": "application/json",
         },
      })

      if (!tokenResponse.ok) {
         return res.status(tokenResponse.status).json({
            error: `Failed to get Direct Line token: ${tokenResponse.statusText}`,
         })
      }

      const token = await tokenResponse.json()
      res.json(token)
   } catch (error) {
      console.error("Error fetching Direct Line token:", error)
      res.status(500).json({
         error: "Failed to fetch Direct Line token",
      })
   }
})

export default router
