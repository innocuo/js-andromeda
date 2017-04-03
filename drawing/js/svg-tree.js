var SVGTree = (function(){
  var obj = {
    test:1
  }

  var Tree = function(qpaper){

    var paper = qpaper;
    var path;
    var properties = {
      fill: 'rgb(0,0,0)',
      stroke: 'rgb(255,255,255)',
      strokeWidth: 2,
      min_h: 10,
      max_h: 50,
      min_r: 20,
      max_r: 40,
      cols: 3
    }

    //["rgb(", Math.round(Math.random()*255),',',Math.round(Math.random()*255),',',Math.round(Math.random()*255), ")"].join('')
//path.transform(['t',mouse.scaledX,',',mouse.scaledY].join(''));

    var add_column = function(w, h, x){

      var r = w/2;

      var path_str = ['V',h,'C',x,',', h-r,',',x+r,',',h-r,',',x+r,',',h-r,'C',x+r,',',h-r,',',x+w,',',h-r,',',x+w,',',h].join('');
      console.log(path_str);
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
        fill: properties.fill,
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
          properties['fill'] = 'rgb('+[r,g,b].join(',')+')';

          r = lighten(r, 30);
          g = lighten(g, 30);
          b = lighten(b, 30);

          properties['stroke'] = 'rgb('+[r,g,b].join(',')+')';

        break;
      }
    }

    this.move = function(x, y){
      path.transform( 't' + [x,y].join(',') );
    }

    return this;
  }

  return {
    instantiate: function(paper){
      return new Tree(paper);
    }
  };
})();
