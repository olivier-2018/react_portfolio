import express from "express"
import {
   getSkills,
   getSkillCategories,
   getProjects,
   getProjectCategories,
   getFeedbacks,
   getProjectLikes,
   incrementProjectLikes,
} from "../controllers/portfolio.controller"

const router = express.Router()

// Skills routes
router.get("/skills", getSkills)
router.get("/skill-categories", getSkillCategories)

// Projects routes
router.get("/projects", getProjects)
router.get("/project-categories", getProjectCategories)

// Feedbacks routes
router.get("/feedbacks", getFeedbacks)

// Project Likes routes
router.get("/projects/:name/likes", getProjectLikes)
router.post("/projects/:name/likes", incrementProjectLikes)

export default router
