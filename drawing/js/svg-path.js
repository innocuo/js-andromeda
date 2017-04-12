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
      init_y:0,
      radius:10
    }

    var points = [];

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

    this.draw_horizontal = function( x ){

      var prev_point = points[points.length-1];
      var dif = x-prev_point.x;

      var path_str = 'H'+x;
      path.node.attributes.d.nodeValue += path_str;

      points.push({ 'x': x, 'y': prev_point.y, dir: 'H', dif: dif });
    }

    this.draw_vertical = function( y ){

      var prev_point = points[points.length-1];
      var dif = y-prev_point.y;

      var path_str = 'V'+y;
      path.node.attributes.d.nodeValue += path_str;

      points.push({ 'x': points[points.length-1].x, 'y': y, dir: 'V', dif: dif });
    }

    this.turn_to_vertical = function( prev_point, dif_y, radius ){

      var dir_x = (prev_point.dif>0)? 1:-1;
      var dir_y = (dif_y - prev_point.y >0)? 1:-1;
      var path_str = 'C'+[prev_point.x, prev_point.y, (prev_point.x+(radius*dir_x) ), (prev_point.y), (prev_point.x+(radius*dir_x) ), (prev_point.y+(radius*dir_y))].join(',');
      path.node.attributes.d.nodeValue += path_str;

      points.push({ 'x': (prev_point.x+(radius*dir_x) ), 'y': (prev_point.y+(radius*dir_y)), dir: 'V', dif: dir_y });

    }

    this.turn_to_horizontal = function( prev_point, dif_x, radius){

      var dir_x = (dif_x - prev_point.x >0)? 1:-1;
      var dir_y = (prev_point.dif>0)? 1:-1;
      var path_str = 'C'+[prev_point.x, prev_point.y, (prev_point.x ), (prev_point.y+(radius*dir_y)), (prev_point.x+(radius*dir_x) ), (prev_point.y+(radius*dir_y))].join(',');
      path.node.attributes.d.nodeValue += path_str;

      points.push({ 'x': (prev_point.x+(radius*dir_x) ), 'y': (prev_point.y+(radius*dir_y)), dir: 'H', dif: dir_x });

    }

    this.add = function(x, y){

      if( !path ){
        path = paper.path("M0,0");

        properties.init_x = Math.round( x );
        properties.init_y = Math.round( y );

        path.transform( 't' + [properties.init_x, properties.init_y].join(',') );
        points.push({x: 0, y: 0, dir: null });
      }else{
        var new_x = Math.round( x ) - properties.init_x,
            new_y = Math.round( y ) - properties.init_y;

        var prev_point = points[points.length-1];
        var dif_x = Math.abs( new_x - prev_point.x ),
            dif_y = Math.abs( new_y - prev_point.y );

        var path_str;

        if( dif_x > dif_y ){
          console.log('draw horizontal',prev_point,new_x)

          if(prev_point.dir == 'V'){
            this.turn_to_horizontal(prev_point, new_x, properties.radius);
          }else{
            //if it was going right, but now want to draw left
            if(
              prev_point.dif > 0 && new_x - prev_point.x < 0 ||
              prev_point.dif < 0 && new_x - prev_point.x > 0
            ){
              this.turn_to_vertical(prev_point, new_y, properties.radius);
              this.turn_to_horizontal(points[points.length-1], new_x, properties.radius);
            }
          }
          this.draw_horizontal( new_x);
        }else{
          console.log('draw vertical')
          if(prev_point.dir == 'H'){
            this.turn_to_vertical(prev_point, new_y, properties.radius);
          }else{
            //if it was going up, but now want to draw down
            if(
              prev_point.dif > 0 && new_y - prev_point.y < 0 ||
              prev_point.dif < 0 && new_y - prev_point.y > 0
            ){
              this.turn_to_horizontal(prev_point, new_x, properties.radius);
              this.turn_to_vertical(points[points.length-1], new_y, properties.radius);
            }
          }
          this.draw_vertical( new_y );
        }

        /*
        var path_str = 'L'+[x - properties.init_x, y - properties.init_y].join(' ');
        path.node.attributes.d.nodeValue += path_str;
        */
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
