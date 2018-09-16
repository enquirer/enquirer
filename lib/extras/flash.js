'use strict';

const flash = async(prompt, msg, ms = 1000) => {
  const error = prompt.error;
  let cursorHidden = prompt.cursorHidden;
  let resolved = false;
  let timeout;

  let clear = () => {
    prompt.clearTimeout && prompt.clearTimeout();
    prompt.off('keypress', clear);
  };

  prompt.once('keypress', clear);
  if (!cursorHidden) prompt.cursorHide();
  prompt.error = msg;
  prompt.render();

  return new Promise((resolve, reject) => {
    let dispatch = () => {
      if (resolved === true) return;
      resolved = true;
      try {
        prompt.cursor = 0;
        if (!cursorHidden) prompt.cursorShow();
        prompt.error = error;
        prompt.render();
        resolve();
      } catch (err) {
        reject();
      }
    };

    timeout = setTimeout(dispatch, ms);
    prompt.clearTimeout = () => {
      if (resolved === true) return;
      prompt.clearTimeout = void 0;
      clearTimeout(timeout);
      dispatch();
    };
  });
};

module.exports = flash;
