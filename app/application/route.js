import Ember from 'ember';

const dirs = Ember.A([]);

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      dirs,
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  },
});
