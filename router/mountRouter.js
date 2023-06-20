const uathRouter = require('./auth-router/auth-router')

module.exports = mountRouter = (app) => {
    app.use('/API', uathRouter)
}
