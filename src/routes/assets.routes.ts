import { Router } from "express"
import { getProjectPicture, getProjectVideo } from "../controllers/assets.controller"

const router = Router()

router.get("/project-pictures/:filename", getProjectPicture)
router.get("/project-videos/:filename", getProjectVideo)

export default router
