var Moon = require('moonjs');
import 'components/sidebar';
import 'components/svg-stage';



var app = new Moon({
  el: "#app1",
  stemplate:"",
  data: {
    msg: "test"
  }
});

setInterval(function(){
  //app.set('msg', Math.random())
}, 200)