import Vue from 'vue'
import Vuex from 'vuex'

Vue.use( Vuex )

const store  = new Vuex.Store({
    state:{
      count : 0,
      lineColor: 'rgb(100,200,200)',
      lineRadius: 1,
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
