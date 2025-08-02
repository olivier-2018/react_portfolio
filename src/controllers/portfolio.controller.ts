import { Request, Response } from "express"
import { supabase } from "../config/supabase"

export const getSkills = async (_req: Request, res: Response) => {
   try {
      const { data, error } = await supabase.from("skills").select("*").order("category")

      if (error) throw error
      res.json(data)
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      res.status(500).json({ error: message })
   }
}

export const getSkillCategories = async (_req: Request, res: Response) => {
   try {
      const { data, error } = await supabase.from("skill_categories").select("*").order("name")

      if (error) throw error
      res.json(data)
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      res.status(500).json({ error: message })
   }
}

export const getProjects = async (_req: Request, res: Response) => {
   try {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

      if (error) throw error
      res.json(data)
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      res.status(500).json({ error: message })
   }
}

export const getProjectCategories = async (_req: Request, res: Response) => {
   try {
      const { data, error } = await supabase.from("project_categories").select("*").order("name")

      if (error) throw error
      res.json(data)
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      res.status(500).json({ error: message })
   }
}

export const getFeedbacks = async (_req: Request, res: Response) => {
   try {
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

export const getProjectLikes = async (req: Request, res: Response) => {
   try {
      const { name } = req.params
      const { data, error } = await supabase
         .from("projects")
         .select("*")
         .eq("name", name)
         .select("likes_count")
         .single()
      if (error) throw error
      res.json({ likes_count: data?.likes_count ?? 0 })
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      res.status(500).json({ error: message })
   }
}

export const incrementProjectLikes = async (req: Request, res: Response) => {
   try {
      const { name } = req.params
      // Get current likes
      const { data: project, error: fetchError } = await supabase
         .from("projects")
         .select("likes_count")
         .eq("name", name)
         .single()
      if (fetchError) throw fetchError
      const newLikes = (project?.likes_count ?? 0) + 1
      // Update likes
      const { data, error } = await supabase
         .from("projects")
         .update({ likes_count: newLikes })
         .eq("name", name)
         .select("likes_count")
         .single()
      if (error) throw error
      res.json({ likes_count: data?.likes_count ?? newLikes })
   } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      res.status(500).json({ error: message })
   }
}
