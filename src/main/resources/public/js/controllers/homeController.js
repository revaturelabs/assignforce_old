
    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "homeCtrl", function( $scope, $filter, batchService, trainerService, locationService, buildingService ) {
        var hc = this;

          // functions
            // calls showToast method of aCtrl
        hc.showToast = function( message ) {
            $scope.$parent.aCtrl.showToast( message );
        };

            // determine length of progress indicators
        hc.calcProgress = function( paramLow, paramHigh ) {

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
            if (typeof paramLow == "string") {
                if (paramLow.toLowerCase() == "available") {
                    return 100;
                } else if (paramLow.toLowerCase() == "unavailable") {
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
        hc.checkAvailability = function(dates) {
            
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
        hc.findRoomsAvailable = function(rooms) {
            
            if (!rooms) {
                return 0;
            }

            var numAv = 0;
            rooms.forEach(function(room) {
               if (hc.checkAvailability(room.unavailable) == "Available") {
                   numAv++;
               }
            });
            return numAv;
        };

            // organizes batch data to a format conforming to CSV format
        hc.formatBatches = function() {
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
            hc.batches.forEach( function(batch) {
                var name       = ( batch.name       ) ? batch.name                                                 : "";
                var curriculum = ( batch.curriculum ) ? batch.curriculum.name                                      : "";
                var trainer    = ( batch.trainer    ) ? batch.trainer.firstName + " " + batch.trainer.lastName     : "";
                var cotrainer  = ( batch.cotrainer  ) ? batch.cotrainer.firstName + " " + batch.cotrainer.lastName : "";
                var startDate  = ( batch.startDate  ) ? $filter( "date" )( batch.startDate, "MM/dd/yyyy" )         : "";
                var endDate    = ( batch.endDate    ) ? $filter( "date" )( batch.endDate, "MM/dd/yyyy" )           : "";
                var room       = ( batch.room       ) ? batch.room.roomName : "";
                var building = "";
                var location = "";
                hc.buildings.forEach(function(buildingIn){
                	buildingIn.rooms.forEach(function(roomIn){
                		if (batch.room && roomIn.roomID == batch.room.roomID){
                    		building = buildingIn;
                    		return;
                    	}                		
                	});
                	if (building) return;                	
                });
                hc.locations.forEach(function(locationIn){
                	locationIn.buildings.forEach(function(buildingIn){
                		if(building && buildingIn.id == building.id){
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
        hc.batchOrder = "startDate";
        hc.batchFilter = "All";

        hc.trainerOrder = "firstName";
        hc.trainerFilter = "All";
        
        hc.locationOrder = "name";
        hc.locationFilter = "Current";

        hc.filterMux = { Active  : { mode  : "active",
                                     params: {} },
                         Upcoming: { mode  : "upcoming",
                                     params: { numWeeks: 2} },
                         All     : { mode  : "none",
                                     params: {} }
        };

          // page initialization
            // data gathering
        trainerService.getAll( function(response) {
            hc.trainers = response;
        }, function() {
            hc.showToast("Could not fetch trainers.");
        });
        
        // In this funky format because of time constraints and
        // we had to scrap the bi-directional relationships for the
        // POJO's due to problems in another sector
        locationService.getAll( function(response) {
            hc.locations = response;
            buildingService.getAll( function(response) {
				hc.buildings = response;
				batchService.getAll(function(response) {
					hc.batches = response;
					hc.batches.forEach(function(batchIn) {
						hc.buildings.forEach(function(buildingIn) {
							buildingIn.rooms.forEach(function(roomIn) {
								if (batchIn.room && roomIn.roomID == batchIn.room.roomID) {
									batchIn.building = buildingIn;
									return;
								}
								if (batchIn.building) return;
							});
							if (batchIn.building) return;
						});
						if (batchIn.building) return;
                	});
				}, function() {
                    hc.showToast("Could not fetch batches.");
                });
            }, function() {
                hc.showToast("Could not fetch buildings.");
            });
        }, function() {
            hc.showToast("Could not fetch locations.");
        });
        
    });