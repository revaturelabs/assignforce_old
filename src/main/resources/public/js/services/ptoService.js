var app = angular.module("batchApp");

app.service('ptoService', function ($resource, $mdDialog) {

    var ptos = this;

    var GoogleAuth;
    // Google api console clientID and apiKey 
    var clientId = '886656742164-p6bfqnbtv8d1k1q3kisf6ossh9jkurdj.apps.googleusercontent.com';
    var apiKey = 'AIzaSyB2-e0FnmwRReoduEdI0bBv5fGG2TgrIZQ';
    // enter the scope of current project (this API must be turned on in the Google console)
    var scopes = 'https://www.googleapis.com/auth/calendar';
    var calendarId = 'taj5130@gmail.com';

    ptos.authorize = function(){
        gapi.load('client:auth2', initClient);
    }

    function showCalendar(){
        $mdDialog.show({
            templateUrl: "html/templates/calendarTemplate.html",
            controller: "trainerCtrl",
            controllerAs: "tCtrl",
            bindToController: true,
            clickOutsideToClose: true
        })
    }

    function initClient() {
        // Initialize the gapi.client object, which app uses to make API requests.
        // Get API key and client ID from API Console.
        // 'scope' field specifies space-delimited list of access scopes.
        gapi.client.init({
            'apiKey': apiKey,
            'clientId': clientId,
            'scope': scopes
        }).then(function(){

            GoogleAuth = gapi.auth2.getAuthInstance();

        }).then(function(){

            if (GoogleAuth.isSignedIn.get()) {

                showCalendar();

            } else {
                // User is not signed in. Start Google auth flow.
                GoogleAuth.signIn().then(function(){
                    
                    showCalendar();
                });
            }
        });
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

		    if (month.length < 2){
		    	month = '0' + month;
		    }
		    if (day.length < 2){
		    	day = '0' + day;
		    }

		    return [year, month, day].join('-');
		}

		startDate = startDate.formatDate();
		endDate = endDate.addDays(1).formatDate();

        // This is the resource we will pass while calling api function
        var resource = {
            "summary": trainer.firstName + " " + trainer.lastName + ": Out Of Office",
            "start": {
                "date": startDate.toString()
            },
            "end": {
                "date": endDate.toString()
            },
        };

        gapi.client.load('calendar', 'v3', function(){ // load the calendar api (version 3)
            var request = gapi.client.calendar.events.insert({
                'calendarId': calendarId, 
                // calendar ID which id of Google Calendar where you are creating events. this can be copied from your Google Calendar user view.
                'resource': resource    // above resource will be passed here
            });
                      // handle the response from our api call
            request.execute(function(){
                $mdDialog.cancel();

                showCalendar();
            });
        });
    }
});