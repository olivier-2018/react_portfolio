import { Request, Response } from "express"
import fs from "fs"
import path from "path"
import logger from "../utils/logger"

const projectPicturesDir = path.join(__dirname, "../../projects_assets/project_pictures")
const projectVideosDir = path.join(__dirname, "../../projects_assets/project_movies")

// Fetch project picture by filename
export const getProjectPicture = (req: Request, res: Response) => {
   const { filename } = req.params
   const filePath = path.join(projectPicturesDir, filename)
   logger.info(`Fetching project picture: ${filename}`)
   res.sendFile(filePath, (err) => {
      if (err) res.status(404).json({ error: "Image not found" })
   })
}
// Fetch project video by filename
export const getProjectVideo = (req: Request, res: Response) => {
   const { filename } = req.params
   const filePath = path.join(projectVideosDir, filename)
   logger.info(`Fetching project video: ${filename}`)
   res.sendFile(filePath, (err) => {
      if (err) res.status(404).json({ error: "Video not found" })
   })
}
