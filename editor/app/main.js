var Moon = require('moonjs');

var app = new Moon({
  el: "#app1",
  data: {
    msg: "Hello Moon!"
  }
});

setInterval(function(){
  app.set('msg', Math.random())
}, 200)
