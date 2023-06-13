require('dotenv').config({ path: './configuration/.env.' })
const router = require('./router/auth-router/auth-router')
const express = require('express')

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use('/API', router)

app.listen(PORT, () => console.log(`Server is running on ${PORT} port!`))
