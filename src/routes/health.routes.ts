import express from "express"
import { getHealthStatus } from "../controllers/health.controller"

const router = express.Router()

/**
 * @route   GET /api/v1/health
 * @desc    Get API health status
 * @access  Public
 */
router.get("/health", getHealthStatus)

export default router
