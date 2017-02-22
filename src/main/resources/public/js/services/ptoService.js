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

    ptos.authorize = function handleClientLoad(){
        console.log("handleClientLoad");
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
            var user = GoogleAuth.currentUser.get();


            setSigninStatus();

            // console.log("Sign In");
        });
    }
    // ptos.authorize = function(){

    // 	// Google api console clientID and apiKey
    // 	var clientId = '886656742164-p6bfqnbtv8d1k1q3kisf6ossh9jkurdj.apps.googleusercontent.com';
    // 	var apiKey = 'AIzaSyB2-e0FnmwRReoduEdI0bBv5fGG2TgrIZQ';

    // 	// enter the scope of current project (this API must be turned on in the Google console)
    // 	var scopes = 'https://www.googleapis.com/auth/calendar';

    //     gapi.client.setApiKey(apiKey);
    //     window.setTimeout(checkAuth,1);

    //     function checkAuth(){
    //         gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true},
    //         handleAuthResult);
    //     }

    //     function handleAuthResult(authResult){

    //     }
    // }

    var trainer;
    var startDate;
    var endDate;

    ptos.handleAuthClick = function(t, s, e){
        // if (GoogleAuth.isSignedIn.get()) {
        //   // User is authorized and has clicked 'Sign out' button.
        //   console.log("signing out");
        //   GoogleAuth.signOut();
        // } else {
        // User is not signed in. Start Google auth flow.
        trainer = t;
        startDate = s;
        endDate = e;
        console.log("signing in");
        GoogleAuth.signIn();
        var user = GoogleAuth.currentUser.get();
        console.log(user);

        // }
    }

    function setSigninStatus(isSignedIn) {
        var user = GoogleAuth.currentUser.get();
        var isAuthorized = user.hasGrantedScopes(scopes);
    }

    function updateSigninStatus(isSignedIn) {
        console.log("Sign In update");
        setSigninStatus();
        ptos.addPto(trainer, startDate, endDate);
    }

    function handleAuthResult(authResult){
        if (authResult){
            console.log(authResult);
        }
        else {
            console.log("failed");
        }
    }

    ptos.addPto = function(trainer, startDate, endDate){

        // handleAuthClick();

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
