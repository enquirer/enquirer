const choice = require('./choice');

const create = module.exports = (choices = [], parent) => {
  if (!Array.isArray(choices)) {
    choices = toArray(choices);
  }

  return choices.filter(Boolean).map((ele, i) => {
    ele = choice(ele, i, parent);

    if (ele.choices) {
      ele.choices = create(ele.choices, ele);
    }
    return ele;
  });
};

function toArray(obj) {
  let choices = [];
  for (let name of Object.keys(obj)) {
    let ele = obj[name];
    if (typeof ele === 'string') ele = { message: ele };
    choices.push({ name, ...ele });
  }
  return choices;
}
