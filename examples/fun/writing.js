const colors = require('ansi-colors');
const { Input } = require('enquirer');

/**
 * This examples shows how to use the `timers` option to
 * create multiple spinners, each with a different framerate.
 */

const frames = ['✐', '✏', '✎', '✏'];
const frame = i => frames[i % frames.length];
let i = 1;

const prompt = new Input({
  name: 'pencil',
  message: 'Please wait while your answers are saved',
  hint: 'Writing...',
  timers: { separator: 200, prefix: 40 },
  prefix() {
    return colors.cyan(String(i));
  },
  separator(state) {
    return colors.cyan(frame(state.timers.separator.tick));
  },
  onSubmit(name, value = 'foo') {
    return value;
  }
});

let interval = setInterval(() => {
  if (++i === 5) {
    clearInterval(interval);
    prompt.submit();
  }
}, 1000);

prompt.on('close', () => clearInterval(interval));

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
