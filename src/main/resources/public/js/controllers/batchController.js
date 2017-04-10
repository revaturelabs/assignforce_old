var assignforce = angular.module("batchApp");

assignforce.controller("batchCtrl", function($scope, batchService, unavailableService, curriculumService, trainerService, locationService, buildingService, roomService, settingService, calendarService, skillService, $filter, $window, $rootScope) {

    var bc = this;
    bc.trainerSkillRatios = [];
    bc.oldBatchEndDate = undefined; //used for start date validation - can probably go elsewhere
    bc.oldRoom = undefined; // Needed to update room in db when editing a batch and room changes
    bc.oldTrainer = undefined; // Needed to update room in db when editing a batch and trainer changes

    //*****Is this being used for anything?*****\\
    bc.convertUnavailability = function(incoming) {
        return new Date(incoming);
    };

    /*FUNCTIONS*/

    // This showToast is a function that comes from the parent
	bc.showToast = function(message) {
    	$scope.$parent.aCtrl.showToast(message);
	};
	
	// Changes form state and populates many variables
	bc.changeState = function(newState, incomingBatch) {
	    console.log(newState);
	    console.log(incomingBatch);
		bc.state = newState;
		if (newState == "create") {

			bc.batch = batchService.getEmptyBatch();
			bc.batch.location = bc.findHQ;
			bc.batch.building = bc.findHQBuilding;

		} else if (newState == "edit"){

			bc.batch.id = incomingBatch.id;
			bc.batch.name = incomingBatch.name;
			bc.batch.startDate = (incomingBatch.startDate) ? new Date(incomingBatch.startDate) : null;
			bc.batch.endDate = (incomingBatch.endDate) ? new Date(incomingBatch.endDate) : null;
			bc.batch.curriculum = (incomingBatch.curriculum) ? incomingBatch.curriculum.currId : null;
			bc.batch.focus = (incomingBatch.focus) ? incomingBatch.focus.currId : null;
            bc.batch.trainer = (incomingBatch.trainer) ? incomingBatch.trainer.trainerId : null;
			bc.batch.cotrainer = (incomingBatch.cotrainer) ? incomingBatch.cotrainer.trainerId : null;
            bc.batch.location = incomingBatch.location ? incomingBatch.location.id : null;
            bc.batch.building = incomingBatch.building ? incomingBatch.building.id : null;
			bc.batch.room = incomingBatch.room ? incomingBatch.room.roomID : null;

            bc.updateWeeks();

            bc.oldRoom = incomingBatch.room;
            bc.oldTrainer = incomingBatch.trainer;

            console.log(bc.batch);
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
	
	/*
	 * Remove unavailability from bc.batch.room and bc.batch.trainer
	 * (non-persistent, until update).  //** ISSUE **\\ -*Could be optimized*-
	 */
	bc.subtractUnavailabilities = function(){
		var flagPos = -1;
		if(bc.batch.room){
		    bc.batch.room.unavailabilities.forEach(function(unavailability) {
			    unavailability.startDate = new Date(unavailability.startDate);
		    	unavailability.endDate = new Date(unavailability.endDate);

	    		var checkStarts = unavailability.startDate.getDate() == bc.batch.startDate.getDate() && unavailability.startDate.getMonth() == bc.batch.startDate.getMonth() && unavailability.startDate.getFullYear() == bc.batch.startDate.getFullYear();
    			var checkEnds = unavailability.endDate.getDate() == bc.batch.endDate.getDate() && unavailability.endDate.getMonth() == bc.batch.endDate.getMonth() && unavailability.endDate.getFullYear() == bc.batch.endDate.getFullYear();

			    if (checkStarts && checkEnds) {
			    	flagPos = bc.batch.room.unavailabilities.indexOf(unavailability);
			    }
		    });
		    
			//Splice here removes 1 item at flagPos
			//Removes unavailability from loaded room (non-persistent, only when updated again)
			if (flagPos >= 0) {
				bc.batch.room.unavailabilities.splice(flagPos, 1);
				flagPos = -1;
			}
        }

		if (bc.batch.trainer) {
			// seconds * minutes * hours * milliseconds = 1 day 
			var day = 60 * 60 * 24 * 1000;

			bc.batch.trainer.unavailabilities.forEach(function(unavailability) {
				//** ISSUE **\\
				// Here, 14 is based on the arbitrary setting when the trainer's unavailability was saved
				var tempEndDate = new Date(unavailability.endDate);
				unavailability.endDate += (day * -14); //subtracting 14 days in milliseconds to avoid number-to-date conversions
				unavailability.startDate = new Date(unavailability.startDate);
				unavailability.endDate = new Date(unavailability.endDate);

				checkStarts = unavailability.startDate.getDate() == bc.batch.startDate.getDate() && unavailability.startDate.getMonth() == bc.batch.startDate.getMonth() && unavailability.startDate.getFullYear() == bc.batch.startDate.getFullYear();
				var checkEndsOne = unavailability.endDate.getDate() == bc.batch.endDate.getDate() && unavailability.endDate.getMonth() == bc.batch.endDate.getMonth() && unavailability.endDate.getFullYear() == bc.batch.endDate.getFullYear();
				var checkEndsTwo = tempEndDate.getDate() == bc.batch.endDate.getDate() && tempEndDate.getMonth() == bc.batch.endDate.getMonth() && tempEndDate.getFullYear() == bc.batch.endDate.getFullYear();

				if (checkStarts && (checkEndsOne || checkEndsTwo)) {
					flagPos = bc.batch.trainer.unavailabilities.indexOf(unavailability);
				}
			});

			if (flagPos >= 0) {
				bc.batch.trainer.unavailabilities.splice(flagPos, 1);
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
		console.log(availableTrainers);
	};
	
	bc.updateRooms = function(rooms, batchStart, batchEnd){
		bc.availableRooms = $filter('availableSelection')(rooms, batchStart, batchEnd);
		console.log(bc.availableRooms);
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

        bc.batch.skills = selectedSkills;

        console.log(bc.batch);
    };

    // Updates the batch's skills to reflect the skills list, but with the actual objects.
    bc.updateBatchSkills = function() {
		var i;
		
        var findFunction = function(a) {
            return ((a.skillId ? a.skillId : -1) == bc.selectedSkills[i]);
        };

        bc.batch.skills = [];

        for (i = 0; i < bc.selectedSkills.length; i += 1) {
            bc.batch.skills.push(bc.skills.find(findFunction))
        }
    };

    // Calculates the percentage to which a trainer's skills correspond
    // to the batch's curriculum.
    bc.calcTrainerSkillRatio = function(trainer) {
        var cur = bc.batch.skills;

        if (angular.isUndefined(cur) || cur === null) {
            return 0;
        } else if (cur.length == 0) {
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
				batchService.create(bc.batch, function() {
					bc.showToast("Batch saved.");
					bc.saveUnavailabilities();
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

			default:
				break;
			}
		}
	};

	// Saves room and trainer unavailabilities based on batch start and end dates
	bc.saveUnavailabilities = function() {
		bc.unavailability = {
				startDate : new Date(bc.batch.startDate),
				endDate : new Date(bc.batch.endDate)
			};
		
		// If was editing, bc.oldRoom is the original room, and its old
		// unavailability has disappeared and needs to be saved again
		// **  But do we need to get by id or use the room
		
		// Room is an object, trainer is a resource.  Does that matter?
		// Making sure the room exists, and an object as opposed to a number
		if (bc.oldRoom && bc.oldRoom.roomID && bc.oldRoom.roomID != bc.batch.room.roomID){
			roomService.update(bc.oldRoom, function(){
			}, function(){});
		}
		
		// Making sure the trainer exists, and an object as opposed to a number
		if (bc.oldTrainer && bc.oldTrainer.trainerId && bc.oldTrainer.trainerId != bc.batch.trainer.trainerId){
			trainerService.update(bc.oldTrainer, function(){
			}, function(){});
		}
		
		//****Do we already have room or need to get one here?****\\
		// Gets the room
		roomService.getById(bc.batch.room.roomID, function(room) {
			// Adds unavailability to room
			room.unavailabilities.push(bc.unavailability);
			// Persists unavailability to room
			roomService.update(room, function() {
				// Gets the setting for days after batch end
				// for which a trainer is unavailable
				settingService.getById(1, function(response) {
					//  Updates unavailability going into trainer
					bc.unavailability.endDate.setDate(bc.unavailability.endDate.getDate() + response.settingValue);
					bc.batch.trainer.unavailabilities.push(bc.unavailability);
					//  Persists unavailability to trainer
					trainerService.update(bc.batch.trainer, function() {
						//** ISSUE **\\-*Even though repull is called here, trainer and room list
						/* are showing just-saved batch trainers and rooms with overlapping unavailabilities.
						*  Probably has to do with how those fields are updated*-
						*/
						bc.repull();
					}, function() {
						bc.showToast("Failed to update trainer.");
					});
				}, function() {
					bc.showToast("Trainer unavailability addition not found.");
				});				
			}, function() {
                bc.showToast("Failed to update room.");
            });
		});
	};
	
	// Filters buildings based on selected location
    bc.filterBuildings = function(locationID) {
        if (locationID != undefined) {
            return bc.locations.filter(function(location) {
                return location.id === locationID})[0].buildings;
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
        if ((bc.batch.curriculum != undefined) && (bc.batch.startDate != undefined)) {
            var start = new Date(bc.batch.startDate);
            var currName;
            bc.curricula.forEach(function(curr) {
                if (curr.currId == bc.batch.curriculum) {
                    currName = curr.name;
                }
            });

            bc.batch.name = bc.nameString.replace("$c", currName);
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

    // Repull batches, trainers, and rooms
    bc.repull = function() {
        bc.batchesSelected = [];
        bc.changeState("create", null);

        batchService.getAll(function(response) {
            bc.batches = response;
            $rootScope.$broadcast("repullTimeline");
        }, function() {
            bc.showToast("Could not fetch batches.");
        });
        roomService.getAll(function(response) {
            bc.rooms = response;
        }, function() {
            bc.showToast("Could not fetch rooms.");
        });
        trainerService.getAll(function(response) {
            bc.trainers = response;
        }, function() {
            bc.showToast("Could not fetch trainers.");
        });
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

    // Subtracts unavailabilities, then persists them
    //** ISSUE **\\ -*When  both exist, repull is run twice.  Look into promises in Angular, maybe.*-
	bc.deleteUnavailabilities = function() {
		bc.subtractUnavailabilities();
		if (bc.batch.room) {
			roomService.update(bc.batch.room, function() {
				bc.showToast("Updated room.");
				bc.repull();
			}, function() {
				bc.showToast("Failed to update room.");
			});
		}
		if (bc.batch.trainer) {
			trainerService.update(bc.batch.trainer, function() {
				bc.showToast("Updated trainer.");
				bc.repull();
			}, function() {
				bc.showToast("Failed to update trainer.");
			});
		}
	};

	// Delete single batch
	bc.delete = function(batch) {
        batchService.delete(batch, function() {            
            bc.batch = batch;
            bc.batch.startDate = new Date(bc.batch.startDate);
            bc.batch.endDate = new Date(bc.batch.endDate);
            bc.deleteUnavailabilities();
            bc.showToast("Batch deleted.");
        }, function() {
            bc.showToast("Failed to delete batch.");
        });
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
        console.log(response);
    }, function() {
        bc.showToast("Could not fetch batches.");
    });

    skillService.getAll(function(response) {
        bc.skills = response;
    }, function() {
        bc.showToast("Could not fetch skills.");
    });

    curriculumService.getAll(function(response) {
        console.log(response);
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