const fs = require('fs')

class QueryHelper {
    constructor() {
        this.queries = {}
        this._loadQueries()
    }

    _loadQueries() {
        const sqlFile = fs.readFileSync(`${__dirname}/authQuery.sql`, 'utf8')
        const queries = sqlFile.split('\n')

        queries.forEach((query) => {
            if (!query.includes('//') && query.length > 0) {
                const trimmedQuery = query.trim()

                if (trimmedQuery) {
                    const [queryName, queryString] = trimmedQuery.split(':')

                    if (queryName && queryString) {
                        this.queries[queryName.trim()] = queryString.trim()
                    }
                }
            }
        })
    }
}

module.exports = new QueryHelper()
