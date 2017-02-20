
var app = angular.module("batchApp");

app.service('ptoService', function ($resource) {
    // Have to make calls to the server

    var ptos = this;
    
    ptos.sendRequest = function(){
    	ptos.getToken();
    };

    ptos.getToken = function(){
    	// donothing
    };
});
