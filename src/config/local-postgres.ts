import { Pool } from "pg"
import * as dotenv from "dotenv"
import logger from "../utils/logger"
import { IDatabase } from "../services/database.types"

dotenv.config()

const pool = new Pool({
    user: process.env.VITE_POSTGRES_USER,
    password: process.env.VITE_POSTGRES_PASSWORD,
    host: process.env.VITE_POSTGRES_HOST || "localhost",
    port: parseInt(process.env.VITE_POSTGRES_PORT || "5432"),
    database: process.env.VITE_POSTGRES_DB,
})

// Handle pool errors
pool.on("error", (error: Error) => {
    logger.warn(`Unexpected error on idle client in pool: ${error.message}`)
})

export class LocalPostgresDatabase implements IDatabase {
    async selectAll(table: string, orderBy?: string): Promise<{ data: any[] | null; error: Error | null }> {
        try {
            const query = `SELECT * FROM "${table}"${orderBy ? ` ORDER BY "${orderBy}"` : ""}`
            const result = await pool.query(query)
            return { data: result.rows, error: null }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            logger.error(`Error in selectAll from ${table}: ${message}`)
            return { data: null, error: error instanceof Error ? error : new Error(message) }
        }
    }

    async selectWhere(
        table: string,
        column: string,
        value: any,
        orderBy?: string
    ): Promise<{ data: any[] | null; error: Error | null }> {
        try {
            const query = `SELECT * FROM "${table}" WHERE "${column}" = $1${orderBy ? ` ORDER BY "${orderBy}"` : ""}`
            const result = await pool.query(query, [value])
            return { data: result.rows, error: null }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            logger.error(`Error in selectWhere from ${table}: ${message}`)
            return { data: null, error: error instanceof Error ? error : new Error(message) }
        }
    }

    async selectOne(table: string, column: string, value: any): Promise<{ data: any | null; error: Error | null }> {
        try {
            const query = `SELECT * FROM "${table}" WHERE "${column}" = $1 LIMIT 1`
            const result = await pool.query(query, [value])
            return { data: result.rows[0] || null, error: null }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            logger.error(`Error in selectOne from ${table}: ${message}`)
            return { data: null, error: error instanceof Error ? error : new Error(message) }
        }
    }

    async insert(table: string, data: any): Promise<{ data: any | null; error: Error | null }> {
        try {
            const columns = Object.keys(data)
            const values = Object.values(data)
            const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ")
            const columnNames = columns.map((col) => `"${col}"`).join(", ")

            const query = `INSERT INTO "${table}" (${columnNames}) VALUES (${placeholders}) RETURNING *`
            const result = await pool.query(query, values)
            return { data: result.rows[0] || null, error: null }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            logger.error(`Error in insert into ${table}: ${message}`)
            return { data: null, error: error instanceof Error ? error : new Error(message) }
        }
    }

    async update(table: string, data: any, column: string, value: any): Promise<{ data: any | null; error: Error | null }> {
        try {
            const updates = Object.entries(data)
                .map(([key], index) => `"${key}" = $${index + 1}`)
                .join(", ")
            const values = Object.values(data)
            values.push(value)

            const query = `UPDATE "${table}" SET ${updates} WHERE "${column}" = $${values.length} RETURNING *`
            const result = await pool.query(query, values)
            return { data: result.rows[0] || null, error: null }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            logger.error(`Error in update in ${table}: ${message}`)
            return { data: null, error: error instanceof Error ? error : new Error(message) }
        }
    }
}

export default new LocalPostgresDatabase()
