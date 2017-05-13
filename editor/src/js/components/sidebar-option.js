var Vue = require('vue');

Vue.component('sidebar-option', {
  props: ['label','option','initial'],
  template: "<div><label class=\"sidebar-option-label\" v-bind:for=\"option\">{{label}}</label><input type='text' v-bind:id='option' v-bind:value='initial'/></div>"
});
