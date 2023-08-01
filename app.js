require('dotenv').config({ path: './configuration/.env.local' });

const express = require('express');

require('dotenv').config({ path: './configuration/.env.' });
const errorMiddleware = require('./middleware/error-middleware');
const mountRouter = require('./router/mountRouter');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
mountRouter(app);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server is running on ${PORT} port!`));
