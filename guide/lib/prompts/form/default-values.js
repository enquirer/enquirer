const { prompt } = require("enquirer");
const log = require("../../utils/log");

const results = prompt({
  choices: [
    {
      initial: "Jon",
      message: "First Name",
      name: "firstname"
    },
    {
      initial: "Schlinkert",
      message: "Last Name",
      name: "lastname"
    },
    {
      message: "GitHub username",
      name: "username",
      onChoice(state, choice, i) {
        const { firstname, lastname } = this.values;
        choice.initial = `${firstname}${lastname}`.toLowerCase();
      }
    }
  ],
  message: "Please provide the following information:",
  name: "user",
  type: "form"
});

log(results);
