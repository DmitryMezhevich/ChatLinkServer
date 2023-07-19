require('dotenv').config({ path: './configuration/.env.' })
const mountRouter = require('./router/mountRouter')
const express = require('express')

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
mountRouter(app)

app.listen(PORT, () => console.log(`Server is running on ${PORT} port!`))
