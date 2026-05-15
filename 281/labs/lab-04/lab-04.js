// Include express module, and create an instance of express
const express = require('express');
const app = express();

// Set listen IP and port
const listenPort = 8080;
const listenIP = '127.0.0.1';

// Middleware to parse JSON bodies
app.use(express.json());

// GET /
app.get('/', (req, res) => {
  res.status(200).type('text/html; charset=utf-8');
  res.send('<h1>Hello from Express GET / route!</h1>');
});

// GET /
app.get('/name', (req, res) => {
    const {first, last} = req.query;
    const name = (first && last) ? `${first} ${last}` : 'Guest';
    res.status(200).type('text/html; charset=utf-8');
    res.send(`<h1>Hello, ${name}</h1>`);
  });

// 404 handler
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// Start the server
app.listen(listenPort, listenIP, () => {
  console.log(`Server running at http://${listenIP}:${listenPort}`);
});
