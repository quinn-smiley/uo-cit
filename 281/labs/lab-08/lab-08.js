const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;
const HOST = 'localhost';

// #3: TODO:
// Serve static files from public subfolder using .use(), express.static(), and path.join().
// Rather than __dirname, use process.cwd()

app.get("/photos", (request, response) => {
  const photos = response.json()
  const topTwenty = photos.slice(0, 19)
  fetch('https://jsonplaceholder.typicode.com/photos')
  .then(response => {return photos})
  .then(json => console.log(json))
  .catch(error)
  
  if(topTwenty){
        res.status(200).type('application/json; charset=utf-8');
        res.send(topTwenty);
    }else{
        res.status(500).type('application/json; charset=utf-8');
        res.send({error: 'Not Found'})
    }
  
});

app.get("/photos/:id", (request, reply) => {
  // #2 TODO:
  // Retrieve a single photo given information given id from JSONPlaceholder and return as JSON
  // You must use fetch () chain method with two .then() and a .catch().
  // The first .then() must convert from JSON.
  // The second .then() must return photos with status of 200 as JSON single photo object.
  // The .catch() must return code 500 with any error message as JSON and an error property.
});

// Handle 404 for unknown routes
app.use((request, response) => {
  response.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log('Working directory:', process.cwd());
  console.log(`Server running at http://${HOST}:${PORT}`);
});