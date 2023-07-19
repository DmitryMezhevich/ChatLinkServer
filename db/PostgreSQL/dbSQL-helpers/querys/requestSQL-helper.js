const dbRequest = require('../index');
const sqlQuery = require('./module/queryHelper').queries;

class RequestSQLHelper {
    async getUser(userEmail, userID = null, userName = null) {
        const { rows } = await dbRequest(sqlQuery.getUser, [
            userID,
            userEmail,
            userName,
        ]);

        return rows[0];
    }
}

module.exports = new RequestSQLHelper();
