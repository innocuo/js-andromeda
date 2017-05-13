var s;
var p_follow;

var scale = 1;
var mouse ={
  x: 0,
  y: 0,
  scaledX: 0,
  scaledY: 0
}
var ref_radius = 10,
stage_x = 500,
stage_2x = stage_x * 2;
var ref;


var clear = function(){

  s.clear();

  var path = SVGPath.clear();
  if(path)
    path.set_random('stroke');

  var r = Math.round(Math.random() * 255),
  g = Math.round(Math.random() * 255),
  b = Math.round(Math.random() * 255);

  ref = s.circle(stage_x, stage_x, ref_radius);
  ref.attr({
    fill:'rgb(' + [r,g,b].join(',') + ')'
  })
}


var change_bg = function(){

  var r = Math.round(Math.random() * 255),
  g = Math.round(Math.random() * 255),
  b = Math.round(Math.random() * 255);

  document.body.style.backgroundColor = 'rgb(' + [r,g,b].join(',') + ')';
}


var init_editor = function(){

  $('#main-svg').off('.draw').on('click.draw', path_click);

  var path = SVGPath.get(s);
  path.clear();
  path.set('cols', 10);
  path.set_random('stroke');

}


var init_tree = function(){

  $('#main-svg').off('.draw').on('click.draw', tree_click);
}

var tree_click = function(e){

  var init_x = mouse.scaledX

  for(var i=0;i<4;i++){
    var cols = 1+Math.round( Math.random() * (4-1));
    var tree = SVGTree.instantiate(s);
    tree.set('cols', cols);
    tree.set_random('fill');
    tree.draw();
    tree.move(init_x, mouse.scaledY);

    init_x += tree.get_width()/scale +5;
  }
}


var path_click = function(){

  var path = SVGPath.get(s);

  path.add(mouse.scaledX, mouse.scaledY);
  path.draw();
}


$(function(){

  $(document).mousemove(function(e) {
      mouse.x = e.pageX;
      mouse.y = e.pageY;
  });

  //snap, to controll all things svg
  s = Snap('#main-svg');
  s.attr({ viewBox: "0 0 "+stage_2x+" "+stage_2x , width:"100%", height:"100%"});

  //place a circle that'll help us
  //find out the stage scale
  ref = s.circle(stage_x, stage_x, ref_radius);
  ref.attr({
    fill:"#2b96b1"
  })

  //this will disappear soon
  //just reference on how to add a line
  /*var p2 = s.polyline(stage_x,stage_x);
  p2.attr({
    fill:"none",
    stroke:"#2b96b1",
    strokeWidth:"1"
  })
  p_follow = s.node.createSVGPoint();
  p_follow.x = stage_x;
  p_follow.y = stage_x;
  p2.node.points.appendItem(p_follow);*/

  init_editor();

  function step(timestamp) {

    var ref_w = $(ref.node).width();
    scale = ref_w/( ref_radius * 2 );

    var page_width_scaled = $(s.node).width() / scale;
    mouse.scaledX = mouse.x/scale - (-stage_x + page_width_scaled/2);

    var page_height_scaled = $(s.node).height() / scale;
    mouse.scaledY = mouse.y/scale - (-stage_x + page_height_scaled/2);

    window.requestAnimationFrame(step);
  }

  KBController.init();
  KBController.register('c', clear);
  KBController.register('b', change_bg);

  KBController.register('e', init_editor);
  KBController.register('t', init_tree);
  KBController.register('s', create_save_link);

  KBController.register('x', SVGPath.clear);
  KBController.register('p', SVGPath.close);
  KBController.register('u', SVGPath.undo);

  window.requestAnimationFrame(step);
});

function create_save_link(){

  var svg = document.getElementById("main-svg");
  var serial = new XMLSerializer();

  var svg_str = serial.serializeToString(svg);

  //add name spaces.
  if(!svg_str.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
      svg_str = svg_str.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if(!svg_str.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
      svg_str = svg_str.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  svg_str = '<?xml version="1.0" standalone="no"?>\r\n' + svg_str;

  var $link = $('<a href="" target="_blank" class="open_link">Open</a>').attr('href', 'data:image/svg+xml;charset=utf-8,'+svg_str);
  $('body').append($link).append('<br>');
}
