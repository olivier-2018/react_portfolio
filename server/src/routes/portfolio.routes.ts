import express from "express"
import { getSkills, getSkillCategories, getProjects, getFeedbacks } from "../controllers/portfolio.controller"

const router = express.Router()

// Skills routes
router.get("/skills", getSkills)
router.get("/skill-categories", getSkillCategories)

// Projects routes
router.get("/projects", getProjects)

// Feedbacks routes
router.get("/feedbacks", getFeedbacks)

export default router
