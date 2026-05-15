const express = require('express')
const {getQuestions,
    getAnswers,
    getQuestionsAnswers,
    getQuestion,
    getAnswer,
    getQuestionAnswer} = require('./p4-module')
const app = express()
const p4Module = require('./p4-module')
app.use(express.static('p4'))

module.exports = {
    getQuestions,
    getAnswers,
    getQuestionsAnswers,
    getQuestion,
    getAnswer,
    getQuestionAnswer
};

const listenIP = 'localhost';
const listenPort = 8080;

app.listen(listenPort, listenIP, () => {
    console.log(`Server is running on http://${listenIP}:${listenPort}`)
})

app.get('/cit/question', (req, res) => {
    const result = {
        error: '',
        statusCode: 200,
        questions: getQuestions()
    };
    res.json(result)
});

app.get('/cit/answer', (req, res) => {
     const result = {
        error: '',
        statusCode: 200,
        questions: getAnswers()
    };
    res.json(result)
});

app.get('/cit/questionanswer', (req, res) => {
    const result = {
        error: '',
        statusCode: 200,
        answers: getQuestionsAnswers()
    };
    res.json(result)
})

app.get('/cit/question/:number', (req, res) => {
    const questions = ['Q1', 'Q2', 'Q3'];
    const result = {
        error: '',
        statusCode: 200,
        questions: questions[0],
        number: 1
    };
    res.json(result)
})

app.get('/cit/answer/:number', (req, res) => {
    const answers = ['A1', 'A2', 'A3'];
    const result = {
        error: '',
        statusCode: 200,
        answer: answers[1],
        number: 2
    };
    res.json(result)
})

app.get('/cit/questionanswer/:number', (req, res) => {
     const questions = ['Q1', 'Q2', 'Q3'];
     const answers = ['A1', 'A2', 'A3'];
     const result = {
        error: '',
        statusCode: 200,
        question: questions[2],
        answer: answers[2],
        number: 3
    };
    res.json(result)
})

app.use((req, res) => {
    const response = {
    error: 'Route not found', 
    statusCode: 404
  };
  res.status(404).send(response);
});