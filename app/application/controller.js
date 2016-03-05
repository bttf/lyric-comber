import Ember from 'ember';
import { walk } from './walk';
import { readTags } from './id3';
import { scrapeLyrics } from './scraper';

const path = requireNode('path');
const fuzzy = requireNode('fuzzy');
const lyrics = requireNode('node-lyrics');

export default Ember.Controller.extend({
  query: '',

  loadedDirs: Ember.computed.filterBy('dirs', 'isLoaded'),

  allFiles: Ember.computed('loadedDirs', function() {
    let files = Ember.A([]);
    this.get('loadedDirs').forEach((dir) => {
      files = files.concat(dir.get('files'));
    });
    return files;
  }),

  filesWithLyrics: [],

  searchResults: Ember.computed('query', 'allFiles', function() {
    const results = fuzzy.filter(this.get('query'),
                                 this.get('allFiles'),
    { extract: (file) => `${file.artist} ${file.title} ${file.album} ${file.year} ${file.filename}` });
    return results.map((result) => result.original);
  }),

  actions: {
    addDir(dir) {
      const fileReads = Ember.A([]);

      const newDir = Ember.Object.create({
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
                artist: tags.artist,
                title: tags.title,
                album: tags.album,
                year: tags.year,
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
        });
      });

      this.get('dirs').unshiftObject(newDir);
    },

    download(file) {
      this.send('searchLyrics', file.artist, file.title, (err, lyrics) => {
        if (err) { file.error = err; }
        else { file.lyrics = lyrics; }
        this.get('filesWithLyrics').addObject(file);
      });
    },

    searchLyrics(artist, title, cb) {
      artist = artist.replace(/\s/g, '_');
      title = title.replace(/\s/g, '_');
      scrapeLyrics(artist, title, (err, lyrics) => {
        if (err) { cb(err); }
        cb(null, lyrics)
      });
    },

    setLyrics(lyrics) {
      console.log('setting lyrics');
      this.set('lyrics', lyrics);
    },
  },
});
