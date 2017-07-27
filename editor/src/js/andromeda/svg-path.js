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
      radius:10,
      fill: 'none'
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
        fill: properties.fill,
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

    this.redraw = function(){
      if( !path ) return ;

      path.node.attributes.d.nodeValue = '';
      var new_path = [];
      $.each(points, function( idx, val){
        new_path.push(val.str);
      });
      path.node.attributes.d.nodeValue = new_path.join('');

    }

    this.draw_horizontal = function( x ){

      var prev_point = points[points.length-1];
      var dif = x-prev_point.x;



      if( prev_point.dir == 'H'){

        prev_point.str = 'H' + x;
        prev_point.dif = x - (prev_point.x-prev_point.dif );
        prev_point.x = x;

        var old_value = path.node.attributes.d.nodeValue

        var index_of_dir = old_value.lastIndexOf('H');
        path.node.attributes.d.nodeValue = old_value.substring( 0, index_of_dir ) + prev_point.str;
      }else{
        var path_str = 'H'+x;
        points.push({ 'x': x, 'y': prev_point.y, dir: 'H', dif: dif, str: path_str });
        path.node.attributes.d.nodeValue += path_str;

      }
    }

    this.draw_vertical = function( y ){

      var prev_point = points[points.length-1];
      var dif = y-prev_point.y;

      if( prev_point.dir == 'V'){

        prev_point.str = 'V' + y;
        prev_point.dif = y - (prev_point.y-prev_point.dif );
        prev_point.y = y;
        //TODO: does dif need to be adjusted?

        var old_value = path.node.attributes.d.nodeValue

        var index_of_dir = old_value.lastIndexOf('V');
        path.node.attributes.d.nodeValue = old_value.substring( 0, index_of_dir ) + prev_point.str;
      }else{
        var path_str = 'V'+y;
        points.push({ 'x': prev_point.x, 'y': y, dir: 'V', dif: dif, str: path_str });
        path.node.attributes.d.nodeValue += path_str;

      }
    }

    this.turn_to_vertical = function( prev_point, dif_y, radius ){

      var dir_x = (prev_point.dif>0)? 1:-1;
      var dir_y = (dif_y - prev_point.y >0)? 1:-1;
      var path_str = 'C'+[prev_point.x, prev_point.y, (prev_point.x+(radius*dir_x) ), (prev_point.y), (prev_point.x+(radius*dir_x) ), (prev_point.y+(radius*dir_y))].join(',');
      path.node.attributes.d.nodeValue += path_str;

      points.push({ 'x': (prev_point.x+(radius*dir_x) ), 'y': (prev_point.y+(radius*dir_y)), dir: 'CV', dif: (dif_y - prev_point.y), str: path_str });

    }

    this.turn_to_horizontal = function( prev_point, dif_x, radius){

      var dir_x = (dif_x - prev_point.x >0)? 1:-1;
      var dir_y = (prev_point.dif>0)? 1:-1;
      var path_str = 'C'+[prev_point.x, prev_point.y, (prev_point.x ), (prev_point.y+(radius*dir_y)), (prev_point.x+(radius*dir_x) ), (prev_point.y+(radius*dir_y))].join(',');
      path.node.attributes.d.nodeValue += path_str;

      points.push({ 'x': (prev_point.x+(radius*dir_x) ), 'y': (prev_point.y+(radius*dir_y)), dir: 'CH', dif: (dif_x - prev_point.x), str: path_str });

    }

    this.relative_add = function(x, y){

      var next_y,next_x;

      if( !path || points.length == 0 ){
        next_x = properties.center.x;
        next_y = properties.center.y;
      }else{
        var prev_point = points[points.length-1];
        next_x = properties.init_x+prev_point.x + x;
        next_y = properties.init_y+prev_point.y + y;
      }
      this.add(next_x, next_y);
    }

    this.add = function(x, y){

      var path_str;
      if( !path || points.length == 0 ){
        path_str = "M0,0"
        path = paper.path( path_str );

        properties.init_x = Math.round( x );
        properties.init_y = Math.round( y );

        path.transform( 't' + [properties.init_x, properties.init_y].join(',') );
        points.push({x: 0, y: 0, dir: null, str: path_str });
      }else{
        var new_x = Math.round( x ) - properties.init_x,
            new_y = Math.round( y ) - properties.init_y;

        var prev_point = points[points.length-1];
        var dif_x = Math.abs( new_x - prev_point.x ),
            dif_y = Math.abs( new_y - prev_point.y );

        var recheck_prev = false;
        if( dif_x > dif_y ){
          console.log('draw horizontal')

          if(prev_point.dir == 'V' || prev_point.dir == "CV"){
            this.turn_to_horizontal(prev_point, new_x, properties.radius);
            recheck_prev = true;
          }else{
            //if it was going right, but now want to draw left
            if(
              prev_point.dif > 0 && new_x - prev_point.x < 0 ||
              prev_point.dif < 0 && new_x - prev_point.x > 0
            ){
              // this.turn_to_vertical(prev_point, new_y, properties.radius);
              // this.turn_to_horizontal(points[points.length-1], new_x, properties.radius);
              // recheck_prev = true;
            }
          }
          if( recheck_prev ){
            prev_point = points[points.length-1];
            console.log(prev_point.y)
          }
          if(!recheck_prev || (recheck_prev && prev_point.x!=new_x))
            this.draw_horizontal( new_x);
        }else{
          console.log('draw vertical')

          if(prev_point.dir == 'H' || prev_point.dir == "CH"){
            this.turn_to_vertical(prev_point, new_y, properties.radius);
            recheck_prev = true;
          }else{
            //if it was going up, but now want to draw down
            if(
              prev_point.dif > 0 && new_y - prev_point.y < 0 ||
              prev_point.dif < 0 && new_y - prev_point.y > 0
            ){
              // this.turn_to_horizontal(prev_point, new_x, properties.radius);
              // this.turn_to_vertical(points[points.length-1], new_y, properties.radius);
              // recheck_prev = true;
            }
          }
          if( recheck_prev ){
            prev_point = points[points.length-1];
            console.log(prev_point.y)
          }
          if(!recheck_prev || (recheck_prev && prev_point.y!=new_y))
            this.draw_vertical( new_y );
        }

        console.log(points);
        console.log(path.node.attributes.d.nodeValue)
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
      points = [];
    }

    this.undo = function(){
      points.pop();
      this.redraw();
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
    },
    undo: function(){
      if(main_path){
        main_path.undo();
      }
    }
  };
})();


export default SVGPath;
