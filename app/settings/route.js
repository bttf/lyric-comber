import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('application');
  },
  setupController(controller, model) {
    controller.setProperties(model);
  },
});
