const Prompt = require('../../lib/prompts/snippet');
const prompt = new Prompt({
  name: 'username',
  message: 'Please add the following config values',
  template: `
      First Name: #{first_name}
       Last Name: #{last_name}
 GitHub username: #{username}

`
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
