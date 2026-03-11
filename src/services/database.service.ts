import * as dotenv from "dotenv"
import logger from "../utils/logger"
import { IDatabase } from "./database.types"
import supabaseDatabase from "../config/supabase-wrapper"
import localPostgresDatabase from "../config/local-postgres"

dotenv.config()

const DB_SELECT = process.env.VITE_DB_SELECT || "supabase"
const VALID_DB_OPTIONS = ["supabase", "local"]

class DatabaseService {
    private db: IDatabase | null = null

    constructor() {
        this.validateAndInitialize()
    }

    private validateAndInitialize(): void {
        if (!VALID_DB_OPTIONS.includes(DB_SELECT)) {
            logger.warn(
                `Invalid VITE_DB_SELECT value: "${DB_SELECT}". Must be one of ${VALID_DB_OPTIONS.join(", ")}. Defaulting to "supabase"`
            )
            this.db = supabaseDatabase
            return
        }

        if (DB_SELECT === "supabase") {
            this.db = supabaseDatabase
        } else if (DB_SELECT === "local") {
            this.db = localPostgresDatabase
        }

        logger.info(`Database initialized with backend: ${DB_SELECT}`)
    }

    getDatabase(): IDatabase {
        if (!this.db) {
            const message = "Database not initialized"
            logger.error(message)
            throw new Error(message)
        }
        return this.db
    }
}

export const databaseService = new DatabaseService()
export default databaseService
