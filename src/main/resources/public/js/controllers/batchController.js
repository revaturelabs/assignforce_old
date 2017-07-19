var assignforce = angular.module("batchApp");

assignforce.controller("batchCtrl", function($scope, batchService, unavailableService, curriculumService, trainerService, locationService, buildingService, roomService, settingService, calendarService, skillService, $filter, $window, $rootScope, $mdDialog) {

    var bc = this;
    bc.trainerSkillRatios = {};
    bc.trainerAvalRatios = {};
    bc.roomAvalRatios = {};
    bc.settings = {};

    $scope.isManager = false;

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
            bc.batch.location = bc.settings.defaultLocation;
            bc.batch.building = bc.settings.defaultBuilding;
            bc.updateRoomAvalRatios();

		} else if (newState == "edit"){

		    bc.batch = batchService.getEmptyBatch();
		    
			bc.batch.id = incomingBatch.id;
			bc.batch.name = incomingBatch.name;
			bc.batch.startDate = incomingBatch.startDate ? new Date(incomingBatch.startDate) : undefined;
			bc.batch.endDate = incomingBatch.endDate ? new Date(incomingBatch.endDate) : undefined;
			bc.batch.curriculum = incomingBatch.curriculum ? incomingBatch.curriculum.currId : undefined;
			bc.batch.focus = incomingBatch.focus ? incomingBatch.focus.currId : undefined;
			bc.batch.trainer = incomingBatch.trainer ? incomingBatch.trainer.trainerId : undefined;
            bc.batch.cotrainer = incomingBatch.cotrainer ? incomingBatch.cotrainer.trainerId : undefined;
            bc.batch.location = incomingBatch.batchLocation ? incomingBatch.batchLocation.locationId : undefined;
            bc.batch.building = incomingBatch.batchLocation ? incomingBatch.batchLocation.buildingId : undefined;
            bc.batch.room = incomingBatch.batchLocation ? incomingBatch.batchLocation.roomId : undefined;
            if(incomingBatch.skills){
            	bc.selectedSkills = incomingBatch.skills.map(function(skill){
                    return skill.skillId;
                });
            }
            else {
            	bc.selectedSkills = [];
            }
            
            bc.updateSkillRatios();
            bc.updateWeeks();
            bc.updateRoomAvalRatios();
            bc.updateTrainerAvalRatios();
            
		} else { // If Clone
			
			bc.batch = batchService.getEmptyBatch();
			
			bc.batch.name = incomingBatch.name;
			bc.batch.startDate = (incomingBatch.startDate) ? new Date(incomingBatch.startDate) : undefined;
			bc.batch.endDate = (incomingBatch.endDate) ? new Date(incomingBatch.endDate) : undefined;
			
			// Many values below need to be saved as numbers here, so that the corresponding
			// fields are actually populated
			bc.batch.curriculum = (incomingBatch.curriculum) ? incomingBatch.curriculum.currId : undefined;
			bc.batch.focus = (incomingBatch.focus) ? incomingBatch.focus.currId : undefined;
			bc.batch.trainer = incomingBatch.trainer ? incomingBatch.trainer.trainerId : undefined;
			bc.batch.cotrainer = (incomingBatch.cotrainer) ? incomingBatch.cotrainer.trainerId : undefined;

			bc.batch.location = incomingBatch.batchLocation ? incomingBatch.batchLocation.locationId : undefined;
			bc.batch.building = incomingBatch.batchLocation ? incomingBatch.batchLocation.buildingId : undefined;
            bc.batch.room = incomingBatch.batchLocation ? incomingBatch.batchLocation.roomId : undefined;

            if(incomingBatch.skills){
            	bc.selectedSkills = incomingBatch.skills.map(function(skill){
                    return skill.skillId;
                });
            }
            else {
            	bc.selectedSkills = [];
            }
            
            bc.updateSkillRatios();
            bc.updateWeeks();
            bc.updateRoomAvalRatios();
            bc.updateTrainerAvalRatios();
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

    bc.updateRoomAvalRatios = function(){
        var rooms = bc.filterRooms(bc.batch.location, bc.batch.building);
        rooms.forEach(function(r){
            bc.roomAvalRatios[r.roomID]= bc.calcRoomAvalibilityRatio(r);
        });
    };

    bc.updateTrainerAvalRatios = function(){
       bc.trainers.forEach(function(t) {
            bc.trainerAvalRatios[t.trainerId] = bc.calcTrainerAvalibilityRatio(t);
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
					bc.repull();
					bc.resetForm();
                    bc.showToast("Batch saved.");
				}, function() {
					bc.showToast("Failed to save batch.");
				});
				break;

			case "edit":
				batchService.update(bc.batch, function() {
					bc.repull();
					bc.resetForm();
					bc.showToast("Batch updated.");
				}, function() {
					bc.showToast("Failed to update batch.");
				});
				break;

			case "clone":
				batchService.create(bc.batch, function() {
					bc.repull();
					bc.resetForm();
					bc.showToast("Batch cloned.");
				}, function() {
					bc.showToast("Failed to clone batch.");
				});
				break;
			}
		}
	};
	
	// Filters buildings based on selected location
    bc.filterBuildings = function(locationId) {
        if (locationId && bc.locations) {
            return bc.locations.find(function(location) {
                return location.id === locationId;
            }).buildings;
        }
        else {
        	return [];
        }
    };

    // Filters rooms based on selected building
    bc.filterRooms = function(locationId, buildingId) {
        if (locationId && buildingId && bc.locations) {
        	var buildings = bc.locations.find(function(location) {
                return location.id === locationId;
            }).buildings;
        	return buildings.find(function(building){
        		return building.id === buildingId;
        	}).rooms;
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

            settingService.getSettingByName('defaultNamePattern', function(setting){
                bc.batch.name = setting;

                bc.batch.name = bc.batch.name.replace("$c", currName);

                var day = start.getDate();
                if(day < 10){
                    day = "0" + day;
                }
                bc.batch.name = bc.batch.name.replace("$d", day);

                var month = start.getMonth() + 1;
                if(month < 10){
                    month = "0" + month;
                }
                bc.batch.name = bc.batch.name.replace("$m", month);

                bc.batch.name = bc.batch.name.replace("$y", start.getFullYear().toString().substr(-2));
                bc.batch.name = bc.batch.name.replace("$mmm", start.toLocaleString("en-us", {month: "short"}));

            }, null)

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
        bc.selectedSkills = [];
        $scope.batchForm.$setPristine();
        $scope.batchForm.$setUntouched();
        bc.changeState("create");
        bc.updateWeeks();
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

    
    bc.repull = function() {
    	
    	batchService.getAll(function(response) {
            bc.batches = response;
        }, function() {
            bc.showToast("Could not fetch batches.");
        });
    	
    	trainerService.getAll(function(response) {
            bc.trainers = response;
        }, function() {
            bc.showToast("Could not fetch trainers.");
        });
    	
    	locationService.getAll(function(response) {
            bc.locations = response;
        }, function() {
            bc.showToast("Could not fetch locations.");
        });
    	
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
        batchService.delete(batch, function() {
        	bc.repull();
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

    bc.sync = function(batch){
        $mdDialog.show({
            templateUrl: "html/templates/dialogs/batchSyncDialog.html",
            controller: "batchSyncCtrl",
            controllerAs: "bsCtrl",
            locals: {
              afb: batch
            },
            bindToController: true,
            clickOutsideToClose: true
        }).then(function(){
            bc.showToast("Batch synced.")
            bc.repull();
        },function(){
            bc.showToast("Failed to sync batch.")
            bc.repull();
        })
    }

    bc.pullSF = function(){
        $mdDialog.show({
        }).then(function(){
            bc.showToast("Batches synced.");
            bc.repull();
        },function(){
            bc.showToast("Failed to sync batches.")
            bc.repull();
        })
    }

    bc.syncColor = function(batch){
        return {"background-color":"red"};
    }
    //calculates the presentage of time that a room is available for use
    bc.calcRoomAvalibilityRatio = function(room){
        var sd = new Date(bc.batch.startDate);
        var ed = new Date(bc.batch.endDate);
        var unavailable = room.unavailabilities;
        var counter = 0;
        var One_day = 1000 * 60 * 60 * 24;
        var dif_mils = Math.abs(ed - sd);
        var dayCount = Math.round(dif_mils/One_day);
        if (sd == null || ed == null){
            return 100;
        }else if (ed-sd == 0){
            return 100;
        };
         if (unavailable != null) {
            for (var j=0; j < unavailable.length; j++){
                var Rsd = new Date(unavailable[j].startDate);
                var Red = new Date(unavailable[j].endDate);
                var curDay = new Date(Rsd.getFullYear(), Rsd.getMonth(), Rsd.getDate() + 1);
                for (var i = 0; i < dayCount; i++){
                    if (curDay >= sd && curDay < ed){
                        counter++;
                    };
                    curDay = new Date(curDay.getFullYear(), curDay.getMonth(), curDay.getDate() +1);
                    if (!(curDay >= Rsd && curDay < Red)){
                        break;
                    };
                };
            };
        }else{
            return 100;
        }
        return 100- (Math.floor((counter/dayCount)*100));
    }

//calculates the presentage of time that a trainer is available for use
    bc.calcTrainerAvalibilityRatio = function(trainer){
        var sd = new Date(bc.batch.startDate);
        var ed = new Date(bc.batch.endDate);
        var unavailable = trainer.unavailabilities;
        console.log(unavailable);
        var counter = 0;
        var One_day = 1000 * 60 * 60 * 24;
        var dif_mils = Math.abs(ed - sd);
        var dayCount = Math.round(dif_mils/One_day);
        if (sd == null || ed == null){
            return 100;
        }else if (ed-sd == 0){
            return 100;
        };
         if (unavailable != null) {
            for (var j=0; j < unavailable.length; j++){
                var Rsd = new Date(unavailable[j].startDate);
                var Red = new Date(unavailable[j].endDate);
                var curDay = new Date(Rsd.getFullYear(), Rsd.getMonth(), Rsd.getDate() + 1);
                for (var i = 0; i < dayCount; i++){
                    if (curDay >= sd && curDay < ed){
                        counter++;
                    };
                    curDay = new Date(curDay.getFullYear(), curDay.getMonth(), curDay.getDate() +1);
                    if (!(curDay >= Rsd && curDay < Red)){
                        break;
                    };
                };
            };
        }else{
            return 100;
        }
        return 100- (Math.floor((counter/dayCount)*100));
    }


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
    }, function() {
        bc.showToast("Could not fetch locations.");
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

    settingService.getGlobal(function(response){
        bc.settings = response;
        bc.changeState("create")

    }, function(){
        bc.showToast("Could not load settings")
    });

});