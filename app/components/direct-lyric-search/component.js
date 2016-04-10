import Ember from 'ember';

export default Ember.Component.extend({
  areLyricsLoading: false,

  actions: {
    search(artist, title) {
      this.set('areLyricsLoading', true);

      this.sendAction('searchLyrics', artist, title, (err, lyrics) => {
        this.set('areLyricsLoading', false);
        if (err) { console.log(err); }
        else {
          this.sendAction('setLyrics', lyrics, artist, title);
        }
      });
    },
  },
});
