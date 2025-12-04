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

export default router
