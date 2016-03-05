import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    search(artist, title) {
      this.sendAction('searchLyrics', artist, title, (err, lyrics) => {
        if (err) { console.log(err); }
        else {
          this.sendAction('setLyrics', lyrics);
        }
      });
    },
  },
});
