
    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "homeCtrl", function( $scope, $filter, batchService, trainerService, locationService, buildingService, roomService ) {
        //console.log("Beginning overview controller.");
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
                "Room",
                "Start date",
                "End date"
            ] );
            hc.batches.forEach( function(batch) {
                var name       = ( batch.name       ) ? batch.name                                                 : "";
                var curriculum = ( batch.curriculum ) ? batch.curriculum.name                                      : "";
                var trainer    = ( batch.trainer    ) ? batch.trainer.firstName + " " + batch.trainer.lastName     : "";
                var cotrainer  = ( batch.cotrainer  ) ? batch.cotrainer.firstName + " " + batch.cotrainer.lastName : "";
                var location   = ( batch.location   ) ? batch.location.name                                        : "";
                var room       = ( batch.room       ) ? batch.room.roomName                                        : "";
                var startDate  = ( batch.startDate  ) ? $filter( "date" )( batch.startDate, "MM/dd/yyyy" )         : "";
                var endDate    = ( batch.endDate    ) ? $filter( "date" )( batch.endDate, "MM/dd/yyyy" )           : "";
                formatted.push( [ name, curriculum, trainer, cotrainer, location, room, startDate, endDate ] );
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
        batchService.getAll( function(response) {
            //console.log("  (HC)  Retrieving all batches.");
            hc.batches = response;
        }, function(error) {
            //console.log("  (HC)  Failed to retrieve all batches with error", error.data.message);
            hc.showToast("Could not fetch batches.");
        });

        trainerService.getAll( function(response) {
            //console.log("  (HC)  Retrieving all trainers.");
            hc.trainers = response;
        }, function(error) {
            //console.log("  (HC)  Failed to retrieve all trainers with error", error.data.message);
            hc.showToast("Could not fetch trainers.");
        });
        locationService.getAll( function(response) {
            //console.log("  (HC)  Retrieving all locations.");
            hc.locations = response;
        }, function(error) {
            //console.log("  (HC)  Failed to retrieve all location with error", error.data.message);
            hc.showToast("Could not fetch locations.");
        });
        buildingService.getAll( function(response) {
            //console.log("  (HC)  Retrieving all locations.");
            hc.buildings = response;
        }, function(error) {
            //console.log("  (HC)  Failed to retrieve all location with error", error.data.message);
            hc.showToast("Could not fetch buildings.");
        });
    });