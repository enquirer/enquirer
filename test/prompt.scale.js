'use strict';

const assert = require('assert');
const Scale = require('../lib/prompts/scale')

class Prompt extends Scale {
    constructor(options) {
        super({ ...options, show: false });
    }
}

describe('scale', () => {
    describe('options.choices', () => {
        it('should use scale index for initial value in choices', () => {
            const prompt = new Prompt({
                message: 'foo',
                scale: [
                    { name: '1', message: 'Choice 1' },
                    { name: '2', message: 'Choice 2' },
                    { name: '3', message: 'Choice 3' },
                ],
                choices: [
                    { message: 'Question 1', initial: 0 },
                    { message: 'Question 2', initial: 1 },
                    { message: 'Question 3', initial: 2 },
                ]
            });
            prompt.once('run', () => {
                assert.equal(prompt.choices[0].scaleIndex, 0);
                assert.equal(prompt.choices[1].scaleIndex, 1);
                assert.equal(prompt.choices[2].scaleIndex, 2);
            });
            prompt.run();
        });
        it('should use default scale index for choices when initial value not defined', () => {
            const defaultScaleIndex = 2;
            const prompt = new Prompt({
                message: 'foo',
                scale: [
                    { name: '1', message: 'Choice 1' },
                    { name: '2', message: 'Choice 2' },
                    { name: '3', message: 'Choice 3' },
                ],
                choices: [
                    { message: 'Question 1' },
                    { message: 'Question 2' },
                    { message: 'Question 3' },
                ]
            });
            prompt.once('run', () => {
                assert.equal(prompt.choices[0].scaleIndex, defaultScaleIndex);
                assert.equal(prompt.choices[1].scaleIndex, defaultScaleIndex);
                assert.equal(prompt.choices[2].scaleIndex, defaultScaleIndex);
            });
            prompt.run();
        });
    });
});