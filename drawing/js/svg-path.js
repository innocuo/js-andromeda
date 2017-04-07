var SVGPath = (function(){
  var paper;
  var main_path = null;

  var Path = function(){

    var path;
    var properties = {
      stroke: 'rgb(255,255,255)',
      strokeWidth: 2,
      min_h: 10,
      max_h: 50,
      min_r: 20,
      max_r: 40,
      cols: 3
    }

    var add_column = function(w, h, x){

      var r = w/2;

      var path_str = ['V',h,'C',x,',', h-r,',',x+r,',',h-r,',',x+r,',',h-r,'C',x+r,',',h-r,',',x+w,',',h-r,',',x+w,',',h].join('');
      path.node.attributes.d.nodeValue += path_str;
    }

    var end_draw = function(){
      var path_str = 'V0H0';
      path.node.attributes.d.nodeValue += path_str;
    }

    var random_int = function( val ){

      return Math.round(Math.random() * val);
    }

    var lighten = function( val, percent ){

      var new_val = val* (100+percent)/100;
      return (new_val > 255)? 255 : new_val;
    }

    this.draw = function(){

      path = paper.path("M0,0");
      path.attr({
        fill: 'none',
        stroke: properties.stroke,
        strokeWidth: properties.strokeWidth
      });

      var last_pos = 0;
      for(var i=0; i<properties.cols; i++){
        var w = properties.min_r + (Math.random() * (properties.max_r-properties.min_r) );
        var h = -1 * ( properties.min_h + Math.random() * (properties.max_h-properties.min_h) );

        w = Math.round(w);
        h = Math.round(h);
        add_column(w, h, last_pos);
        last_pos += w;
      }

      end_draw();
    }

    this.set = function(key, value){

      properties[key] = value;
    }

    this.send_to_back = function(){
      path.prependTo(paper);
    }

    this.set_random = function(key){
      switch(key){
        case 'fill':
          var r = random_int(255),
              g = random_int(255),
              b = random_int(255);

          properties['stroke'] = 'rgb('+[r,g,b].join(',')+')';

        break;
      }
    }

    this.add = function(x, y){
      path.transform( 't' + [x,y].join(',') );
    }

    this.get_width = function(){
      return path.node.getBoundingClientRect().width;
    }

    return this;
  }

  return {
    get: function(qpaper){
      if(!main_path){
        paper = qpaper;
        main_path = new Path();
      }
      return main_path;
    }
  };
})();
