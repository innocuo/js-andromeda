import Vue from 'vue'

import 'components/sidebar'
import 'components/sidebar-option'
import 'components/svg-stage'
import 'components/layers'
import store from 'store'



var app = new Vue({
  el: "#app1",
  data: {
    //msg: "editor"
  },
  store,
  computed:{
    msg(){
      return this.$store.state.count
    }
  }
});
