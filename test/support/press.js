const keys = require('./keys');

module.exports = function(sequence = '') {
  return keys[sequence] || { name: sequence };
};
