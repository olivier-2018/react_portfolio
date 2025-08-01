import express from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import dotenv from "dotenv"
import portfolioRoutes from "./routes/portfolio.routes"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())

// Routes
app.use("/api/v1", portfolioRoutes)

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
   console.error(err.stack)
   res.status(500).json({ error: "Something went wrong!" })
})

const PORT = process.env.PORT || 3003

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`)
})
