const { highlight } = require('cli-highlight');

module.exports = async function log(results) {
  const data = await results;
  const pretty = JSON.stringify(data, null, 4);
  const highlighted = highlight(pretty, {language: 'json'});
  console.log(highlighted);
}
