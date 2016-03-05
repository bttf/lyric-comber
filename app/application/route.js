import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      dirs: this.store.find('dir'),
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  },
});
