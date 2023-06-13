const dbRequest = require('../../db/index')
const sqlQuery = require('./queryHelpers').queries

class RequestSQLHelper {
    async getEmailForVerificationCode(email) {
        return dbRequest(sqlQuery.getEmail, [email])
    }
}

module.exports = new RequestSQLHelper()
