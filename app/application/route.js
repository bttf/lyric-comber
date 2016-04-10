import Ember from 'ember';
import { walk } from './walk';
import { readTags } from './id3';
import { scrapeLyrics } from './scraper';

const path = requireNode('path');

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      dirs: this.store.find('dir'),
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  },

  actions: {
    addDir(dir) {
      const fileReads = Ember.A([]);

      const newDir = this.store.createRecord('dir', {
        path: dir,
        isLoading: true,
        files: Ember.A([]),
      });

      walk(dir, (err, filepaths) => {
        filepaths.forEach((filepath) => {
          fileReads.pushObject(new Ember.RSVP.Promise((resolve, reject) => {
            readTags(filepath, (err, tags) => {
              if (err) { reject(err); }
              const file = Ember.Object.create({
                artist: tags.artist || '',
                title: tags.title || '',
                album: tags.album || '',
                year: tags.year || '',
                absolutePath: filepath,
                filename: path.basename(filepath),
              });
              newDir.get('files').addObject(file);
              resolve();
            });
          }));
        });

        Ember.RSVP.all(fileReads).then(() => {
          newDir.set('isLoading', false);
          newDir.set('isLoaded', true);
          newDir.save();
          console.log('newDir saved');
        });
      });
    },

    searchLyrics(artist, title, cb) {
      artist = artist.replace(/\s/g, '_');
      title = title.replace(/\s/g, '_');
      scrapeLyrics(artist, title, (err, lyrics) => {
        if (err) { cb(err); }
        cb(null, lyrics);
      });
    },

    setLyrics(lyrics, artist, title) {
      console.log('debug, setLyrics', artist, title);
      this.controller.set('lyricsArtist', artist);
      this.controller.set('lyricsTitle', title);
      this.controller.set('lyrics', lyrics);
    },

    getLyrics(file) {
      const artist = file.artist;
      const title = file.title || file.filename;
      this.set('searchArtist', artist);
      this.set('searchTitle', title);
      this.send('searchLyrics', artist, title, (err, lyrics) => {
        this.send('setLyrics', lyrics, artist, title);
      });
    },
  },
});
