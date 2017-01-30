
    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "reportCtrl", function( $scope, batchService, curriculumService, monthList ){
        console.log("Beginning report controller.");
        var rc = this;

          // functions
            // calls showToast method of aCtrl
        rc.showToast = function( message ) {
            $scope.$parent.aCtrl.showToast( message );
        };

            // summarizes graduate output of given curriculum for chosen year
        rc.currSummary = function( curriculum ){
            
            var summary = [];
            var total = 0;

            for (var month = 0; month < 12; month++) {
                total = 0;
                rc.batches.forEach( function(batch){

                    if (batch.curriculum && curriculum) {
                        date = new Date(batch.endDate);
                        if ( (date.getMonth() == month) && (date.getFullYear() == rc.year) && (batch.curriculum.id == curriculum.id) ) {
                            total += rc.graduates;
                        }
                    }
                });
                summary.push( total );
            }

            return summary;
        };

            // sums months for given curriculum in chosen year
        rc.sumCurrYear = function( total, num ){
            return total + num;
        };

            // sums all curricula for the year
        rc.sumYear = function() {

            var total = 0;
            var summary;
            rc.curricula.forEach( function(curr){
                summary = rc.currSummary(curr);
                total += summary.reduce(rc.sumCurrYear); 
            });
            return total;
        };

            // sums monthly total over all curricula
        rc.sumMonth = function(month){

            if (rc.batches) {
                var total = 0;
                var date;
                rc.batches.forEach( function(batch){
                    date = new Date(batch.endDate);
                    if ( (date.getMonth() == month) && (date.getFullYear() == rc.year) && (batch.curriculum) ) {
                        total += rc.graduates;
                    }
                });
                return total;
            }
        };

          // data
        rc.year = new Date().getFullYear();
        rc.graduates = 15;

        rc.currOrder = "name";

        rc.monthList = monthList;

          // page initialization
            // data gathering
        batchService.getAll( function(response) {
            console.log("  (RC)  Retrieving all batches.");
            rc.batches = response;
        }, function(error) {
            console.log("  (RC)  Failed to retrieve all batches with error:", error.data.message);
            rc.showToast( "Could not fetch batches.");
        });

        curriculumService.getAll( function(response) {
            console.log("  (RC)  Retrieving all curricula.");
            rc.curricula = response;
        }, function(error) {
            console.log("  (RC)  Failed to retrieve all curricula with error:", error.data.message);
            rc.showToast( "Could not fetch curricula.");
        });

          // only batches and curricula are necessary now, but these are here in the event that new reports require the use of other object lists

        // skillService.getAll( function(response) {
        //     console.log("  (BC)  Retrieving all skills.");
        //     rc.skills = response;
        // }, function(error) {
        //     console.log("  (BC)  Failed to retrieve all skills with error:", error.data.message);
        //     rc.showToast( "Could not fetch skills.");
        // });

        // trainerService.getAll( function(response) {
        //     console.log("  (RC)  Retrieving all trainers.");
        //     rc.trainers = response;
        // }, function(error) {
        //     console.log("  (RC)  Failed to retrieve all trainers with error:", error.data.message);
        //     rc.showToast( "Could not fetch trainers.");
        // });

        // locationService.getAll( function(response) {
        //     console.log("  (RC)  Retrieving all locations.");
        //     rc.locations = response;
        // }, function(error) {
        //     console.log("  (RC)  Failed to retrieve all locations with error:", error.data.message);
        //     rc.showToast( "Could not fetch locations.");
        // });

    });