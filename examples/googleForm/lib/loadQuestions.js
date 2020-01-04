const request = require("request");
const parse = require("./parse");

const loadQuestions = formId => {
  return new Promise((resolve, reject) => {
    request(
      `https://docs.google.com/forms/d/e/${formId}/viewform`,
      (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          let questions = parse(body);
          resolve(questions);
        }
      }
    );
  });
};

module.exports = loadQuestions;
