require('dotenv').config({ path: './configuration/.env.local' });
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

module.exports = (text, params) => pool.query(text, params);
