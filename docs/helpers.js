
exports.format = (input = '') => {
  if (typeof input !== 'string') return '';
  const lines = input.trim().split('\n');
  const str = lines.slice(1).join('\n').trim();
  return str.split('../../../issues').join('../../issues')
    .replace(/^(#+)\s/gm, (m, $1) => '#' + $1 + ' ');
};
