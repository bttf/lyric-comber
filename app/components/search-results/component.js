import Ember from 'ember';

const limit = 50;

export default Ember.Component.extend({
  limit,

  list: Ember.computed('limit', 'results', function() {
    const results = this.get('results') || [];
    return results.slice(0, this.get('limit'));
  }),

  remainingLength: Ember.computed('limit', 'results', function() {
    return Math.max(this.get('results.length') - this.get('limit'), 0);
  }),

  resetLimitOnResults: Ember.observer('results', function() {
    this.set('limit', limit);
  }),

  actions: {
    increaseLimit() {
      this.set('limit', this.get('limit') + limit);
    },
    getLyrics(file) {
      this.sendAction('getLyrics', file);
    },
  },
});
