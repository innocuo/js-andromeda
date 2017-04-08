var SVGPath = (function(){
  var paper;
  var main_path = null;

  var Path = function(){

    var path = null;

    var properties = {
      stroke: 'rgb(255,255,255)',
      strokeWidth: 2,
      min_h: 10,
      max_h: 50,
      min_r: 20,
      max_r: 40,
      cols: 3,
      init_x:0,
      init_y:0
    }

    var add_column = function(w, h, x){

      var r = w/2;

      var path_str = ['V',h,'C',x,',', h-r,',',x+r,',',h-r,',',x+r,',',h-r,'C',x+r,',',h-r,',',x+w,',',h-r,',',x+w,',',h].join('');
      path.node.attributes.d.nodeValue += path_str;
    }

    this.end_draw = function(){
      var path_str = 'L 0 0';
      path.node.attributes.d.nodeValue += path_str;
      this.clear();
    }

    var random_int = function( val ){

      return Math.round(Math.random() * val);
    }

    var lighten = function( val, percent ){

      var new_val = val* (100+percent)/100;
      return (new_val > 255)? 255 : new_val;
    }

    this.draw = function(){

      //path = paper.path("M0,0");
      path.attr({
        fill: 'none',
        stroke: properties.stroke,
        strokeWidth: properties.strokeWidth
      });

      //var last_pos = 0;
      //for(var i=0; i<properties.cols; i++){
      //  var w = properties.min_r + (Math.random() * (properties.max_r-properties.min_r) );
      //  var h = -1 * ( properties.min_h + Math.random() * (properties.max_h-properties.min_h) );

      //   w = Math.round(w);
      //   h = Math.round(h);
      //   add_column(w, h, last_pos);
      //   last_pos += w;
      // }

      //end_draw();
    }

    this.set = function(key, value){

      properties[key] = value;
    }

    this.send_to_back = function(){
      path.prependTo(paper);
    }

    this.set_random = function(key){
      switch(key){
        case 'stroke':
          var r = random_int(255),
              g = random_int(255),
              b = random_int(255);

          properties['stroke'] = 'rgb('+[r,g,b].join(',')+')';

        break;
      }
    }

    this.add = function(x, y){
      if( !path ){
        path = paper.path("M0,0");
        path.transform( 't' + [x,y].join(',') );
        properties.init_x = x;
        properties.init_y = y;
      }else{
        console.log(path.node.attributes.d.nodeValue)
        var path_str = 'L'+[x - properties.init_x, y - properties.init_y].join(' ');
        path.node.attributes.d.nodeValue += path_str;
      }
    }

    this.get_width = function(){
      return path.node.getBoundingClientRect().width;
    }

    this.clear = function(){
      path = null;
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
    },
    clear: function(){
      if (main_path){
        main_path.clear();
        return main_path;
      }
      return null;
    },
    close: function(){
      if (main_path){
        main_path.end_draw();
        return main_path;
      }
    }
  };
})();
