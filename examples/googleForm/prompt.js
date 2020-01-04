const GoogleFormPrompt = require('../../lib/prompts/google');

const prompt = new GoogleFormPrompt({
    name: "Google Form",
    message: "Please provide the information:",
    form_id: process.argv[2],
});

prompt.run()
.then(res => console.log(res))
.catch(err => console.log(err));