var assignforce = angular.module("batchApp");

assignforce.controller("batchCtrl", function($scope, batchService, unavailableService, curriculumService, trainerService, locationService, buildingService, roomService, settingService, calendarService, skillService, $filter, $window, $rootScope) {

    var bc = this;
    bc.trainerSkillRatios = {};
    bc.oldBatchEndDate = undefined; //used for start date validation - can probably go elsewhere
    bc.oldRoom = undefined; // Needed to update room in db when editing a batch and room changes
    bc.oldTrainer = undefined; // Needed to update room in db when editing a batch and trainer changes

    /*FUNCTIONS*/

    // This showToast is a function that comes from the parent
	bc.showToast = function(message) {
    	$scope.$parent.aCtrl.showToast(message);
	};
	
	// Changes form state and populates many variables
	bc.changeState = function(newState, incomingBatch) {
		bc.state = newState;
		if (newState == "create") {

			bc.batch = batchService.getEmptyBatch();

		} else if (newState == "edit"){

		    bc.batch = batchService.getEmptyBatch();
			bc.batch.id = incomingBatch.id;
			bc.batch.name = incomingBatch.name;
			bc.batch.startDate = (incomingBatch.startDate) ? new Date(incomingBatch.startDate) : null;
			bc.batch.endDate = (incomingBatch.endDate) ? new Date(incomingBatch.endDate) : null;
			bc.batch.curriculum = (incomingBatch.curriculum) ? incomingBatch.curriculum.currId : null;
			bc.batch.focus = (incomingBatch.focus) ? incomingBatch.focus.currId : null;
            bc.batch.cotrainer = (incomingBatch.cotrainer) ? incomingBatch.cotrainer.trainerId : null;
            bc.batch.location = incomingBatch.batchLocation ? incomingBatch.batchLocation.locationId : null;
            bc.batch.building = incomingBatch.batchLocation ? incomingBatch.batchLocation.buildingId : null;
            bc.selectedSkills = incomingBatch.skills.map(function(skill){
                return skill.skillId;
            });
            bc.updateSkillRatios();
            bc.updateWeeks()
            bc.updateTrainersAndRooms(bc.trainers, bc.filterRooms(bc.batch.building), bc.batch.startDate, bc.batch.endDate);
            bc.batch.room = incomingBatch.batchLocation ? incomingBatch.batchLocation.roomId : null;
            bc.batch.trainer = (incomingBatch.trainer) ? incomingBatch.trainer.trainerId : null;



            bc.oldRoom = incomingBatch.room;
            bc.oldTrainer = incomingBatch.trainer;

		} else { // If Clone

			bc.batch.name = incomingBatch.name;
			bc.batch.startDate = (incomingBatch.startDate) ? new Date(incomingBatch.startDate) : undefined;
			bc.batch.endDate = (incomingBatch.endDate) ? new Date(incomingBatch.endDate) : undefined;
			
			// Many values below need to be saved as numbers here, so that the corresponding
			// fields are actually populated
			bc.batch.curriculum = (incomingBatch.curriculum) ? incomingBatch.curriculum.currId : undefined;
			bc.batch.focus = (incomingBatch.focus) ? incomingBatch.focus.currId : undefined;
			bc.batch.cotrainer = (incomingBatch.cotrainer) ? incomingBatch.cotrainer.trainerId : undefined;

			bc.batch.trainer = incomingBatch.trainer ? incomingBatch.trainer.trainerId : undefined;
			bc.batch.location = incomingBatch.location ? incomingBatch.location.id : undefined;
			bc.batch.building = incomingBatch.location ? incomingBatch.building.id : undefined;
            bc.batch.room = incomingBatch.room ? incomingBatch.room.roomID : undefined;
			
	        bc.updateTrainersAndRooms(bc.trainers, bc.filterRooms(bc.batch.building), bc.batch.startDate, bc.batch.endDate);

	        bc.selectedSkills = [];
			if (incomingBatch.skills) {
				for (var k = 0; k < incomingBatch.skills.length; k += 1) {
					bc.selectedSkills.push(incomingBatch.skills[k].skillId);
				}
				bc.oldBatchEndDate = new Date(bc.batch.endDate);
				bc.updateWeeks();
			}
		}
	};

	// Ensures the batch end date can't be set before the start date.
	bc.validateBatchEndDate = function() {
		if (bc.batch.startDate && bc.batch.endDate <= bc.batch.startDate) {
			bc.batch.endDate = new Date(bc.oldBatchEndDate);
			bc.showToast("Batch's end date cannot be less than or equal to the batch's start date!");
		} else {
			bc.oldBatchEndDate = new Date(bc.batch.endDate);
		}
	};

	// Filters trainers and rooms based on available dates
	bc.updateTrainersAndRooms = function(trainers, rooms, batchStart, batchEnd) {
		bc.availableRooms = $filter('availableSelection')(rooms, batchStart, batchEnd);
		bc.availableTrainers = $filter('availableSelection')(trainers, batchStart, batchEnd);
	};
	
	bc.updateRooms = function(rooms, batchStart, batchEnd){
		bc.availableRooms = $filter('availableSelection')(rooms, batchStart, batchEnd);
	};

	// Updates list of selected skills based on curriculum and focus.
	bc.updateSelectedSkills = function() {

	    var selectedSkills = [];

	    if(bc.batch.curriculum){
            var currSkills = bc.curricula.find(function(curriculum){
                return curriculum.currId === bc.batch.curriculum;
            }).skills;
            if (currSkills){
                currSkills.forEach(function(skill){
                    if(!selectedSkills.find(function(id){return skill.skillId === id})){
                        selectedSkills.push(skill.skillId);
                    }
                });
            }
        }

        if(bc.batch.focus){
            var focSkills = bc.foci.find(function(curriculum){
                return curriculum.currId === bc.batch.focus;
            }).skills;
            if (focSkills){
                focSkills.forEach(function(skill){
                    if(!selectedSkills.find(function(id){return skill.skillId === id})){
                        selectedSkills.push(skill.skillId);
                    }
                });
            }
        }

        bc.selectedSkills = selectedSkills;
    };

    // Calculates the percentage to which a trainer's skills correspond
    // to the batch's curriculum.
    bc.calcTrainerSkillRatio = function(trainer) {
        var cur = bc.selectedSkills;

        if (!cur) {
            return 0;
        } else if (cur.length === 0) {
            return 100;
        }

        var matches = 0;
        var total = 0;

        for (var i = 0; i < cur.length; i += 1) {
            for (var j = 0; j < trainer.skills.length; j += 1) {
                if (cur[i] === trainer.skills[j].skillId) {
                    matches++;
                    break;
                }
            }
            total++;
        }

        return Math.floor((matches / total) * 100);
    };

    // Select end date based on start date
    bc.selectEndDate = function() {
        var startDate = new Date(bc.batch.startDate);
        bc.batch.endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 67); //+67 is plus 10 weeks minus a weekend
        bc.oldBatchEndDate = new Date(bc.batch.endDate);
    };

    // Recalculates skill ratios for trainers based on the selected curriculum.
    bc.updateSkillRatios = function() {
        bc.trainers.forEach(function(t) {
            bc.trainerSkillRatios[t.trainerId] = bc.calcTrainerSkillRatio(t);
        });
    };

    // Disables all but Mondays in start datepickers
    bc.enableMondays = function(date) {
        return date.getDay() == 1;
    };

    // Disables all but Fridays in start datepickers
    bc.enableFridays = function(date) {
        return date.getDay() == 5;
    };

	// Saves/updates batch
	bc.saveBatch = function(isValid) {
		if (isValid) {
			switch (bc.state) {
			case "create":
				// The stack for this is:
			    /*
			     * bc.saveBatch, bc.saveUnavailabilities 
			     */
			    bc.batch.skills = bc.selectedSkills.map(function(skillId){
                    return bc.skills.find(function(s){
                        return s.skillId === skillId;
                    });
                });
				batchService.create(bc.batch, function() {
                    bc.saveUnavailabilities();
                    bc.batches.push(bc.batch);
					bc.changeState('create');
                    bc.showToast("Batch saved.");
                    bc.repull();
				}, function() {
					bc.showToast("Failed to save batch.");
				});
				break;

			case "edit":
				batchService.update(bc.batch, function() {
					bc.showToast("Batch updated.");
					bc.saveUnavailabilities();
				}, function() {
					bc.showToast("Failed to update batch.");
				});
				break;

			case "clone":
				bc.batch.id = undefined;
				batchService.create(bc.batch, function() {
					bc.showToast("Batch cloned.");
					bc.saveUnavailabilities();
				}, function() {
					bc.showToast("Failed to clone batch.");
				});
				break;
			}
		}
	};

	// Saves room and trainer unavailabilities based on batch start and end dates
	bc.saveUnavailabilities = function() {
		var unavailability = {
            startDate : new Date(bc.batch.startDate),
            endDate : new Date(bc.batch.endDate)
        };

        if(bc.batch.batchLocation.roomId){
            var roomObj = bc.rooms.find(function(room){
                return room.roomID === bc.batch.batchLocation.roomId;
            });
            roomObj.unavailabilities.push(unavailability);
            roomService.update(roomObj, function(){
                console.log('Room unavailability saved');
            }, function(){
                console.log('Room unavailability not saved');
            });
        }

        if(bc.batch.trainer){
            var trainerObj = bc.trainers.find(function(trainer){
                return trainer.trainerId === bc.batch.trainer.trainerId;
            });
            trainerObj.unavailabilities.push(unavailability);
            trainerService.update(trainerObj, function(){
                console.log('Trainer unavailability saved');
            }, function(){
                console.log('Trainer unavailability not saved');
            });
        }
	};
	
	// Filters buildings based on selected location
    bc.filterBuildings = function(locationID) {
        if (locationID) {
            return bc.locations.find(function(location) {
                return location.id === locationID}).buildings;
        }
    };

    // Filters rooms based on selected building
    bc.filterRooms = function(buildingID) {
        if (buildingID != undefined) {
            return bc.buildings.filter(function(building) {
                return building.id === buildingID})[0].rooms;
        } else {
            return [];
        }
    };

    // Counts the number of weeks between the start and end dates
    bc.updateWeeks = function() {
        var weeks = calendarService.countWeeks(bc.batch.startDate, bc.batch.endDate);
        if (!weeks) {
            bc.weeksSpan = "Spans 0 Weeks";
        } else {
            bc.weeksSpan = "Spans " + weeks + " Weeks";
        }
    };

    // Defaults batch naming convention based on setting
    bc.defaultName = function() {
        if (bc.batch.curriculum && bc.batch.startDate) {
            var start = new Date(bc.batch.startDate);
            var currName;
            bc.curricula.forEach(function(curr) {
                if (curr.currId == bc.batch.curriculum) {
                    currName = curr.name;
                }
            });
            bc.batch.name = '$c ($m/$d)';
            bc.batch.name = bc.batch.name.replace("$c", currName);
            bc.batch.name = bc.batch.name.replace("$d", start.getDate());
            bc.batch.name = bc.batch.name.replace("$m", (start.getMonth() + 1));
            bc.batch.name = bc.batch.name.replace("$y", start.getFullYear());
        }
    };

    // Outputs progress as a percent
    bc.calcProgress = function(paramLow, paramHigh) {

        if (!paramLow || !paramHigh) {
            return 0;
        }

        var today = new Date().getTime();
        var diff = paramHigh - paramLow;

        today -= paramLow;

        var percent = (today * 100 / diff).toFixed(5);
        if (percent < 0) {
            return 0;
        } else if (percent > 100) {
            return 100;
        } else {
            return (today * 100 / diff).toFixed(5);
        }
    };

    // Highlights batches whose matching bar was clicked on the timeline
    bc.highlightBatch = function(batch) {
        if (bc.selectedBatch !== undefined) {
            d3.select('#id' + bc.selectedBatch.id)
                .attr('filter', null);
        }
        bc.selectedBatch = batch;
        d3.select('#id' + batch.id)
            .attr('filter', 'url(#highlight)');
    };

    //****Input table row?? Returns a string?****\\
    // Determines if input table row needs the selectedBatch class
    bc.selectedBatchRow = function(batch) {
        if (bc.selectedBatch && batch.id == bc.selectedBatch.id) {
            return "selectedBatch";
        }
    };

    // Resets form
    bc.resetForm = function() {
        bc.batchesSelected = [];
        bc.changeState("create", null);
    };

    /* Table checkbox functions */
    //****Does this still function?****\\
    bc.toggleAll = function() {
        if (bc.batchesSelected.length == bc.batches.length) {
            bc.batchesSelected = [];
        } else {
            bc.batchesSelected = bc.batches;
        }
    };

    // Check if all are selected
    bc.allSelected = function() {
        return bc.batchesSelected.length == bc.batches.length;
    };

    // Checks box if batch is in batchesSelected list
    bc.exists = function(batch) {
        return bc.batchesSelected.indexOf(batch) > -1;
    };

    // Adds/removes batch from batchesSelected list
    bc.toggle = function(batch) {

        var idx = bc.batchesSelected.indexOf(batch);
        if (idx == -1) {
            bc.batchesSelected.push(batch);
        } else {
            bc.batchesSelected.splice(idx, 1);
        }
    };

    // Broadcast repull to timeline
    bc.repull = function() {
        $rootScope.$broadcast("repullTimeline");
    };

    /* Batch table button functions */
    // Edit batch
    bc.edit = function(batch) {
        bc.changeState("edit", batch);
        $window.scrollTo(0, 0);
    };

    // Clone batch
    bc.clone = function(batch) {
        bc.changeState("clone", batch);        
        $window.scrollTo(0, 0);
	};

    // Delete single batch
    bc.delete = function(batch) {
        var batchId = batch.id;
        var trainerId = batch.trainer.trainerId;
        var roomId = batch.batchLocation.roomId;
        var startDate = new Date(batch.startDate);
        var endDate = new Date(batch.endDate);
        batchService.delete(batch, function() {
            bc.deleteUnavailabilities(trainerId, roomId, startDate, endDate);
            var position = -1;
            bc.batches.forEach(function(batch, index){
                if(batch.id === batchId){
                    position = index;
                }
            });
            bc.batches.splice(position, 1);
            bc.showToast("Batch deleted.");
            bc.repull();
        }, function() {
            bc.showToast("Failed to delete batch.");
        });
    };

    // Subtracts unavailabilities, then persists them
	bc.deleteUnavailabilities = function(trainerId, roomId, startDate, endDate) {
		if (roomId) {
            var position = -1;
            var roomObj = bc.rooms.find(function(room){ return room.roomID === roomId});
            roomObj.unavailabilities.forEach(function(unavail, index){
                if(unavail.startDate == startDate && unavail.endDate == endDate){
                    position = index;
                }
            });
            roomObj.unavailabilities.splice(position, 1);
			roomService.update(roomObj, function() {
				console.log('Removed room unavailabilities');
			}, function() {
				console.log("Failed to remove room unavailabilities");
			});
		}
		if (trainerId) {
		    var position = -1;
            var trainerObj = bc.trainers.find(function(trainer){ return trainer.trainerId === trainerId});
            trainerObj.unavailabilities.forEach(function(unavail, index){
                if(unavail.startDate == startDate && unavail.endDate == endDate){
                    position = index;
                }
            });
            trainerObj.unavailabilities.splice(position, 1);
			trainerService.update(trainerObj, function() {
				console.log("Removed trainer unavailabilities");
			}, function() {
				console.log("Failed to remove trainer unavailabilities");
			});
		}
	};

    // Delete multiple batches /** ISSUE **\ -*Untested*-
    bc.deleteMultiple = function() {
        bc.batches = undefined;
        var delList = bc.batchesSelected;
        bc.deleteMultipleHelper(delList);
    };

    // Recursively deletes the first entry in bc.batchesSelected until it is empty
    bc.deleteMultipleHelper = function(delList) {

        if (delList.length == 0) {
            bc.showToast("Batches deleted.");
            bc.repull();
            return true;
        }

        var first = delList.shift();
        batchService.delete(first, function() {
            bc.batch = first;
            bc.subtractUnavailabilities();
            bc.saveUnavailabilities(); // Repull is in here, probably needs to come out
            return bc.deleteMultipleHelper(delList);
        }, function() {
            bc.showToast("Failed to delete batches.");
            return false;
        });
    };

    //**** DATA ****\\
    bc.weeksSpan = "Spans 0 Weeks";
    bc.batchOrder = "startDate";

    bc.batch = batchService.getEmptyBatch();

    bc.batchesSelected = [];

    bc.selectedSkills = [];

    // State information
    bc.state = "create";
    bc.stateMux = {
        "create": {
            "header": "Create New Batch",
            "submit": "Create Batch"
        },
        "edit": {
            "header": "Edit Batch",
            "submit": "Save Changes"
        },
        "clone": {
            "header": "Create Clone",
            "submit": "Save Clone"
        }
    };

    // Page initialization
    // Data gathering
    locationService.getAll(function(response) {
        bc.locations = response;
        console.log(response);
    }, function() {
        bc.showToast("Could not fetch locations.");
    });

    buildingService.getAll(function(response) {
        bc.buildings = response;
    }, function() {
        bc.showToast("Could not fetch buildings.");
    });

    roomService.getAll(function(response) {
        bc.rooms = response;
    }, function() {
        bc.showToast("Could not fetch rooms.");
    });

    // In this funky format because of time constraints and
    // we had to scrap the bi-directional relationships for the
    // POJO's due to problems in another sector
    batchService.getAll(function(response) {
        bc.batches = response;
    }, function() {
        bc.showToast("Could not fetch batches.");
    });

    skillService.getAll(function(response) {
        bc.skills = response;
    }, function() {
        bc.showToast("Could not fetch skills.");
    });

    curriculumService.getAll(function(response) {
        var temp = response;
        bc.curricula = temp.filter(function(t) {
            return (t.core);
        });
        bc.foci = temp.filter(function(t) {
            return !(t.core);
        });
    }, function() {
        bc.showToast("Could not fetch curricula.");
    });

    trainerService.getAll(function(response) {
        bc.trainers = response;
    }, function() {
        bc.showToast("Could not fetch trainers.");
    });
});