const app = require('express')();
const path = require('path');
const heatmapGenerator = require('./heatmapGenerator.js');

// Serve static files from the 'public' directory
app.use(require('express').static('public'));

// Define a route for the homepage ('/')
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Define the port number for the server to listen on
const port = 3000;

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    heatmapGenerator.generateHeatmap();
});

// Handling the 404 error
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

// Server Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});