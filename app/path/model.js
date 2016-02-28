import DS from 'ember-data';

const attr = DS.attr;

export default DS.Model.extend({
  filepath: attr('string'),
});
