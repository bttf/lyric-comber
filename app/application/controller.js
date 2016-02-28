import Ember from 'ember';
import { walk } from './walk';

const path = requireNode('path');
const fuzzy = requireNode('fuzzy');

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
                                   { extract: (file) => file.filename });
      console.log('searchresults', results);
      return results.map((result) => result.original);
    }
  }),

  actions: {
    addDir(dir) {
      console.log('adding dir', dir);

      const newDir = Ember.Object.create({
        path: dir,
        isLoading: true,
        files: Ember.A([]),
      });

      walk(dir, (err, filepaths) => {
        filepaths.forEach((filepath) => {
          const file = Ember.Object.create({
            absolutePath: filepath,
            filename: path.basename(filepath),
          });
          newDir.get('files').addObject(file);
        });
        newDir.set('isLoading', false);
        newDir.set('isLoaded', true);
      });

      this.get('dirs').unshiftObject(newDir);
    },
  },
});
