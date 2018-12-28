const { highlight } = require('cli-highlight');

module.exports = answers => {
  const pretty = JSON.stringify(answers, null, 2);
  return highlight(pretty, { language: 'json' });
};
