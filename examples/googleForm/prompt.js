"use strict";
const scrapeForm = require("google-form-terminal");
const { Form } = require('enquirer');

let questions = [];
let enqQuestions = [];

const generateQuestion = async () => {
  questions = await scrapeForm();

  questions.forEach(question => {
    let choices = {};
    choices.name = question.trim();
    choices.message = `${question}:`;
    enqQuestions.push(choices);
  });

  return enqQuestions;
};

const GoogleFormPrompt = new Form({
  name: 'Google Form',
  message: 'Please provide the information:',
  choices: generateQuestion()
});

GoogleFormPrompt.run()
  .then(value => console.log('Answers:', value))
  .catch(console.error);