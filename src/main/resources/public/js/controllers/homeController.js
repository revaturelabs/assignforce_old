
    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "homeCtrl", function( $scope, $filter, batchService, $rootScope , $resource ,trainerService, locationService, buildingService) {
          // functions
            // calls showToast method of aCtrl
        $scope.showToast = function( message ) {
            $scope.$parent.aCtrl.showToast( message );
        };

            // determine length of progress indicators
        //testable1
        $scope.calcProgress = function( paramLow, paramHigh ) {

              // magnitude and type of parameters are used to determine mode
              // length based on current time (batches)
            if (paramLow > 1000000) {

                var today = new Date().getTime();
                var diff = paramHigh - paramLow;

                today -= paramLow;
                
                var percent = (today * 100 / diff).toFixed(5);
                if ( percent < 0 ) {
                    return 0;
                } else if ( percent > 100 ) {
                    return 100;
                } else {
                    return (today * 100 / diff).toFixed(5);
                }
            } 
                // length based on availability (trainers)
            if (typeof paramLow === "string") {
                if (paramLow.toLowerCase() === "available") {
                    return 100;
                } else if (paramLow.toLowerCase() === "unavailable") {
                    return 0;
                }
            } 
                // length based on simple division (locations)
            if (paramLow / paramHigh > 1) {
                return 100;
            } else if (paramLow < 0) {
                return 0;
            } else {
                return paramLow / paramHigh;
            }
        };

            // checks given dates and determines if trainer/room is currently available
        //testable2
        $scope.checkAvailability = function(dates) {
            
            if (!dates) {
                return "Available";
            }

            var availability = "Available";
            var now = new Date().getTime();
            dates.forEach( function(item) {
                 if ( (item.startDate <= now) && (item.endDate > now) ) {
                    availability = "Unavailable";
                }
            });

            return availability;
        };

            // returns number of currently available rooms in location
        //testable3
        $scope.findRoomsAvailable = function(rooms) {
            
            if (!rooms) {
                return 0;
            }

            var numAv = 0;
            rooms.forEach(function(room) {
               if ($scope.checkAvailability(room.unavailable) === "Available") {
                   numAv++;
               }
            });
            return numAv;
        };

            // organizes batch data to a format conforming to CSV format
        //testable4
        $scope.formatBatches = function() {
            var formatted = [];
            formatted.push( [
                "Name",
                "Curriculum",
                "Trainer",
                "Cotrainer",
                "Location",
                "Building",
                "Room",
                "Start date",
                "End date"
            ] );
            $scope.batches.forEach( function(batch) {
                var name       = ( batch.name       ) ? batch.name                                                 : "";
                var curriculum = ( batch.curriculum ) ? batch.curriculum.name                                      : "";
                var trainer    = ( batch.trainer    ) ? batch.trainer.firstName + " " + batch.trainer.lastName     : "";
                var cotrainer  = ( batch.cotrainer  ) ? batch.cotrainer.firstName + " " + batch.cotrainer.lastName : "";
                var startDate  = ( batch.startDate  ) ? $filter( "date" )( batch.startDate, "MM/dd/yyyy" )         : "";
                var endDate    = ( batch.endDate    ) ? $filter( "date" )( batch.endDate, "MM/dd/yyyy" )           : "";
                var room       = ( batch.room       ) ? batch.room.roomName : "";
                var building = "";
                var location = "";
                $scope.buildings.forEach(function(buildingIn){
                	buildingIn.rooms.forEach(function(roomIn){
                		if (batch.room && roomIn.roomID === batch.room.roomID){
                    		building = buildingIn;
                    		return;
                    	}                		
                	});
                	if (building){
                	    return;
                	}
                });
                $scope.locations.forEach(function(locationIn){
                	locationIn.buildings.forEach(function(buildingIn){
                		if(building && buildingIn.id === building.id){
                			location = locationIn.name;
                		}
                	})
                })
                building = (building) ? building.name : "";                

                formatted.push( [ name, curriculum, trainer, cotrainer, location, building, room, startDate, endDate ] );
            });
            
            return formatted;
        };

          // data

        //testable5
        $scope.batchOrder = "startDate";
        $scope.batchFilter = "All";

        $scope.trainerOrder = "firstName";
        $scope.trainerFilter = "All";
        
        $scope.locationOrder = "name";
        $scope.locationFilter = "Current";

        $scope.filterMux = { Active  : { mode  : "active",
                                     params: {} },
                         Upcoming: { mode  : "upcoming",
                                     params: { numWeeks: 2} },
                         All     : { mode  : "none",
                                     params: {} }
        };

          // page initialization
            // data gathering
        trainerService.getAll( function(response) {
            $scope.trainers = response;
        }, function() {
            $scope.showToast("Could not fetch trainers.");
        });
        
        // In this funky format because of time constraints and
        // we had to scrap the bi-directional relationships for the
        // POJO's due to problems in another sector
        locationService.getAll( function(response) {
            $scope.locations = response;
            buildingService.getAll( function(response) {
				$scope.buildings = response;
				batchService.getAll(function(response) {
					$scope.batches = response;
					$scope.batches.forEach(function(batchIn) {
						$scope.buildings.forEach(function(buildingIn) {
							buildingIn.rooms.forEach(function(roomIn) {
								if (batchIn.room && roomIn.roomID === batchIn.room.roomID) {
									batchIn.building = buildingIn;
									return;
								}
								if (batchIn.building){
								    return;
								}
							});
							if (batchIn.building){
							    return;
							}
						});
						if (batchIn.building){
						    return;
						}
                	});
				}, function() {
                    $scope.showToast("Could not fetch batches.");
                });
            }, function() {
                $scope.showToast("Could not fetch buildings.");
            });
        }, function() {
            $scope.showToast("Could not fetch locations.");
        });
        
    });