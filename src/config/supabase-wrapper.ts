import { supabase } from "./supabase"
import logger from "../utils/logger"
import { IDatabase } from "../services/database.types"

export class SupabaseDatabase implements IDatabase {
    async selectAll(table: string, orderBy?: string): Promise<{ data: any[] | null; error: Error | null }> {
        try {
            let query = supabase.from(table).select("*")

            if (orderBy) {
                query = query.order(orderBy)
            }

            const { data, error } = await query

            if (error) throw error
            return { data, error: null }
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
            let query = supabase.from(table).select("*").eq(column, value)

            if (orderBy) {
                query = query.order(orderBy)
            }

            const { data, error } = await query

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            logger.error(`Error in selectWhere from ${table}: ${message}`)
            return { data: null, error: error instanceof Error ? error : new Error(message) }
        }
    }

    async selectOne(table: string, column: string, value: any): Promise<{ data: any | null; error: Error | null }> {
        try {
            const { data, error } = await supabase.from(table).select("*").eq(column, value).single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            logger.error(`Error in selectOne from ${table}: ${message}`)
            return { data: null, error: error instanceof Error ? error : new Error(message) }
        }
    }

    async insert(table: string, data: any): Promise<{ data: any | null; error: Error | null }> {
        try {
            const { data: result, error } = await supabase.from(table).insert(data).select("*").single()

            if (error) throw error
            return { data: result, error: null }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            logger.error(`Error in insert into ${table}: ${message}`)
            return { data: null, error: error instanceof Error ? error : new Error(message) }
        }
    }

    async update(table: string, data: any, column: string, value: any): Promise<{ data: any | null; error: Error | null }> {
        try {
            const { data: result, error } = await supabase
                .from(table)
                .update(data)
                .eq(column, value)
                .select("*")
                .single()

            if (error) throw error
            return { data: result, error: null }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            logger.error(`Error in update in ${table}: ${message}`)
            return { data: null, error: error instanceof Error ? error : new Error(message) }
        }
    }
}

export default new SupabaseDatabase()
