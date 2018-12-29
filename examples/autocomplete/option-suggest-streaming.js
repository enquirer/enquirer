'use strict';

const Events = require('events');
const { prompt } = require('enquirer');

(async() => {
  const client = createSearchClient();

  const answers = await prompt({
    type: 'autocomplete',
    name: 'flavor',
    message: 'Pick your favorite flavor',
    limit: 10,
    suggest(typed, choices) {
      // get a stream of choices back that match our results
      const stream = client.search(typed);
      this.once('submit', () => stream.cancel());

      // when a choice is found, we cache that result on the `list` to be used later
      const list = [];
      stream.on('data', async(choice) => {
        list.push(choice);

        // convert all of the currently found choices from the list into choice items that
        // can be added to the autocomplete's choices array
        let items = await Promise.all(await this.toChoices(list));
        for (let item of items) {
          if (!this.find(item.name)) {
            this.choices.push(item);
          }
        }

        // we need to re-render the prompt each time a new choice is found so the user will see the update
        await this.render();
      });

      // since the results are handled in the `data` event handler above, just return an empty array
      return [];
    },
    choices: []
  });

  console.log(answers);

})().catch(console.log);

function createSearchClient() {
  /**
   * Imagine this class does a search against an external api that returns a stream
   * of results. The results are used in the aotocomplete suggest function below.
   */

  class SearchApi {
    constructor(options = {}) {
      this.options = options;
    }

    search(filter) {
      let events = new Events();
      let i = 0;
      if (this.interval) this.stop();
      this.interval = setInterval(() => {
        let choice = this.options.choices[i++];
        if (choice && choice.includes(filter)) {
          events.emit('data', choice);
        }
      }, this.options.interval);

      this.timeout = setTimeout(() => {
        clearInterval(this.interval);
        this.interval = null;
        events.emit('end');
      }, this.options.timeout);

      events.cancel = this.stop.bind(this);
      return events;
    }

    stop() {
      clearInterval(this.interval);
      this.interval = null;
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  return new SearchApi({
    interval: 120,
    timeout: 3000,
    choices: [
      'almond',
      'apple',
      'banana',
      'cherry',
      'chocolate',
      'cinnamon',
      'coconut',
      'cotton candy',
      'grape',
      'nougat',
      'orange',
      'pear',
      'pineapple',
      'strawberry',
      'vanilla',
      'watermelon',
      'wintergreen'
    ]
  });
}
