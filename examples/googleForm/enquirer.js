const Enquirer = require("enquirer");
const GoogleFormPrompt = require("../../lib/prompts/google");

const enquirer = new Enquirer();
enquirer.register("google", GoogleFormPrompt);

enquirer
  .prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "Would you like fill out our Survey?"
    },
    {
      name: "Google Form",
      message: "Please provide the information:",
      form_id: process.argv[2],
      type: "google",
      skip() {
          return this.state.answers.confirm !== true;
      }
    }
  ])
  .then(res => console.log(res))
  .catch(err => console.log(err));
