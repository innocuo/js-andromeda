var Vue = require('vue')
import {mapState} from 'vuex'

Vue.component('sidebar-option', {
  props: ['label','option'],
  template: "<div><label class=\"sidebar-option-label\" v-bind:for=\"option\">{{label}}</label><input type='text' v-bind:id='option' v-bind:value='fromStore' v-on:change='change'/></div>",
  methods:{
    change(e){
      console.log(this.option)
      this.$store.commit('update',{
        name: this.option,
        val: e.currentTarget.value
      });
    }
  },
  computed: {
    fromStore(){
      console.log(this.$store.state)
      return this.$store.state[this.option]
    },
    ...mapState([
      'count','lineColor','lineRadius'
    ])
  },
});
