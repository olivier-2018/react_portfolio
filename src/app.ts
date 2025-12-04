import express from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import dotenv from "dotenv"
import path from "path"
import crypto from "crypto"
import portfolioRoutes from "./routes/portfolio.routes"
import assetsRoutes from "./routes/assets.routes"
import healthRoutes from "./routes/health.routes"
import logger from "./utils/logger"

dotenv.config()
const API_PREFIX = process.env.VITE_API_PREFIX || "/api/v1"
const BACKEND_PORT = process.env.VITE_BACKEND_PORT || 3003

const app = express()

// Middleware to generate nonce
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
   // Generate a new nonce for each request
   res.locals = res.locals || {}
   res.locals.nonce = Buffer.from(crypto.randomBytes(16)).toString("base64")
   next()
})

// Middleware
// CORS configuration - parse comma-separated origins
const corsOriginString = process.env.CORS_ORIGIN || "*"
const corsOriginArray = corsOriginString === "*" ? "*" : corsOriginString.split(",").map((o: string) => o.trim())

app.use(
   cors({
      origin: corsOriginArray,
      credentials: true,
   })
)
app.use(
   helmet({
      contentSecurityPolicy: {
         directives: {
            "default-src": ["'self'"],
            "img-src": ["'self'", "data:", "blob:"],
            "media-src": ["'self'", "blob:"],
            "script-src": [
               "'self'",
               process.env.NODE_ENV === "production" ? null : "'unsafe-eval'",
               (_req: any, res: any) => `'nonce-${(res as express.Response).locals.nonce}'`,
            ].filter(Boolean) as string[],
            "script-src-elem": [
               "'self'",
               process.env.NODE_ENV === "production" ? null : "'unsafe-eval'",
               (_req: any, res: any) => `'nonce-${(res as express.Response).locals.nonce}'`,
            ].filter(Boolean) as string[],
            "style-src": ["'self'", "'unsafe-inline'"],
            "connect-src": ["'self'", "https://directline.botframework.com"],
            "font-src": ["'self'", "data:"],
            "object-src": ["'none'"],
            "base-uri": ["'self'"],
            "frame-ancestors": ["'none'"],
            "form-action": ["'self'"],
            "upgrade-insecure-requests": [],
            "block-all-mixed-content": [],
         },
      },
      // Other security headers
      frameguard: { action: "deny" },
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
      noSniff: true,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
   })
)
app.use(morgan("dev"))
app.use(express.json())

// API Routes (Frontend is now served from separate container)
app.use(`${API_PREFIX}`, portfolioRoutes)
app.use(`${API_PREFIX}`, assetsRoutes)
app.use(`${API_PREFIX}`, healthRoutes)

// Serve static project assets
app.use(`${API_PREFIX}/project-pictures`, express.static(path.join(__dirname, "../projects_assets/project_pictures")))
app.use(`${API_PREFIX}/project-videos`, express.static(path.join(__dirname, "../projects_assets/project_movies")))

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
   logger.error(err.stack)
   res.status(500).json({ error: "Something went wrong!" })
})
// or use Winston logging:
// app.use((req, res, next) => {
//    logger.info(`${req.method} ${req.url}`)
//    next()
// })

const server = app
   .listen(BACKEND_PORT, () => {
      logger.info(`Server is running on port ${BACKEND_PORT}`)
   })
   .on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
         logger.error(`Port ${BACKEND_PORT} is already in use. Please use a different port.`)
         process.exit(1)
      }
      logger.error(`Failed to start server: ${err.message}`)
      process.exit(1)
   })

export { app }
