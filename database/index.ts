import { Database } from "sqlite3"
import path from 'path'

class DB extends Database {
    private static instance: DB

    constructor() {
        const dbPath = path.join(process.cwd(), '/database', '/tgbc.db')
        super(dbPath)
        this.init()
    }

    runAsync(sql: string, params?: any): Promise<number | null> {
        return new Promise((resolve, reject) => {
            const args = [sql]
            if (params) args[1] = params
            this.run(...args as [string, any], function (err: Error | null) {
                if (err) reject(err)
                resolve(this?.lastID || null)
            })

        })
    }

    getAsync(sql: string, params?: any, all?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            const args = [sql]
            if (params) args[1] = params
            const method = all ? 'all' : 'get'
            this[method](...args as [string, any], (err: Error | null, row: any) => {
                if (err) reject(err)
                resolve(row)
            })
        })
    }

    allAsync(sql: string, params?: any): Promise<any> {
        return this.getAsync(sql, params, true)
    }

    init() {
        const fields = [
            'id INTEGER PRIMARY KEY AUTOINCREMENT',
            'name VARCHAR(255) NOT NULL',
            'branch JSON NOT NULL',
            'status BOOLEAN DEFAULT FALSE NOT NULL',
            'token VARCHAR(255) DEFAULT NULL'
        ]
        this.run(
            'CREATE TABLE IF NOT EXISTS bots ('+ fields +')'
        )
    }

    static getInstance() {
        if (!DB.instance) {
            DB.instance = new DB()
        }
        return DB.instance
    }
}

export default DB.getInstance()
