
var app = angular.module("batchApp");

app.service('ptoService', function ($resource, $http) {
    // Have to make calls to the server

    var ptos = this;
    // var token = $resource();

    ptos.sendRequest = function(){
    	ptos.getToken();
    };

    ptos.getToken = function(){
    	// console.log("sss");
    };

    ptos.authorize = function(){

    	// Google api console clientID and apiKey 
    	var clientId = '886656742164-p6bfqnbtv8d1k1q3kisf6ossh9jkurdj.apps.googleusercontent.com';
    	var apiKey = 'AIzaSyB2-e0FnmwRReoduEdI0bBv5fGG2TgrIZQ';

    	// enter the scope of current project (this API must be turned on in the Google console)
    	var scopes = 'https://www.googleapis.com/auth/calendar';

    	
        gapi.client.setApiKey(apiKey);
        window.setTimeout(checkAuth,1);

        function checkAuth(){
            gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true},
            handleAuthResult);
        }

        function handleAuthResult(authResult){
            if (authResult){
                console.log(authResult);
            } else {
                console.log("failed");
            }
        }
    }

    ptos.addPto = function(trainer, startDate, endDate){

        Date.prototype.addHours= function(h){
            this.setHours(this.getHours()+h);
            return this;
        }

        Date.prototype.addMinutes= function(m){
            this.setMinutes(this.getMinutes()+m);
            return this;
        }

        var calendarId = 'taj5130@gmail.com';

        // This is the resource we will pass while calling api function
        var resource = {
            "summary": trainer.firstName + " " + trainer.lastName,
            "start": {
                "dateTime": (new Date(startDate)).toISOString()
            },
            "end": {
                "dateTime": (new Date(endDate)).addHours(23).addMinutes(59).toISOString()
            },
        };

        
    	console.log("making api call");
    	console.log("endDate: " + resource.end.dateTime);

        gapi.client.load('calendar', 'v3', function(){ // load the calendar api (version 3)
            var request = gapi.client.calendar.events.insert({
                'calendarId': calendarId, 
                // calendar ID which id of Google Calendar where you are creating events. this can be copied from your Google Calendar user view.
                'resource': resource    // above resource will be passed here
            });
                      // handle the response from our api call
            request.execute(function(resp){

                console.log(resp);
                //document.getElementById('calendar').contentWindow.location.reload();
            });    
        });
    }
});
