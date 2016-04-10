import Ember from 'ember';

const shell = requireNode('electron').shell;

export default Ember.Component.extend({
  actions: {
    openGitHub() {
      shell.openExternal('https://github.com/bttf/lyric-comber/issues');
    },
    openTwitter() {
      shell.openExternal('https://twitter.com/_adnanchowdhury');
    },
  }
});
