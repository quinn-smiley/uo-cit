const {data} = require('./p4-data.js')

const questions = ['Q1', 'Q2', 'Q3'];

const getQuestions = () => {
    return questions
}

//console.log(getQuestions());

const answers = ['A1', 'A2', 'A3'];

const getAnswers = () => {
    return answers
}

//console.log(getAnswers());

const structured = [
    { question: 'Q1', answer: 'A1' },
    { question: 'Q2', answer: 'A2' },
    { question: 'Q3', answer: 'A3' }
  ]

const getQuestionsAnswers = () => {
    return structured
}

//console.log(getQuestionsAnswers());

const getQuestion = (number="") => {
    const result = {
        question: '',
        number: '',
        error: '',
    };

    if (number === "") {
        result.error = "Question number is required";
    } else {
        const index = parseInt(number) - 1;
        if (index >= 0 && index < structured.length) {
            result.question = structured[index].question;
            result.number = parseInt(number);
        } else {
            result.error = "Invalid question number"
        }
    }
    return result;
};

//console.log(getQuestion(2));

const getAnswer = (number='') => {
    const result = {
        answer: '',
        number: '',
        error: '',
    };

    if (number === "") {
        result.error = "Answer number is required";
    } else {
        const index = parseInt(number) - 1;
        if (index >= 0 && index < structured.length) {
            result.answer = structured[index].answer;
            result.number = parseInt(number);
        } else {
            result.error = "Invalid answer number"
        }
    }
    return result;
    
};

//console.log(getAnswer(2))

function getQuestionAnswer(number = ''){
    const result = {
        question: '',
        answer: '',
        number: '',
        error: '',
    };

    if (number === "") {
        result.error = "Answer number is required";
    } else {
        const index = parseInt(number) - 1;
        if (index >= 0 && index < structured.length) {
            result.question = structured[index].question;
            result.answer = structured[index].answer;
            result.number = parseInt(number);
        } else {
            result.error = "Invalid answer number"
        }
    }
    return result;
};

//console.log(getQuestionAnswer(1));

/*****************************
  Module function testing
******************************/
function testing(category, ...args) {
  console.log(`\n** Testing ${category} **`);
  console.log("-------------------------------");
  for (const o of args) {
    console.log(`-> ${category}${o.d}:`);
    console.log(o.f);
  }
}

// Set a constant to true to test the appropriate function
const testGetQs = false;
const testGetAs = false;
const testGetQsAs = false;
const testGetQ = false;
const testGetA = false;
const testGetQA = false;

// getQuestions()
if (testGetQs) {
  testing("getQuestions", { d: "()", f: getQuestions() });
}

// getAnswers()
if (testGetAs) {
  testing("getAnswers", { d: "()", f: getAnswers() });
}

// getQuestionsAnswers()
if (testGetQsAs) {
  testing("getQuestionsAnswers", { d: "()", f: getQuestionsAnswers() });
}

// getQuestion()
if (testGetQ) {
  testing(
    "getQuestion",
    { d: "()", f: getQuestion() },      // Extra credit: +1
    { d: "(0)", f: getQuestion(0) },    // Extra credit: +1
    { d: "(1)", f: getQuestion(1) },
    { d: "(4)", f: getQuestion(4) }     // Extra credit: +1
  );
}

// getAnswer()
if (testGetA) {
  testing(
    "getAnswer",
    { d: "()", f: getAnswer() },        // Extra credit: +1
    { d: "(0)", f: getAnswer(0) },      // Extra credit: +1
    { d: "(1)", f: getAnswer(1) },
    { d: "(4)", f: getAnswer(4) }       // Extra credit: +1
  );
}

// getQuestionAnswer()
if (testGetQA) {
  testing(
    "getQuestionAnswer",
    { d: "()", f: getQuestionAnswer() },    // Extra credit: +1
    { d: "(0)", f: getQuestionAnswer(0) },  // Extra credit: +1
    { d: "(1)", f: getQuestionAnswer(1) },
    { d: "(4)", f: getQuestionAnswer(4) }   // Extra credit: +1
  );
}

module.exports = {
    getQuestions,
    getAnswers,
    getQuestionsAnswers,
    getQuestion,
    getAnswer,
    getQuestionAnswer
};