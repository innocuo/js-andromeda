import Vue from 'vue'
import Vuex from 'vuex'

Vue.use( Vuex )

const store  = new Vuex.Store({
    state:{
      count : 0,
      lineColor: 'rgb(150,43,40)',
      fillColor: 'none',
      lineRadius: 6,
    },
    mutations: {
      increment (state){
        state.count++
      },
      update (state, payload){
        state[payload.name] = payload.val
      }
    }
})

export default store;
