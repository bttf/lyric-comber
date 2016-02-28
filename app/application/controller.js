import Ember from 'ember';

const dialog = requireNode('electron').remote.dialog;

export default Ember.Controller.extend({
  actions: {
    test() {
      dialog.showOpenDialog({
        properties: ['openDirectory'],
      });
    },
  },
});
