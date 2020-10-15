import readline from 'readline';
import colors from 'ansi-colors';
import EventEmitter from 'events';
import osSignals from './osSignals.js';

const env = {
  get(variableName) {
    return process.env[variableName];
  },
  set(variableName, variableValue) {
    process.env[variableName] = variableValue;
  }
};

const isWindows = () => process.platform === 'win32';

const onOsSignal = async(osSignal) => {
  if (!osSignals[osSignal]) {
    throw Error(`Unknown OS signal ${osSignal}`);
  }

  switch (osSignal) {
    case osSignals.SIGINT:
      return new Promise((resolve) => process.once('SIGINT', resolve));
    case osSignals.SIGTERM:
      return new Promise((resolve) => process.once('SIGTERM', resolve));
    case osSignals.EXIT:
      return new Promise((resolve) => process.once('exit', resolve));
    default:
      throw Error(`Unsupported OS signal ${osSignal}`);
  }
};

export default {
  EventEmitter,
  colors,
  readline,
  exit: process.exit,
  stdout: process.stdout,
  stdin: process.stdin,
  env,
  isWindows,
  onOsSignal
};
