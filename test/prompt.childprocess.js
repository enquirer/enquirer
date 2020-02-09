'use strict';

const path = require('path');
const assert = require('assert');
const { fork } = require('child_process');

describe('child_process', function() {
  it('should works in child_process', cb => {
    let cmd = fork(path.resolve(__dirname, './support/child_process.js'), [], {
      silent: true,
    });

    let stdout = '';
    let stderr = '';
    cmd.stdout.on('data', buf => {
      let data = buf.toString();
      stdout += data;
      if (data.includes('color')) cmd.stdin.write('orange\n');
    });

    cmd.stderr.on('data', buf => {
      stderr += buf.toString();
    });

    cmd.on('close', () => {
      assert(!stderr);
      assert(stdout.includes('color: \'orange\''));
      cb();
    });
  });
});
