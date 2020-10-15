import readline from 'readline';
import colors from 'ansi-colors';
import EventEmitter from 'events';

const env = {
  get(variableName) {
    return process.env[variableName];
  },
  set(variableName, variableValue) {
    process.env[variableName] = variableValue;
  }
};

const isWindows = () => process.platform === 'win32';

export default {
  EventEmitter,
  colors,
  readline,
  exit: process.exit,
  stdout: process.stdout,
  stdin: process.stdin,
  env,
  isWindows
};
