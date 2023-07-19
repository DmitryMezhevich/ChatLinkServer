const uathRouter = require('./auth-router/auth-router')

module.exports = (app) => {
    app.use('/auth', uathRouter)
}
