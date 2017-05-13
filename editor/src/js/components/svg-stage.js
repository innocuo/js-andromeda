var Vue = require('vue');
import SVGPath from '../andromeda/svg-path';
const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

Vue.component('svg-stage', {
  template: "<div class='svg-container'><svg id='main-svg' version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"></svg></div>",
  data: function(){
    const stage_x = 500;

    return {
      s:null,
      p_follow : null,
      scale : 1,
      mouse : {
        x: 0,
        y: 0,
        scaledX: 0,
        scaledY: 0
      },
      ref_radius : 10,
      stage_x : stage_x,
      stage_2x : stage_x * 2,
      ref: null
    }
  },
  mounted: function(){
    this.s = Snap('#main-svg');
    this.s.attr({ viewBox: "0 0 "+this.stage_2x+" "+this.stage_2x , width:"100%", height:"100%"});

    //place a circle that'll help us
    //find out the stage scale
    this.ref = this.s.circle(this.stage_x, this.stage_x, this.ref_radius);
    this.ref.attr({
      fill:"#2b96b1"
    })
  }
});
