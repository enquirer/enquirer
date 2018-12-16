
exports.format = function(input) {
  if (typeof input !== 'string') return '';
  let lines = input.trim().split('\n');
  let str = lines.slice(1).join('\n').trim();
  return str.split('../../../issues').join('../../issues')
    .replace(/^(#+)\s/gm, (m, $1) => '#' + $1 + ' ');
};
