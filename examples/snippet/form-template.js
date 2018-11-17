'use strict';

const { Snippet } = require('enquirer');
const prompt = new Snippet({
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
