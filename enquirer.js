'use strict';

const utils = require('../utils');

module.exports = function(app, questions = [], options = {}) {
  const filter = (file, question, answers) => {
    const names = file.promptNames || [];
    return answers[question.name] == null && names.includes(question.name);
  };

  const opts = Object.assign({ filter }, options);
  const filterFn = opts.filter;
  delete opts.filter;

  return utils.through.obj((file, enc, next) => {
    questions = [].concat(questions);

    if (file.isNull() || questions.length === 0 || file.prompt === false) {
      next(null, file);
      return;
    }

    const data = () => Object.assign({}, file.data, app.answers());

    for (const question of questions) {
      Object.assign(question, opts);
      const onSubmit = question.onSubmit;

      if (file.data && file.data.values) {
        question.values = file.data.values;
      }

      if (!question.when) {
        question.when = answers => {
          delete question.when;
          return filterFn(file, question, answers);
        };
      }

      question.onSubmit = (answer, ...rest) => {
        app.answer(question.name, answer);
        if (onSubmit) {
          app.emit('answer', answer, question);
          return onSubmit(answer, ...rest);
        }
        return answer;
      };
    }

    app.prompts(questions, data)
      .then(() => next(null, file))
      .catch(next);
  });
};
