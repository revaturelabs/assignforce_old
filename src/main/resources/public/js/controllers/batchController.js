    var assignforce = angular.module( "batchApp" );

    assignforce.controller( "batchCtrl", function($scope, batchService, curriculumService, trainerService, locationService, buildingService, roomService, calendarService, $filter, $window) {
        var bc = this;
        var availableTrainers;
        
        bc.convertUnavailability = function(incoming){
        	return new Date(incoming);
        }

        /*******************************************************************/
        
          // functions
        bc.showToast = function( message ){
            $scope.$parent.aCtrl.showToast( message );
        };

        /*******************************************************************/
        
            // changes form state and populates fields if need-be
        bc.changeState = function( newState, incomingBatch ){ 
            bc.state = newState;

            if (newState == "create") {
                bc.batch = batchService.getEmptyBatch();
                bc.batch.location = bc.findHQ();                
            } else {

                bc.batch.id         = (bc.state == "edit")       ? incomingBatch.id                  : undefined;

                bc.batch.name       = incomingBatch.name;
                bc.batch.curriculum = (incomingBatch.curriculum) ? incomingBatch.curriculum.id       : undefined;               
                
                //bc.batch.location   = (incomingBatch.location)   ? incomingBatch.location.id		 : undefined;
                bc.batch.room       = (incomingBatch.room)       ? incomingBatch.room.roomID         : undefined;
                //if (bc.batch.room) {bc.batch.building	= (incomingBatch.room.building)	 ? incomingBatch.room.buildingID		 : undefined;}
                
                bc.batch.building = 1;
                bc.batch.location = 1;     
                
                bc.batch.startDate  = (incomingBatch.startDate)  ? new Date(incomingBatch.startDate) : undefined;
                bc.batch.endDate    = (incomingBatch.endDate)    ? new Date(incomingBatch.endDate)   : undefined;
                
                if (bc.batch.room.unavailability){
                bc.batch.room.unavailability.startDate = (incomingBatch.startDate) ? incomingBatch.room.unavailability.startDate : undefined;
                bc.batch.room.unavailability.endDate = (incomingBatch.endDate) ? incomingBatch.room.unavailability.endDate : undefined;
                }
                bc.batch.trainer    = (incomingBatch.trainer)    ? incomingBatch.trainer.trainerID   : undefined;
                bc.batch.cotrainer  = (incomingBatch.cotrainer)  ? incomingBatch.cotrainer.trainerID : undefined;
                
                bc.updateWeeks();
            }
        };
        
        /*******************************************************************/
        
        //Filters trainers based on available dates by calling the trainerSelection filter
        bc.updateTrainers = function(trainers, batchStart, batchEnd){
        	bc.availableTrainers = $filter('trainerSelection')(trainers, batchStart, batchEnd);
        };
                
        	// calculates the percentage to which a trainer's skills correspond
        	// to the batch's curriculum.
        bc.calcTrainerCurriculumRatio = function(trainer)
        {
    		if (angular.isUndefined(bc.selectedCurriculum) || bc.selectedCurriculum === null) { return 0; }
    		else if (bc.selectedCurriculum.skill.length == 0) { return 100; }
        	else
        	{
        		var matches = 0;
        		var total = 0;
        		
        		for (var i = 0; i < bc.selectedCurriculum.skill.length; i += 1)
        		{
        			for (var j = 0; j < trainer.skills.length; j += 1)
        			{
        				if (bc.selectedCurriculum.skill[i].id == (trainer.skills[j].id ? trainer.skills[j].id : -1))
        				{
        					matches += 1;
        					break;
        				}
        			}
        			total += 1;
        		}
        		
        		if (total > 0) { return Math.floor((matches / total) * 100); }
        		
        		return 100;
        	}
        }
        
        /*******************************************************************/
        
        bc.getSelectedCurriculum = function()
        {
    		curriculumService.getById(bc.batch.curriculum, function(response) {
                bc.selectedCurriculum = response;
            }, function(error) {
                bc.showToast( "Could not fetch curriculum.");
            });
        }

            // defaults location to Reston branch 
        bc.findHQ = function(){
            return 1;
        }
        
        /*******************************************************************/
        
        bc.findHQBuilding = function(){
        	return 1;
        }
        
        /*******************************************************************/
        
        // select end date based on start date
        bc.selectEndDate = function(){
            var startDate = new Date(bc.batch.startDate);
            bc.batch.endDate = new Date( startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 67 );
        };

        /*******************************************************************/
        
            // disables all but Mondays in start datepickers
        bc.enableMondays = function( date ){
            if (date.getDay() == 1) {
                return true;
            } else {
                return false;
            }
        };

        /*******************************************************************/
        
            // disables all but Fridays in start datepickers
        bc.enableFridays = function( date ){
            if (date.getDay() == 5) {
                return true;
            } else {
                return false;
            }
        };

        /*******************************************************************/
        
            // filters rooms based on selected location SAM
        // filterRooms should be filtered rooms based on selected building
        // This exact function should be for buildings (if there is only one building at the location, 
        // it should be automatically populated.
        bc.filterRooms = function(buildingID){
            if(buildingID != undefined){
                return bc.buildings.filter(function(building){return building.id===buildingID})[0].rooms;
            }
            else {
                return [];
            }
        };

        /*******************************************************************/
        
            // counts the number of weeks between the start and end dates
        bc.updateWeeks = function(){
            var weeks = calendarService.countWeeks( bc.batch.startDate, bc.batch.endDate );
            if (!weeks) {
                bc.weeksSpan = "spans 0 weeks";
            } else {
                bc.weeksSpan = "spans " + weeks + " weeks";
            }
        };

        /*******************************************************************/
        
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

        /*******************************************************************/
        
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

        /*******************************************************************/
        
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

		/*******************************************************************/
		
            // determines if input table row needs the selectedBatch class
        bc.selectedBatchRow = function(batch){
            if (bc.selectedBatch) {
                if (batch.id == bc.selectedBatch.id) {
                    return "selectedBatch";
                }
            }
        };

        /*******************************************************************/
        
            // resets form
        bc.resetForm = function(){
            //console.log("  (BC)  Restting form.");
            bc.batchesSelected = [];
            bc.changeState( "create", null );
        };

        /*******************************************************************/
        
            /* table checkbox functions*/
              // toggle all
        bc.toggleAll = function(){

            if ( bc.batchesSelected.length == bc.batches.length ) {
                bc.batchesSelected = [];
            } else {
                bc.batchesSelected = bc.batches;
            }
        };
        
        /*******************************************************************/
        
        // check if all are selected
        bc.allSelected = function(){
            return bc.batchesSelected.length == bc.batches.length;
        }
        
        /*******************************************************************/

              // checks box if batch is in batchesSelected list
        bc.exists = function(batch){
            return bc.batchesSelected.indexOf( batch ) > -1;
        };

        /*******************************************************************/
        
              // adds/removes batch from batchesSelected list
        bc.toggle = function(batch){

            var idx = bc.batchesSelected.indexOf(batch);
            if (idx == -1) {
                bc.batchesSelected.push(batch);
            } else {
                bc.batchesSelected.splice( idx, 1 );
            }
        };

        /*******************************************************************/
        
            // repull batches
        bc.repull = function(){
            bc.batchesSelected = [];
            bc.changeState( "create", null );
            batchService.getAll( function(response) {
                bc.batches = response;
                $scope.$broadcast("repullTimeline");
            }, function(error) {
                bc.showToast( "Could not fetch batches.");
            });
        };

        /*******************************************************************/
        
            /* batch table button functions*/
        // edit batch
        bc.edit = function( batch ){
            bc.changeState( "edit", batch );
            $window.scrollTo(0, 0);
        };

        /*******************************************************************/
        
              // clone batch
        bc.clone = function( batch ){
            bc.changeState( "clone", batch );
        };

        /*******************************************************************/
        
              // delete single batch
        bc.delete = function( batch ){
            batchService.delete( batch, function(){
                bc.showToast("Batch deleted.");
                bc.repull();
            }, function(error){
                bc.showToast("Failed to delete batch.");
            });
        };

        /*******************************************************************/
        
              // delete multiple batches
        bc.deleteMultiple = function(){
            
            bc.batches = undefined;
            var delList = bc.batchesSelected;
            bc.deleteMultipleHelper(delList);
        };

        /*******************************************************************/
        
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
                bc.showToast("Failed to delete batches.");
                return false;
            });
        };

        /*******************************************************************/
        
            // saves/updates batch
        bc.saveBatch = function(isValid){
            
            if (isValid) {
                switch(bc.state) {
                    case "create":
                        batchService.create( bc.batch, function(response){
                            bc.showToast("Batch saved.");
                            bc.repull();
                        }, function(error){
                            bc.showToast("Failed to save batch.");
                        });
                        break;
                    
                    case "edit":
                        batchService.update( bc.batch, function(response){
                            bc.showToast("Batch updated.");
                            bc.repull();
                        }, function(error){
                            bc.showToast("Failed to update batch.");
                        });
                        break;
                    
                    case "clone":
                        bc.batch.id = undefined;
                        batchService.create( bc.batch, function(response){
                            bc.showToast("Batch cloned.");
                            bc.repull();
                        }, function(error){
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

        /*******************************************************************/
        
          // data
        bc.weeksSpan = "spans 0 weeks";
        bc.batchOrder = "startDate";

        bc.batch = batchService.getEmptyBatch();
        
        bc.batchesSelected = [];
        
        bc.selectedCurriculum;

            // state information
        bc.state = "create";
        bc.stateMux = { "create": { "header": "Create new batch",
                                    "submit": "Create new batch" },
                        "edit"  : { "header": "Edit batch",
                                    "submit": "Save changes" },
                        "clone" : { "header": "Create clone",
                                    "submit": "Save clone" } };

        
        /*******************************************************************/
        /*******************************************************************/
        
        
          // page initialization
            // data gathering
        batchService.getAll( function(response) {
            bc.batches = response;
        }, function(error) {
            bc.showToast( "Could not fetch batches.");
        });

        /*******************************************************************/
        
        curriculumService.getAll( function(response) {
            bc.curricula = response;
        }, function(error) {
            bc.showToast( "Could not fetch curricula.");
        });

        /*******************************************************************/
        
        // skillService.getAll( function(response) {
        //     //console.log("  (BC)  Retrieving all skills.");
        //     bc.skills = response;
        // }, function(error) {
        //     //console.log("  (BC)  Failed to retrieve all skills with error:", error.data.message);
            // bc.showToast( "Could not fetch skills.");
        // });

        /*******************************************************************/
        
        trainerService.getAll( function(response) {
            bc.trainers = response;
        }, function(error) {
            bc.showToast( "Could not fetch trainers.");
        });

        /*******************************************************************/
        
        locationService.getAll( function(response) {
            bc.locations = response;
            bc.batch.location = bc.findHQ();
        }, function(error) {
            bc.showToast( "Could not fetch locations.");
        });
        
        /*******************************************************************/
        
        buildingService.getAll( function(response) {
            //console.log("  (HC)  Retrieving all locations.");
            bc.buildings = response;
            bc.batch.building = 1;
        }, function(error) {
            //console.log("  (HC)  Failed to retrieve all location with error", error.data.message);
            bc.showToast("Could not fetch buildings.");
        });
        roomService.getAll( function(response) {
            //console.log("  (HC)  Retrieving all rooms.");
            bc.rooms = response;
        }, function(error) {
            //console.log("  (HC)  Failed to retrieve all rooms with error", error.data.message);
            bc.showToast("Could not fetch rooms.");
        });
        
    })