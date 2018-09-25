new autoComplete({
  minChars: 2,
  source: function (term, suggest) {
    term = term.toLowerCase();
    var choices = ['ActionScript', 'AppleScript', 'Asp', ...];
    var matches = [];
    for (i = 0; i < choices.length; i++) {
      if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
    }
    suggest(matches);
  }
});
