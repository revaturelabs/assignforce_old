
	var assignforce = angular.module( "batchApp", ['ngRoute', 'ngAnimate', 'ngAria', 'ngResource', 'ngMaterial', 'md.data.table', 'ngCsv']);

          // global constants
        assignforce.constant( "secWeek", 604800000 )
                   .constant( "USstates", ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
                                           'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
		                                   'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
                                           'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
                                           'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'] )
                   .constant( "monthList", [ "Jan.", "Feb.", "Mar.", "Apr.", "May", "June",
                                             "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."] );
        
		  // url routing
		assignforce.config( function($routeProvider, $locationProvider){
			$routeProvider
				.when("/home", {
					templateUrl : "html/views/home.html",
					controller  : "homeCtrl as hCtrl"
				})
				.when("/batches", {
					templateUrl : "html/views/batches.html",
					controller  : "batchCtrl as bCtrl"
				})
				.when("/curriculum", {
					templateUrl	: "html/views/curricula.html",
					controller	: "curriculaCtrl as cCtrl"
				})
				.when("/trainers", {
					templateUrl : "html/views/trainers.html",
					controller  : "trainerCtrl as tCtrl"
				})
				.when("/locations", {
					templateUrl : "html/views/locations.html",
					controller  : "locationCtrl as lCtrl"
				})
                .when("/reports", {
					templateUrl : "html/views/reports.html",
					controller  : "reportCtrl as rCtrl"
				})
				.when("/profile", {
					templateUrl : "html/views/profile.html",
					controller  : "profileCtrl as pCtrl"
				})
				.when("/profile/:id", {
					templateUrl	: "html/views/profile.html",
					controller	: "profileCtrl as pCtrl"
				})
				.when("/settings", {
					templateUrl : "html/views/settings.html",
					controller  : "settingsCtrl as sCtrl"
				})
				.otherwise({"redirectTo": "/home"});
			
			$locationProvider.html5Mode(true);
		});

          // theme config
        assignforce.config( function($mdThemingProvider) {

            var revOrangeMap = $mdThemingProvider.extendPalette("deep-orange", {
                "800": "#D9510D",
                "500": "#F26925"
            });

            var revBlueMap = $mdThemingProvider.extendPalette("blue-grey", {
                "A200": "#374C61",
                "100" : "#C9DCE8"
            });

            $mdThemingProvider.definePalette("revOrange", revOrangeMap);
            $mdThemingProvider.definePalette("revBlue", revBlueMap);
                
            $mdThemingProvider.theme("default")
                .primaryPalette("revOrange")
                .accentPalette("revBlue");
                // .primaryPalette("indigo")
                // .accentPalette("pink");
        });

