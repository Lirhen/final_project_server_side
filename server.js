/**
 * server.js
 * Entry point – boots the HTTP server and listens on PORT.
 */
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});