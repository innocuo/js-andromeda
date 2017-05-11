var Vue = require('vue');

Vue.component('sidebar', {
  template: "<div class=\"sidebar\"><h3>Options</h3><slot>menu</slot></div>"
});
