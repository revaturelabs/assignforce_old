
var app = angular.module("batchApp");

app.service('ptoService', function ($resource, $mdDialog, $http) {
    // Have to make calls to the server

    var ptos = this;
    // var token = $resource();

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
            } else {
                console.log("failed");
            }
        }
    }

    ptos.addPto = function(trainer, startDate, endDate){

        Date.prototype.addDays = function(days) {
          var dat = new Date(this.valueOf());
          dat.setDate(dat.getDate() + days);
          return dat;
        }

        Date.prototype.formatDate = function() {
		    var d = new Date(this),
		        month = '' + (d.getMonth() + 1),
		        day = '' + (d.getDate()),
		        year = d.getFullYear();

		    if (month.length < 2) month = '0' + month;
		    if (day.length < 2) day = '0' + day;

		    return [year, month, day].join('-');
		}

		startDate = startDate.formatDate(0);
		endDate = endDate.addDays(1).formatDate();

        var calendarId = 'taj5130@gmail.com';

        // This is the resource we will pass while calling api function
        var resource = {
            "summary": trainer.firstName + " " + trainer.lastName + ": Out Of Office",
            "start": {
                "date": startDate.toString()
            },
            "end": {
                "date": endDate.toString()
            },
            // "description": trainer.firstName + " " + trainer.lastName,
        };

        gapi.client.load('calendar', 'v3', function(){ // load the calendar api (version 3)
            var request = gapi.client.calendar.events.insert({
                'calendarId': calendarId, 
                // calendar ID which id of Google Calendar where you are creating events. this can be copied from your Google Calendar user view.
                'resource': resource    // above resource will be passed here
            });
                      // handle the response from our api call
            request.execute(function(resp){

                // console.log("added event " + resp);
                $mdDialog.cancel();

                $mdDialog.show({
                    templateUrl: "html/templates/calendarTemplate.html",
                    controller: "trainerCtrl",
                    controllerAs: "tCtrl",
                    bindToController: true,
                    clickOutsideToClose: true
                });
            });
        });
    }
});