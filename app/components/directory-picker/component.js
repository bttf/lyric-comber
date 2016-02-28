import Ember from 'ember';

const dialog = requireNode('electron').remote.dialog;

export default Ember.Component.extend({
  actions: {
    selectDir() {
      dialog.showOpenDialog({
        title: 'Select a directory with music',
        properties: ['openDirectory', 'multiSelections'],
      }, (dirs = []) => {
        dirs.forEach((dir) => {
          this.sendAction('addDir', dir);
        });
      });
    },
  },
});
