
    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "batchCtrl", function($scope, $timeout, batchService, curriculumService, skillService, trainerService, locationService, calendarService ) {
        console.log("Beginning batch controller.");
        var bc = this;

          // functions
            // calls showToast method of aCtrl
        bc.showToast = function( message ){
            $scope.$parent.aCtrl.showToast( message );
        };

            // changes form state and populates fields if need-be
        bc.changeState = function( newState, incomingBatch ){ 
            console.log("  (BC)  Changing to state [" + newState + "] from [" + bc.state + "].");
            bc.state = newState;

            if (newState == "create") {
                bc.batch = batchService.getEmptyBatch();
                bc.batch.location = bc.findHQ();
            } else {

                bc.batch.id         = (bc.state == "edit")       ? incomingBatch.id                  : undefined;

                bc.batch.name       = incomingBatch.name;
                bc.batch.curriculum = (incomingBatch.curriculum) ? incomingBatch.curriculum.id       : undefined;
                
                bc.batch.trainer    = (incomingBatch.trainer)    ? incomingBatch.trainer.trainerID   : undefined;
                bc.batch.cotrainer  = (incomingBatch.cotrainer)  ? incomingBatch.cotrainer.trainerID : undefined;
                
                bc.batch.location   = incomingBatch.location.id;
                bc.batch.room       = (incomingBatch.room)       ? incomingBatch.room.roomID         : undefined;
                
                bc.batch.startDate  = (incomingBatch.startDate)  ? new Date(incomingBatch.startDate) : undefined;
                bc.batch.endDate    = (incomingBatch.endDate)    ? new Date(incomingBatch.endDate)   : undefined;

                bc.updateWeeks();
            }
        };

            // defaults location to Reston branch 
              // HARD CODED, I couldn't think of a better way to do it that would reliably select only the main branch
        bc.findHQ = function(){
            return 1;
        }
            // select end date based on start date
        bc.selectEndDate = function(){
            var startDate = new Date(bc.batch.startDate);
            bc.batch.endDate = new Date( startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 67 );
        };

            // disables all but Mondays in start datepickers
        bc.enableMondays = function( date ){
            if (date.getDay() == 1) {
                return true;
            } else {
                return false;
            }
        };

            // disables all but Fridays in start datepickers
        bc.enableFridays = function( date ){
            if (date.getDay() == 5) {
                return true;
            } else {
                return false;
            }
        };

            // filters rooms based on selected location
        bc.filterRooms = function(locationID){
            if(locationID != undefined){
                return bc.locations.filter(function(location){return location.id===locationID})[0].rooms;
            }
            else {
                return [];
            }
        };

            // counts the number of weeks between the start and end dates
        bc.updateWeeks = function(){
            var weeks = calendarService.countWeeks( bc.batch.startDate, bc.batch.endDate );
            if (!weeks) {
                bc.weeksSpan = "spans 0 weeks";
            } else {
                bc.weeksSpan = "spans " + weeks + " weeks";
            }
        };

            // defaults name to _curriculum_ (_start date_) if both are chosen and name is not
        bc.defaultName = function(){
            if ( (bc.batch.curriculum != undefined) && (bc.batch.startDate != undefined) && (bc.batch.name == undefined) ) {
                var start = new Date(bc.batch.startDate);
                var currName;
                bc.curricula.forEach( function(curr){
                    if (curr.id == bc.batch.curriculum) {
                        currName = curr.name;
                    }
                });
                bc.batch.name = currName + " (" + (start.getMonth() + 1) + "/" + start.getDate() + ")";
            } 
        };

            // outputs progress as a percent
        bc.calcProgress = function( paramLow, paramHigh ){

            if (!paramLow || !paramHigh) {
                return 0;
            }

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
        };

            // highlights batches clicked on timeline
        bc.highlightBatch = function(batch){
			if(bc.selectedBatch !== undefined){
				d3.select('#id'+bc.selectedBatch.id)
					.attr('filter',null);
			}
			bc.selectedBatch = batch;
			d3.select('#id'+batch.id)
				.attr('filter', 'url(#highlight)');
		};

            // determines if input table row needs the selectedBatch class
        bc.selectedBatchRow = function(batch){
            if (bc.selectedBatch) {
                if (batch.id == bc.selectedBatch.id) {
                    return "selectedBatch";
                }
            }
        };

            // resets form
        bc.resetForm = function(){
            console.log("  (BC)  Restting form.");
            bc.batchesSelected = [];
            bc.changeState( "create", null );
        };

            // table checkbox functions
              // toggle all
        bc.toggleAll = function(){

            if ( bc.batchesSelected.length == bc.batches.length ) {
                bc.batchesSelected = [];
            } else {
                bc.batchesSelected = bc.batches;
            }
        };
              // check if all are selected
        bc.allSelected = function(){
            return bc.batchesSelected.length == bc.batches.length;
        }

              // checks box if batch is in batchesSelected list
        bc.exists = function(batch){
            return bc.batchesSelected.indexOf( batch ) > -1;
        };

              // adds/removes batch from batchesSelected list
        bc.toggle = function(batch){

            var idx = bc.batchesSelected.indexOf(batch);
            if (idx == -1) {
                bc.batchesSelected.push(batch);
            } else {
                bc.batchesSelected.splice( idx, 1 );
            }
        };

            // repull batches
        bc.repull = function(){
            bc.batchesSelected = [];
            bc.changeState( "create", null );
            batchService.getAll( function(response) {
                console.log("  (BC)  Retrieving all batches.")
                bc.batches = response;
                $scope.$broadcast("repullTimeline");
            }, function(error) {
                console.log("  (BC)  Failed to retrieve all batches with error:", error.data.message);
                bc.showToast( "Could not fetch batches.");
            });
        };

            // batch table button functions
              // edit batch
        bc.edit = function( batch ){
            bc.changeState( "edit", batch );
        };

              // clone batch
        bc.clone = function( batch ){
            bc.changeState( "clone", batch );
        };

              // delete single batch
        bc.delete = function( batch ){
            batchService.delete( batch, function(){
                bc.showToast("Batch deleted.");
                bc.repull();
            }, function(error){
                console.log("  (BC)  Failed to delete batch.");
                bc.showToast("Failed to delete batch.");
            });
        };

              // delete multiple batches
        bc.deleteMultiple = function(){
            
            bc.batches = undefined;
            var delList = bc.batchesSelected;
            bc.deleteMultipleHelper(delList);
        };

            // recursively deletes the first entry in bc.batchesSelected until it is empty
        bc.deleteMultipleHelper = function( delList ){
            
            if (delList.length == 0) {
                bc.showToast("Batches deleted.");
                bc.repull();
                return true;
            }

            var first = delList.shift();
            batchService.delete( first, function(){
                return bc.deleteMultipleHelper(delList);
            }, function(error){
                console.log("  (BC)  Failed to delete batches with error:", error.data.message);
                bc.showToast("Failed to delete batches.");
                return false;
            });
        };

            // saves/updates batch
        bc.saveBatch = function(isValid){
            
            if (isValid) {
                switch(bc.state) {
                    case "create":
                        batchService.create( bc.batch, function(response){
                            bc.showToast("Batch saved.");
                            bc.repull();
                        }, function(error){
                            console.log("  (BC)  Failed to save batch with error:", error.data.message);
                            bc.showToast("Failed to save batch.");
                        });
                        break;
                    
                    case "edit":
                        batchService.update( bc.batch, function(response){
                            bc.showToast("Batch updated.");
                            bc.repull();
                        }, function(error){
                            console.log("  (BC)  Failed to update batch with error:", error.data.message);
                            bc.showToast("Failed to update batch.");
                        });
                        break;
                    
                    case "clone":
                        bc.batch.id = undefined;
                        batchService.create( bc.batch, function(response){
                            bc.showToast("Batch cloned.");
                            bc.repull();
                        }, function(error){
                            console.log("  (BC)  Failed to clone batch with error:", error.data.message);
                            bc.showToast("Failed to clone batch.");
                        });
                        break;
                    
                    default:
                        break;
                }
            } else {
                bc.showToast("Batch form is incomplete.");
            }
        };

          // data
        bc.weeksSpan = "spans 0 weeks";
        bc.batchOrder = "startDate";

        bc.batch = batchService.getEmptyBatch();
        
        bc.batchesSelected = [];

            // state information
        bc.state = "create";
        bc.stateMux = { "create": { "header": "Create new batch",
                                    "submit": "Create new batch" },
                        "edit"  : { "header": "Edit batch",
                                    "submit": "Save changes" },
                        "clone" : { "header": "Create clone",
                                    "submit": "Save clone" } };

          // page initialization
            // data gathering
        batchService.getAll( function(response) {
            console.log("  (BC)  Retrieving all batches.");
            bc.batches = response;
        }, function(error) {
            console.log("  (BC)  Failed to retrieve all batches with error:", error.data.message);
            bc.showToast( "Could not fetch batches.");
        });

        curriculumService.getAll( function(response) {
            console.log("  (BC)  Retrieving all curricula.");
            bc.curricula = response;
        }, function(error) {
            console.log("  (BC)  Failed to retrieve all curricula with error:", error.data.message);
            bc.showToast( "Could not fetch curricula.");
        });

        // skillService.getAll( function(response) {
        //     console.log("  (BC)  Retrieving all skills.");
        //     bc.skills = response;
        // }, function(error) {
        //     console.log("  (BC)  Failed to retrieve all skills with error:", error.data.message);
            // bc.showToast( "Could not fetch skills.");
        // });

        trainerService.getAll( function(response) {
            console.log("  (BC)  Retrieving all trainers.");
            bc.trainers = response;
        }, function(error) {
            console.log("  (BC)  Failed to retrieve all trainers with error:", error.data.message);
            bc.showToast( "Could not fetch trainers.");
        });

        locationService.getAll( function(response) {
            console.log("  (BC)  Retrieving all locations.");
            bc.locations = response;
            bc.batch.location = bc.findHQ();
        }, function(error) {
            console.log("  (BC)  Failed to retrieve all locations with error:", error.data.message);
            bc.showToast( "Could not fetch locations.");
        });

    });