import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('direct-lyric-search', 'Integration | Component | direct lyric search', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{direct-lyric-search}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#direct-lyric-search}}
      template block text
    {{/direct-lyric-search}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
