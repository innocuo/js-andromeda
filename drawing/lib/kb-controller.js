var KBController = (function(){
  var KB = function(){
    var commands = {

    };

    var on_key = function(e){
      var key_name = e.key;

      if (e.ctrlKey) {

        console.log(`Combination of ctrlKey + ${key_name}`);
      } else {
        console.log(`Key pressed ${key_name}`);
        if(commands[key_name]){
          var ev = new Event('kb_'+key_name);
          document.dispatchEvent( ev );
        }
      }
    }

    this.init = function(){
      document.addEventListener('keydown', on_key, false);
    }

    this.register = function( key, callback){
      commands[key] = true;
      document.addEventListener('kb_' + key, function(e){
        callback();
      }, false);
    }
  }

  return new KB();
})();
