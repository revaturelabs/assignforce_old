var app = angular.module("batchApp");

app.service('ptoService', function ($resource, $mdDialog) {

    var ptos = this;

    var GoogleAuth;
    // Google api console clientID and apiKey 

    // enter the scope of current project (this API must be turned on in the Google console)
    var scopes = 'https://www.googleapis.com/auth/calendar';


    ptos.authorize = function handleClientLoad(){
        gapi.load('client:auth2', initClient);
    }

    function initClient() {
      // Retrieve the discovery document for version 3 of Google Drive API.
      // In practice, your app can retrieve one or more discovery documents.
      // var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

      // Initialize the gapi.client object, which app uses to make API requests.
      // Get API key and client ID from API Console.
      // 'scope' field specifies space-delimited list of access scopes.
      gapi.client.init({
            'apiKey': 'AIzaSyB2-e0FnmwRReoduEdI0bBv5fGG2TgrIZQ',
            // 'discoveryDocs': [discoveryUrl],
            'clientId': '886656742164-p6bfqnbtv8d1k1q3kisf6ossh9jkurdj.apps.googleusercontent.com',
            'scope': scopes
        }).then(function () {
            GoogleAuth = gapi.auth2.getAuthInstance();

            // Listen for sign-in state changes.
            GoogleAuth.isSignedIn.listen(updateSigninStatus);

            // Handle initial sign-in state. (Determine if user is already signed in.)
            
            setSigninStatus();

        });
    }

    var trainer;
    var startDate;
    var endDate;

    ptos.handleAuthClick = function(t, s, e){

        trainer = t;
        startDate = s;
        endDate = e;

        if (GoogleAuth.isSignedIn.get()) {
          // User is authorized and has clicked 'Sign out' button.
          ptos.addPto(trainer, startDate, endDate);
        } else {
          // User is not signed in. Start Google auth flow.
          GoogleAuth.signIn();
        }
    }

    function setSigninStatus(isSignedIn) {
      var user = GoogleAuth.currentUser.get();
    }

    function updateSigninStatus(isSignedIn) {
        setSigninStatus();
        ptos.addPto(trainer, startDate, endDate);
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
        };

        gapi.client.load('calendar', 'v3', function(){ // load the calendar api (version 3)
            var request = gapi.client.calendar.events.insert({
                'calendarId': calendarId, 
                // calendar ID which id of Google Calendar where you are creating events. this can be copied from your Google Calendar user view.
                'resource': resource    // above resource will be passed here
            });
                      // handle the response from our api call
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
});