var Vue = require('vue');

Vue.component('sidebar', {
  template: "<div class=\"sidebar\"><slot>menu</slot></div>"
});
