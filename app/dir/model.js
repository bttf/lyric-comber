import DS from 'ember-data';

const attr = DS.attr;
const hasMany = DS.attr;

export default DS.Model.extend({
  path: attr('string'),
  isLoading: attr('boolean', { defaultValue: true }),
  isLoaded: attr('boolean', { defaultValue: false }),
  files: hasMany(),
});
