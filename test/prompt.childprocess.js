import path from 'path';
import { dirname } from 'path';
import * as assert from 'assert';
import { fileURLToPath } from 'url';
import { fork } from 'child_process';

describe('child_process', function() {
  it('should work in child_process', cb => {
    const filePath = fileURLToPath(import.meta.url);
    let cmd = fork(
      path.resolve(dirname(filePath), './support/child_process.js'),
      [],
      { silent: true, env: { NODE_NO_WARNINGS: 1 } } // TODO: remove NODE_NO_WARNING when NodeJS 12 is ditched
    );

    let stdout = '';
    let stderr = '';
    cmd.stdout.on('data', buf => {
      let data = buf.toString();
      stdout += data;
      if (data.includes('color')) {
        cmd.stdin.write('orange\n');
      }
    });

    cmd.stderr.on('data', buf => {
      stderr += buf.toString();
    });

    cmd.on('close', () => {
      assert.strictEqual(stderr, '');
      assert.ok(stdout.includes('color: \'orange\''));
      cb();
    });
  });
});
