var s;
var p_follow;
var mouse ={
  x: 0,
  y: 0,
  scaledX: 0,
  scaledY: 0
}


function createPlant(){
  //var p = s.path("M0,0L"+Math.round(mouse.scaledX)+","+Math.round(mouse.scaledY));
  var p = s.path("M0,0V-50C0,-75,25,-75,25,-75C25,-75,50,-75,50,-50");
  p.attr({
    fill: ["rgb(", Math.round(Math.random()*255),',',Math.round(Math.random()*255),',',Math.round(Math.random()*255), ")"].join(''),
    stroke: '#fb0090',
    'strokeWidth': 2
  });
  var t2 = 'V-100C50,-100,50,-200,150,-200C150,-200,250,-200,250,-100';
  t2+= 'V0H0';
  //p.node.attributes.d+="H100"
  console.log(p.node.attributes.d.nodeValue+=t2)

  p.transform(['t',mouse.scaledX,',',mouse.scaledY].join(''));
  //send to back
  p.prependTo(s);
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
    var circle = s.circle(mouse.scaledX, mouse.scaledY,2);
    circle.attr({
      fill:"#2b96b1"
    });

    createPlant();
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
