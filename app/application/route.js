import Ember from 'ember';

const paths = Ember.A([]);

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      paths,
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  },
});
