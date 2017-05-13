var Vue = require('vue');
import SVGPath from '../andromeda/svg-path';
const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

Vue.component('svg-stage', {
  template: "<div class='svg-container'><svg id='main-svg' v-on:click=\"click\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"></svg></div>",
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
  created: function(){
    window.addEventListener('mousemove',this.move);
  },
  mounted: function(){
    this.s = Snap('#main-svg');
    this.s.attr({ viewBox: "0 0 "+this.stage_2x+" "+this.stage_2x , width:"100%", height:"100%"});

    //place a circle that'll help us
    //find out the stage scale
    this.ref = this.s.circle(this.stage_x, this.stage_x, this.ref_radius);
    this.ref.attr({
      fill:"#2b96b1"
    });

    window.requestAnimationFrame(this.step);
  },
  methods:{
    step: function (timestamp) {

      var ref_w = this.ref.node.getBoundingClientRect().width;
      this.scale = ref_w/( this.ref_radius * 2 );

      const s_bbox = this.s.node.getBoundingClientRect();
      var page_width_scaled = s_bbox.width / this.scale;
      this.mouse.scaledX = this.mouse.x/this.scale - (-this.stage_x + page_width_scaled/2);

      var page_height_scaled = s_bbox.height / this.scale;
      this.mouse.scaledY = this.mouse.y/this.scale - (-this.stage_x + page_height_scaled/2);

      window.requestAnimationFrame(this.step);
    },
    move: function(e){
      this.mouse.x = e.pageX;
      this.mouse.y = e.pageY;
    },
    click: function(e){

        var path = SVGPath.get(this.s);

        path.add(this.mouse.scaledX, this.mouse.scaledY);
        path.draw();

    }
  }
});
