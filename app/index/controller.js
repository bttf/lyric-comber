import Ember from 'ember';

const fuzzy = requireNode('fuzzy');

export default Ember.Controller.extend({
  query: '',

  loadedDirs: Ember.computed.filterBy('dirs', 'isLoaded'),

  allFiles: Ember.computed('loadedDirs.@each', function() {
    console.log('allFiles run');
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
});
