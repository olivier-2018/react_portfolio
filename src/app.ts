import express from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import dotenv from "dotenv"
import path from "path"
import portfolioRoutes from "./routes/portfolio.routes"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())

// Serve static files from client build
const clientBuildPath = path.join(__dirname, "../client/dist")
app.use(express.static(clientBuildPath))

// API Routes
app.use("/api/v1", portfolioRoutes)

// Fallback: serve index.html for any non-API route (SPA support)
app.get("*", (req, res) => {
   res.sendFile(path.join(clientBuildPath, "index.html"))
})

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
   console.error(err.stack)
   res.status(500).json({ error: "Something went wrong!" })
})

const PORT = process.env.PORT || 3003

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`)
})

export { app }
