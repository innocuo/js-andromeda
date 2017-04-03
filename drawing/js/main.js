var s;
var p_follow;
var mouse ={
  x: 0,
  y: 0,
  scaledX: 0,
  scaledY: 0
}


$(function(){

  var ref_radius = 10,
  stage_x = 500,
  stage_2x = stage_x * 2;

  $(document).mousemove(function(e) {
      mouse.x = e.pageX;
      mouse.y = e.pageY;
  }).mouseover();

  //snap, to controll all things svg
  s = Snap('#main-svg');
  s.attr({ viewBox: "0 0 "+stage_2x+" "+stage_2x , width:"100%", height:"100%"});

  //place a circle that'll help us
  //find out the stage scale
  var ref = s.circle(stage_x, stage_x, ref_radius);
  ref.attr({
    fill:"#2b96b1"
  })

  //this will disappear soon
  //just reference on how to add a line
  var p2 = s.polyline(stage_x,stage_x);
  p2.attr({
    fill:"none",
    stroke:"#2b96b1",
    strokeWidth:"1"
  })
  p_follow = s.node.createSVGPoint();
  p_follow.x = stage_x;
  p_follow.y = stage_x;
  p2.node.points.appendItem(p_follow);

  $('#main-svg').on('click', function(e){
    console.log(s);
    var circle = s.circle(mouse.scaledX, mouse.scaledY,2);
    circle.attr({
      fill:"#2b96b1"
    });
//var stree=new Tree();
var tree = SVGTree.instantiate(s);
tree.set_random('fill');
tree.draw();
tree.move(mouse.scaledX, mouse.scaledY);
    //createPlant();
  });

  function step(timestamp) {

    var ref_w = $(ref.node).width();
    var scale = ref_w/( ref_radius * 2 );

    var page_width_scaled = $(s.node).width() / scale;
    mouse.scaledX = mouse.x/scale - (-stage_x + page_width_scaled/2);

    var page_height_scaled = $(s.node).height() / scale;
    mouse.scaledY = mouse.y/scale - (-stage_x + page_height_scaled/2);

    window.requestAnimationFrame(step);
  }

  window.requestAnimationFrame(step);
});
