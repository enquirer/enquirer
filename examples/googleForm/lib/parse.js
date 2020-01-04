const cheerio = require('cheerio');

const parseQuestion = (questionSelectors) => {
    const questions = [];
    questionSelectors.each((index, question) => {
        questions.push(question.children[0].data);
    })
    return questions;
}

const parse = (htmlString) => {
    let html = cheerio.load(htmlString);
    let questionSelectors = html(".freebirdFormviewerViewItemsItemItemTitle");
    if(!questionSelectors.length)
    {
        return [];
    }
    else
    {
        return parseQuestion(questionSelectors);
    }
}

module.exports = parse;