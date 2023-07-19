require('dotenv').config({ path: './configuration/.env.local' })
const { Pool } = require('pg')

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })

module.exports = query = (text, params, cb) => {
    return pool.query(text, params, cb)
}
