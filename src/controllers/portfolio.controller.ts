import logger from "../utils/logger"
import { Request, Response } from "express"
import { supabase } from "../config/supabase"
import { verifyRecaptchaToken } from "../utils/recaptcha"

// Fetch all skill categories
export const getSkillCategories = async (_req: Request, res: Response) => {
   try {
      const { data, error } = await supabase.from("skill_categories").select("*").order("name")
      logger.info(`Fetching skills categories`)

      if (error) throw error
      res.json(data)
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      res.status(500).json({ error: message })
   }
}
// Fetch skills by category
export const getSkills = async (req: Request, res: Response) => {
   try {
      const category = req.query.category as string | undefined

      let query = supabase.from("skills").select("*").order("name")
      if (category && category !== "All") {
         query = query.eq("category", category)
         logger.info(`Fetching skills by category: ${category}`)
      } else {
         logger.info(`Fetching all categories`)
      }
      const { data, error } = await query

      if (error) throw error
      res.json(data)
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      res.status(500).json({ error: message })
   }
}
// Fetch all project categories
export const getProjectCategories = async (_req: Request, res: Response) => {
   try {
      const { data, error } = await supabase.from("project_categories").select("*").order("name")
      logger.info(`Fetching projects categories`)

      if (error) throw error
      res.json(data)
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      res.status(500).json({ error: message })
   }
}
// Fetch projects (optional: by category)
export const getProjects = async (req: Request, res: Response) => {
   try {
      const category = req.query.category as string | undefined

      let query = supabase.from("projects").select("*").order("name")
      if (category && category !== "All") {
         query = query.eq("category", category)
         logger.info(`Fetching projects by category: ${category}`)
      } else {
         logger.info(`Fetching all projects`)
      }
      const { data, error } = await query

      if (error) throw error
      res.json(data)
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      res.status(500).json({ error: message })
   }
}
// Fetch likes count for a project
export const getProjectLikes = async (req: Request, res: Response) => {
   try {
      const projectName = req.query.projectName as string | undefined
      logger.info(`Fetching project Likes for project ${projectName}`)

      const { data, error } = await supabase
         .from("projects")
         .select("*")
         .eq("name", projectName)
         .select("likes_count")
         .single()

      if (error) throw error
      res.json({ likes_count: data?.likes_count ?? 0 })
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      res.status(500).json({ error: message })
   }
}
// Increment likes for a project
export const incrementProjectLikes = async (req: Request, res: Response) => {
   try {
      const projectName = req.query.projectName as string | undefined
      logger.info(`PushLikes-Fetching likes for project: ${projectName}`)
      const { data: project, error: fetchError } = await supabase
         .from("projects")
         .select("*")
         .eq("name", projectName)
         .select("likes_count")
         .single()
      if (fetchError) throw fetchError

      const newLikes = (project?.likes_count ?? 0) + 1
      // Update likes
      const { data, error } = await supabase
         .from("projects")
         .update({ likes_count: newLikes })
         .eq("name", projectName)
         .select("likes_count")
         .single()

      if (error) throw error
      res.json({ likes_count: data?.likes_count ?? newLikes })
      logger.info(`PushLikes-Increasing Likes by 1 to ${newLikes} Likes for project ${projectName}`)
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      res.status(500).json({ error: message })
   }
}
// Fetch feedbacks
export const getFeedbacks = async (_req: Request, res: Response) => {
   try {
      logger.info(`Fetching feedbacks`)
      const { data, error } = await supabase
         .from("customer_feedbacks")
         .select("*")
         .order("created_at", { ascending: false })

      if (error) throw error
      res.json(data)
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      res.status(500).json({ error: message })
   }
}
// Submit a new feedback
export const submitFeedback = async (req: Request, res: Response) => {
   try {
      const { recaptchaToken, ...feedbackData } = req.body
      const isDevMode = process.env.NODE_ENV === "development"
      const useRecaptcha = process.env.VITE_USE_RECAPTCHA === "true"
      const recaptchaEnabled = !isDevMode && useRecaptcha

      logger.info(`Submitting feedback: ${JSON.stringify(feedbackData)}`)
      logger.info(`📋 reCAPTCHA: ${recaptchaEnabled ? "✅ ENABLED" : "❌ DISABLED"}`)

      // Verify reCAPTCHA token if not in dev mode and reCAPTCHA is enabled
      if (!isDevMode && useRecaptcha && recaptchaToken) {
         const secretKey = process.env.VITE_RECAPTCHA_SECRET_KEY
         const verification = await verifyRecaptchaToken(recaptchaToken, secretKey || "")

         if (!verification.isValid) {
            logger.warn("reCAPTCHA verification failed for feedback submission")
            return res.status(403).json({ error: "Verification failed. Please try again." })
         }
      } else if (!isDevMode && useRecaptcha && !recaptchaToken) {
         logger.warn("reCAPTCHA token missing in production mode with reCAPTCHA enabled")
         return res.status(400).json({ error: "reCAPTCHA token is required" })
      }

      // Insert feedback (without the token)
      const { data, error } = await supabase.from("customer_feedbacks").insert(feedbackData).select("*").single()

      if (error) throw error

      res.status(201).json(data)
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      res.status(500).json({ error: message })
   }
}
