var app = angular.module("batchApp");

app.service('ptoService', function ($resource, $mdDialog) {

    var ptos = this;

    ptos.authorize = function(){

<<<<<<< HEAD
        // Google api console clientID and apiKey
        var clientId = '886656742164-p6bfqnbtv8d1k1q3kisf6ossh9jkurdj.apps.googleusercontent.com';
        var apiKey = 'AIzaSyB2-e0FnmwRReoduEdI0bBv5fGG2TgrIZQ';

        // enter the scope of current project (this API must be turned on in the Google console)
        var scopes = 'https://www.googleapis.com/auth/calendar';

=======
    	// Google api console clientID and apiKey 
    	var clientId = '886656742164-p6bfqnbtv8d1k1q3kisf6ossh9jkurdj.apps.googleusercontent.com';
    	var apiKey = 'AIzaSyB2-e0FnmwRReoduEdI0bBv5fGG2TgrIZQ';

    	// enter the scope of current project (this API must be turned on in the Google console)
    	var scopes = 'https://www.googleapis.com/auth/calendar';
    	
>>>>>>> b36f03e844903aea1f38d46640e09671d54636ca
        gapi.client.setApiKey(apiKey);
        window.setTimeout(checkAuth,1);

        function checkAuth(){
            gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true},
<<<<<<< HEAD
                handleAuthResult);
        }

        function handleAuthResult(authResult){
            // if (authResult){

            // 	throw "Failed to authorize";
            // }
            console.log(authResult);
=======
            handleAuthResult);
        }

        function handleAuthResult(authResult){
            if (!authResult){
            	throw "Failed to authorize";
            }
>>>>>>> b36f03e844903aea1f38d46640e09671d54636ca
        }
    }

    ptos.addPto = function(trainer, startDate, endDate){

        Date.prototype.addDays = function(days) {
<<<<<<< HEAD
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

        startDate = startDate.formatDate(0);
        endDate = endDate.addDays(1).formatDate();
=======
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

		startDate = startDate.formatDate(0);
		endDate = endDate.addDays(1).formatDate();
>>>>>>> b36f03e844903aea1f38d46640e09671d54636ca

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
        };

        gapi.client.load('calendar', 'v3', function(){ // load the calendar api (version 3)
            var request = gapi.client.calendar.events.insert({
<<<<<<< HEAD
                'calendarId': calendarId,
                // calendar ID which id of Google Calendar where you are creating events. this can be copied from your Google Calendar user view.
                'resource': resource    // above resource will be passed here
            });
            // handle the response from our api call
=======
                'calendarId': calendarId, 
                // calendar ID which id of Google Calendar where you are creating events. this can be copied from your Google Calendar user view.
                'resource': resource    // above resource will be passed here
            });
                      // handle the response from our api call
>>>>>>> b36f03e844903aea1f38d46640e09671d54636ca
            request.execute(function(resp){
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
<<<<<<< HEAD
});
=======
});
>>>>>>> b36f03e844903aea1f38d46640e09671d54636ca
