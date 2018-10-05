const Prompt = require('../../lib/prompts/snippet');
const prompt = new Prompt({
  name: 'username',
  message: 'Fill out the fields in package.json',
  template: `
      First Name: #{first_name}
       Last Name: #{last_name}
 GitHub username: #{username}
          Domain: #{company:sellside}
           Email: #{email:username}@#{domain:company}.com

`
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
