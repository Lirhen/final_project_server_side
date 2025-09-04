/**
 * @file server.js
 * @description Entry point: starts HTTP server on PORT.
 * @requires ./app
 */
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});