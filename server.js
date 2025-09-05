/*
 * server.js
 * Entry point – starts the HTTP server on PORT using the Express app.
 */
const app = require('./app');
const PORT = process.env.PORT || 3000;

// Start listening for HTTP requests
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});