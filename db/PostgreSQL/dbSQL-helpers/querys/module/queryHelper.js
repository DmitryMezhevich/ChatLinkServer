const fs = require('fs');

class QueryHelper {
    constructor() {
        this.queries = {};
        this.#loadQueries();
    }

    #loadQueries() {
        const sqlFile = fs.readFileSync(`${__dirname}/authQuery.sql`, 'utf8');
        const queries = sqlFile.split('\n');

        let tempQueryName = '';

        queries.forEach((query) => {
            if (!query.includes('//') && query.length > 0) {
                const trimmedQuery = query.trim();

                if (trimmedQuery) {
                    const [queryName, queryString] = trimmedQuery.split(':');

                    if (queryName && queryString) {
                        this.queries[queryName] = queryString.trim();
                    }

                    if (queryString) {
                        tempQueryName = queryName;
                    } else {
                        this.queries[tempQueryName] += ` ${queryName}`;
                    }
                }
            }
        });
    }
}

module.exports = new QueryHelper();
