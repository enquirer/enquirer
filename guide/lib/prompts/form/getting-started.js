const { prompt } = require("enquirer");
const log = require("../../utils/log");

const results = prompt({
  choices: [
    {
      message: "First Name",
      name: "firstname"
    },
    {
      message: "Last Name",
      name: "lastname"
    },
    {
      message: "GitHub username",
      name: "username"
    }
  ],
  message: "Please provide the following information:",
  name: "user",
  type: "form"
});

log(results);
