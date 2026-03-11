// Database abstraction types - common interface for both Supabase and local PostgreSQL

export interface QueryBuilder<T = any> {
    select(...columns: string[]): QueryBuilder<T>
    eq(column: string, value: any): QueryBuilder<T>
    order(column: string, options?: { ascending?: boolean }): QueryBuilder<T>
    single(): Promise<{ data: T | null; error: Error | null }>
    then(callback: (result: { data: T[] | T | null; error: Error | null }) => any): Promise<void>
}

export interface DatabaseClient {
    from(table: string): {
        select(columns: string): QueryBuilder
        insert(data: any): {
            select(columns: string): {
                single(): Promise<{ data: any; error: Error | null }>
            }
        }
        update(data: any): {
            eq(column: string, value: any): {
                select(columns: string): {
                    single(): Promise<{ data: any; error: Error | null }>
                }
            }
        }
    }
}

// A generic database adapter interface for easier implementation
export interface IDatabase {
    // SELECT operations
    selectAll(table: string, orderBy?: string): Promise<{ data: any[] | null; error: Error | null }>
    selectWhere(table: string, column: string, value: any, orderBy?: string): Promise<{ data: any[] | null; error: Error | null }>
    selectOne(table: string, column: string, value: any): Promise<{ data: any | null; error: Error | null }>

    // INSERT operations
    insert(table: string, data: any): Promise<{ data: any | null; error: Error | null }>

    // UPDATE operations
    update(table: string, data: any, column: string, value: any): Promise<{ data: any | null; error: Error | null }>
}
