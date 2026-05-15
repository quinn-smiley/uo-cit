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

const students = [
    {
        id: 1,
        last: "Last1",
        first: "First1",
      },
      {
        id: 2,
        last: "Last2",
        first: "First2",
      },
      {
        id: 3,
        last: "Last3",
        first: "First3",
      }
];

// GET /
app.get('/cit/student', (req, res) => {
    res.status(200).type('application/json; charset=utf-8');
    res.send(students);
  });


  // GET /
app.get('/cit/student/:id', (req, res) => {
    const studentId = parseInt(req.params.id)
    let myStudent = null;
    for(const stud of students){
        if(stud.id === studentId){
            myStudent = stud;
            break;
        }
    }
    if(myStudent){
        res.status(200).type('application/json; charset=utf-8');
        res.send(myStudent);
    }else{
        res.status(404).type('application/json; charset=utf-8');
        res.send({error: 'Not Found'})
    }
  });

// get id
const getNewId = () => {
  let ids = students.map((x) => x.id);
  return Math.max(...ids) + 1;
}

  // POST /
app.post('/cit/student', (req, res) => {
    const {first, last} = req.body;
    if(!first || !last){
        res
        .status(400)
        .type('application/json; charset=utf-8')
        .send({error: 'first and last are required fields'})
    }else{
        const studentId = getNewId();
        students.push({id: studentId, last, first});

        const student = students.find((x) => x.id === studentId);
        res.status(200).type('application/json; charset=utf-8');
        res.send(student);
    }
    }
  );


// 404 handler
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// Start the server
app.listen(listenPort, listenIP, () => {
  console.log(`Server running at http://${listenIP}:${listenPort}`);
});
