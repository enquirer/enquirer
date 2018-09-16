const Prompt = require('../../lib/prompts/text');
const options = key => ({ name: key, message: `What is your ${key}?` });
const answers = {};

(async () => {
  for (let key of ['name', 'username', 'email']) {
    answers[key] = await new Prompt(options(key)).run();
  }
  console.log(answers);
})();
