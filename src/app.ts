import express from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import dotenv from "dotenv"
import path from "path"
import crypto from "crypto"
import portfolioRoutes from "./routes/portfolio.routes"
import assetsRoutes from "./routes/assets.routes"
import logger from "./utils/logger"

dotenv.config()

const app = express()

// Middleware to generate nonce
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
   // Generate a new nonce for each request
   res.locals = res.locals || {}
   res.locals.nonce = Buffer.from(crypto.randomBytes(16)).toString("base64")
   next()
})

// Middleware
app.use(cors())
app.use(
   helmet({
      contentSecurityPolicy: {
         directives: {
            "default-src": ["'self'"],
            "img-src": ["'self'", "data:", "blob:"],
            "media-src": ["'self'", "blob:"],
            "script-src":
               process.env.NODE_ENV === "production"
                  ? ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`]
                  : ["'self'", "'unsafe-eval'", (req, res) => `'nonce-${res.locals.nonce}'`],
            "script-src-elem":
               process.env.NODE_ENV === "production"
                  ? ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`]
                  : ["'self'", "'unsafe-eval'", (req, res) => `'nonce-${res.locals.nonce}'`],
            "style-src": ["'self'", "'unsafe-inline'"],
            "connect-src": ["'self'"],
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

// Serve static files from client build
const clientBuildPath = path.join(__dirname, "../client/dist")
app.use(express.static(clientBuildPath))

// API Routes
app.use("/api/v1", portfolioRoutes)
app.use("/api/assets", assetsRoutes)

// Serve static project assets
app.use("/assets/project-pictures", express.static(path.join(__dirname, "../projects_assets/project_pictures")))
app.use("/assets/project-videos", express.static(path.join(__dirname, "../projects_assets/project_movies")))

// Fallback: serve index.html for any non-API route (SPA support)
app.get("*", (req, res) => {
   res.sendFile(path.join(clientBuildPath, "index.html"))
})

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

const PORT = process.env.PORT || 3003

app.listen(PORT, () => {
   logger.info(`Server is running on port ${PORT}`)
})

export { app }
