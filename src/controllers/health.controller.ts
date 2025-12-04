import { Request, Response } from "express"
import os from "os"

/**
 * Health check controller
 * Returns basic health information about the server
 */
export const getHealthStatus = (_req: Request, res: Response) => {
   const healthcheck = {
      status: "ok",
      timestamp: new Date(),
      uptime: process.uptime(),
      memory: {
         total: os.totalmem(),
         free: os.freemem(),
         used: os.totalmem() - os.freemem(),
         usage: (((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2) + "%",
      },
      cpu: {
         cores: os.cpus().length,
         model: os.cpus()[0].model,
         loadavg: os.loadavg(),
      },
   }

   try {
      res.status(200).json(healthcheck)
   } catch (error) {
      res.status(503).json({
         status: "error",
         timestamp: new Date(),
         error: error instanceof Error ? error.message : "Unknown error occurred",
      })
   }
}
