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

    this.end_draw = function(){
      var path_str = 'L 0 0';
      path.node.attributes.d.nodeValue += path_str;
      this.clear();
    }

    this.draw = function(){

      if( path ){
        path.attr({
          fill: properties.fill,
          stroke: properties.stroke,
          strokeWidth: properties.strokeWidth
        });
      }
    }

    this.set = function(key, value){

      properties[key] = value;
    }

    this.send_to_back = function(){
      path.prependTo(paper);
    }

    this.redraw = function(){
      if( !path ) return ;

      path.node.attributes.d.nodeValue = '';
      var new_path = [];
      _.forEach(points, function( val){
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

    this.get_curve_from_h = function(prev_step, radius){
      var dif = Math.abs(radius) * (Math.sign(prev_step))
      var path_str = 'c'+['0','0', dif, 0, dif, radius].join(',');
      return path_str;
    }

    this.get_curve_from_v = function(prev_step, radius){
      var dif = Math.abs(radius) * (Math.sign(prev_step))
      var path_str = 'c'+['0','0','0', dif, radius, dif].join(',');
      return path_str;
    }

    this.relative_add = function( dir, step){

      var path_str;

      if( !path || points.length == 0 ){
        path_str = "M0,0"
        path = paper.path( path_str );
        points.push({x: 0, y: 0, dir: '0', str: path_str });

        properties.init_x = properties.center.x;
        properties.init_y = properties.center.y;

        path.transform( 't' + [properties.init_x, properties.init_y].join(',') );
      }

      var prev_point = points[points.length-1];

      if( prev_point && prev_point.dir.toLowerCase() == dir){
        path_str = dir + ( step + prev_point.step);
        prev_point.step = ( step + prev_point.step)
        prev_point.str = path_str;

        if(prev_point.step == 0){
          var old_value = path.node.attributes.d.nodeValue

          var index_of_dir = old_value.lastIndexOf(dir);
          path.node.attributes.d.nodeValue = old_value.substring( 0, index_of_dir );
          points.pop();
        }else{
          var old_value = path.node.attributes.d.nodeValue

          var index_of_dir = old_value.lastIndexOf(dir);
          path.node.attributes.d.nodeValue = old_value.substring( 0, index_of_dir ) + prev_point.str;
        }


      }else{
        switch (prev_point.dir.toLowerCase()) {
          case 'h':
            path_str = this.get_curve_from_h( prev_point.step, step );
            points.push({ step: step, dir: 'c'+dir, dif: 0, str: path_str });
            path.node.attributes.d.nodeValue += path_str;
            break;
          case 'v':
            path_str = this.get_curve_from_v( prev_point.step, step );
            points.push({ step: step, dir: 'c'+dir, dif: 0, str: path_str });
            path.node.attributes.d.nodeValue += path_str;
            break;
          default:
            if(prev_point.dir.toLowerCase()=='cv' && dir=='h'){

              path_str = this.get_curve_from_v( prev_point.step, step );
              points.push({ step: step, dir: 'c'+dir, dif: 0, str: path_str });
              path.node.attributes.d.nodeValue += path_str;
            }else if(prev_point.dir.toLowerCase()=='ch' && dir=='v'){

              path_str = this.get_curve_from_h( prev_point.step, step );
              points.push({ step: step, dir: 'c'+dir, dif: 0, str: path_str });
              path.node.attributes.d.nodeValue += path_str;
            }else{

              path_str = dir + step;
              points.push({ step: step, dir: dir, dif: 0, str: path_str });
              path.node.attributes.d.nodeValue += path_str;
            }
        }


      }

      console.log(path.node.attributes.d.nodeValue);




      // var next_y,next_x;
      //
      // if( !path || points.length == 0 ){
      //   next_x = properties.center.x;
      //   next_y = properties.center.y;
      // }else{
      //   var prev_point = points[points.length-1];
      //   next_x = properties.init_x+prev_point.x + x;
      //   next_y = properties.init_y+prev_point.y + y;
      // }
      // this.add(next_x, next_y);
    }

    this.add = function(x, y){

      var path_str;
      if( !path || points.length == 0 ){
        path_str = "M0,0"
        path = paper.path( path_str );

        properties.init_x = Math.round( x );
        properties.init_y = Math.round( y );

        path.transform( 't' + [properties.init_x, properties.init_y].join(',') );
        points.push({x: 0, y: 0, dir: '0', str: path_str });
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

    this.end = function(){
      console.log('end path')
      path.node.attributes.d.nodeValue += 'Z';
      this.clear();
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
