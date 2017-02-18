
var app = angular.module("batchApp");

app.service('ptoService', function ($resource) {
    // Have to make calls to the server

    var ptos = this;
    // var token = $resource();

    ptos.sendRequest = function(){
    	ptos.getToken();
    };

    ptos.getToken = function(){
    	// console.log("sss");
    };
});
