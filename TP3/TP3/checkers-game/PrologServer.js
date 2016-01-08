server = null;

/**
 * Prolog
 * @constructor
 * @param scene
 */
function PrologServer(scene){
  this.scene = scene;
  server = this;
}

/**
 * getPrologRequest
 * Generates a request to Prolog server.
 * @constructor
 * @param requestString
 */
PrologServer.prototype.getPrologRequest = function(requestString, successHandler){
  this.scene.commState = "IN_PROGRESS";
  var requestPort = 8081;
  var request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

  request.onload = successHandler;
  request.onerror = function(){console.log("Error waiting for response");};

  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send();

};
