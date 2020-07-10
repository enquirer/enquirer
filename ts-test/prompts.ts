import 'mocha'
import assert from 'assert'
import { prompts, types } from '..'

describe('prompts', function () {
  it('should export prompts', () => {
    assert.equal(typeof prompts.AutoComplete, 'function');
    assert.equal(typeof prompts.Confirm, 'function');
    assert.equal(typeof prompts.Input, 'function');
    assert.equal(typeof prompts.Invisible, 'function');
    assert.equal(typeof prompts.List, 'function');
    assert.equal(typeof prompts.MultiSelect, 'function');
    assert.equal(typeof prompts.Numeral, 'function');
    assert.equal(typeof prompts.Password, 'function');
    assert.equal(typeof prompts.Select, 'function');
    assert.equal(typeof prompts.Text, 'function');
  });

  it('should export types', () => {
    assert.equal(typeof types.ArrayPrompt, 'function');
    assert.equal(typeof types.BooleanPrompt, 'function');
    assert.equal(typeof types.NumberPrompt, 'function');
    assert.equal(typeof types.StringPrompt, 'function');
  });
});
