const colors = require('ansi-colors');

const repeatStyles = (arr, times = 2, blacklist) => {
  let omit = blacklist || ['black', 'gray', 'grey', 'white'];
  return arr.reduce((acc, n) => {
    if (omit.includes(n)) return acc;
    let list = Array(times).fill(n);
    return acc.concat(list);
  }, []);
};

const animate = (prompt, prop = 'prefix', options = {}) => {
  let state = { index: 0, timeout: null };
  let { frames, interval, styles = colors.keys.color, repeat, offset = 0, blacklist } = options;
  const frame = (arr, i) => arr[i % arr.length];
  let fns = repeatStyles(styles, repeat, blacklist).map(n => colors[n]);
  let getFrame = i => frame(fns, i)(frame(frames, i).trim());

  prompt.state.symbols[prop] = getFrame(0);

  return {
    start() {
      setTimeout(() => {
        (function spinner(i) {
          state.timeout = setTimeout(() => {
            prompt.symbols[prop] = getFrame(i);
            prompt.render();
            spinner(i + 1);
          }, interval);
        })(0);
      }, offset);
    },
    stop: () => clearTimeout(state.timeout),
    getFrame
  }
};

module.exports = animate;
