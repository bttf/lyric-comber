import Ember from 'ember';
import { walk } from './walk';
import { readTags } from './id3';

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

  searchResults: Ember.computed('query', 'allFiles', function() {
    if (!Ember.isEmpty(this.get('query'))) {
      const results = fuzzy.filter(this.get('query'),
                                   this.get('allFiles'),
                                   { extract: (file) => `${file.artist} ${file.title} ${file.album} ${file.year} ${file.filename}` });
      return results.map((result) => result.original);
    }
  }),

  actions: {
    addDir(dir) {
      const newDir = Ember.Object.create({
        path: dir,
        isLoading: true,
        files: Ember.A([]),
      });

      walk(dir, (err, filepaths) => {
        filepaths.forEach((filepath) => {
          readTags(filepath, (err, tags) => {
            const file = Ember.Object.create({
              artist: tags.artist,
              title: tags.title,
              album: tags.album,
              year: tags.year,
              absolutePath: filepath,
              filename: path.basename(filepath),
            });
            newDir.get('files').addObject(file);
          });
        });
        newDir.set('isLoading', false);
        newDir.set('isLoaded', true);
      });

      this.get('dirs').unshiftObject(newDir);
    },

    download(file) {
      lyrics.getSong(file.artist, file.title, function(song) {
        console.log('what is song', song);
      });
    },
  },
});
