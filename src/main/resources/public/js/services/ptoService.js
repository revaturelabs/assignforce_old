
var app = angular.module("batchApp");
//may need $resource in the parameters
app.service('ptoService', function () {
    // Have to make calls to the server

    var ptos = this;
    
    ptos.sendRequest = function(){
    	ptos.getToken();
    };

    ptos.getToken = function(){
    	// donothing
    };
});
