import Ember from 'ember';

const limit = 50;

export default Ember.Component.extend({
  limit,
  listLength: limit,

  list: Ember.computed('listLength', 'results', function() {
    const results = this.get('results') || [];
    return results.slice(0, this.get('listLength'));
  }),

  remainingLength: Ember.computed('listLength', 'results', function() {
    return Math.max(this.get('results.length') - this.get('listLength'), 0);
  }),

  resetLimitOnResults: Ember.observer('results', function() {
    this.set('listLength', limit);
  }),

  actions: {
    increaseLimit() {
      this.set('listLength', this.get('listLength') + this.get('limit'));
    },
    getLyrics(file) {
      this.sendAction('getLyrics', file);
    },
  },
});
