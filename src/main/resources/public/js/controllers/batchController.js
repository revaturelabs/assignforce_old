var assignforce = angular.module("batchApp");

assignforce.controller("batchCtrl", function($scope, batchService, unavailableService, curriculumService, trainerService, locationService, buildingService, roomService, settingService, calendarService, skillService, $filter, $window, $rootScope) {

    var bc = this;
    bc.trainerSkillRatios = [];
    bc.oldBatchEndDate; //used for start date validation - can probably go elsewhere

    //*****Is this being used for anything?*****\\
    bc.convertUnavailability = function(incoming) {
        return new Date(incoming);
    }

    /*FUNCTIONS*/

    // This showToast is a function that comes from the parent
    bc.showToast = function(message) {
        $scope.$parent.aCtrl.showToast(message);
    }

    // Changes form state and populates many variables
    bc.changeState = function(newState, incomingBatch) {
        bc.state = newState;
        if (newState == "create") {
            bc.batch = batchService.getEmptyBatch();
            bc.batch.location = bc.findHQ;
            bc.batch.building = bc.findHQBuilding;
        } else {

            bc.batch.id = (bc.state == "edit") ? incomingBatch.id : undefined;

            bc.batch.name = incomingBatch.name;
            bc.batch.startDate = (incomingBatch.startDate) ? new Date(incomingBatch.startDate) : undefined;
            bc.batch.endDate = (incomingBatch.endDate) ? new Date(incomingBatch.endDate) : undefined;

            // Many values below need to be saved as numbers here, so that the corresponding
            // fields are actually populated
            bc.batch.curriculum = (incomingBatch.curriculum) ? incomingBatch.curriculum.currId : undefined;
            bc.batch.focus = (incomingBatch.focus) ? incomingBatch.focus.currId : undefined;
            bc.batch.cotrainer = (incomingBatch.cotrainer) ? incomingBatch.cotrainer.trainerId : undefined;

            // Getting room object
            bc.batch.room = (incomingBatch.room) ? incomingBatch.room : undefined;
            if (bc.batch.room) {
                // Getting building object
                bc.batch.building = incomingBatch.room.building;

                // Getting location based on building info
                buildingService.getById(bc.batch.building, function(response) {
                    // Setting both to numbers, room is still an object
                    bc.batch.location = response.location;
                }, function() {
                	bc.showToast("Failed to fatch batch's building.");
                });
            }

            // Getting trainer object
            bc.batch.trainer = (incomingBatch.trainer) ? incomingBatch.trainer : undefined;


            // Resetting to numbers to populate fields
            var position = -1;
            if (incomingBatch.trainer) {
                bc.trainers.forEach(function(trainer) {
                    if (trainer.trainerId == incomingBatch.trainer.trainerId) {
                        bc.batch.trainer = trainer;
                        position = bc.trainers.indexOf(trainer);
                    }
                });
                bc.trainers.splice(position, 1);
            }
            position = -1;
            var tempBuilding;
            if (incomingBatch.room) {
                bc.buildings.forEach(function(building) {
                    building.rooms.forEach(function(room) {
                        if (room.roomID == incomingBatch.room.roomID) {
                            tempBuilding = building;
                            bc.batch.room = room;
                            position = building.rooms.indexOf(room);
                        }
                    }, function() {});

                }, function() {});
                tempBuilding.rooms.splice(position, 1);
            }
            bc.subtractUnavailabilities();
            bc.trainers.push(bc.batch.trainer);
            tempBuilding.rooms.push(bc.batch.room);
            bc.batch.room = bc.batch.room.roomID;
            bc.updateTrainersAndRooms(bc.trainers, bc.filterRooms(bc.batch.building), bc.batch.startDate, bc.batch.endDate);
            bc.batch.trainer = bc.batch.trainer.trainerId;
            bc.selectedSkills = [];
            if (incomingBatch.skills) {
                for (var i = 0; i < incomingBatch.skills.length; i += 1) {
                    bc.selectedSkills.push(incomingBatch.skills[i].skillId);
                }
                bc.oldBatchEndDate = new Date(bc.batch.endDate);
                bc.updateWeeks();
            }
        }
    }

    //Filters trainers based on available dates by calling the trainerSelection filter
    bc.updateTrainersAndRooms = function(trainers, rooms, batchStart, batchEnd) {
        bc.availableRooms = $filter('availableSelection')(rooms, batchStart, batchEnd);

        //Should add time after batch end for which time a trainer is unavailable.
        //In the example we were given, a trainer will basically have
        //two weeks off after a batch ends.
        /*Might need a little polishing... Does this add time to trainer's unavailability time
         * (which it should) or does this add time to the end of the batch??
         */
        settingService.getById(1, function(response) {
            batchEnd.setDate(batchEnd.getDate() + response.settingValue);
            bc.availableTrainers = $filter('availableSelection')(trainers, batchStart, batchEnd);
        }, function() {
            bc.showToast("Building default not found");
        });
    }
    
    /*
     * Remove unavailability from bc.batch.room and bc.batch.trainer
     * (non-persistent, until update)
     */
    bc.subtractUnavailabilities = function() {
        var flagPos = -1;
        
        if (bc.batch.room)
        {
            bc.batch.room.unavailabilities.forEach(function(unavailability) {
                unavailability.startDate = new Date(unavailability.startDate);
                unavailability.endDate = new Date(unavailability.endDate);

                var checkStarts = unavailability.startDate.getDate() == bc.batch.startDate.getDate() && unavailability.startDate.getMonth() == bc.batch.startDate.getMonth() && unavailability.startDate.getFullYear() == bc.batch.startDate.getFullYear();
                var checkEnds = unavailability.endDate.getDate() == bc.batch.endDate.getDate() && unavailability.endDate.getMonth() == bc.batch.endDate.getMonth() && unavailability.endDate.getFullYear() == bc.batch.endDate.getFullYear();

                if (checkStarts && checkEnds) {
                    flagPos = bc.batch.room.unavailabilities.indexOf(unavailability);
                }
            });
        }

        //Splice here removes 1 item at flagPos
        //Removes unavailability from loaded room (non-persistent, only when updated again)
        if (flagPos >= 0) {
            bc.batch.room.unavailabilities.splice(flagPos, 1);
            flagPos = -1;
        }

        // seconds * minutes * hours * milliseconds = 1 day
        var day = 60 * 60 * 24 * 1000;

        bc.batch.trainer.unavailabilities.forEach(function(unavailability) {
            //** ISSUE **\\
            // Here, 14 is based on the arbitrary setting when the trainer's unavailability was saved
            var tempEndDate = new Date(unavailability.endDate);
            unavailability.endDate += (day * -14); //subtracting 14 days in milliseconds to avoid number-to-date conversions
            unavailability.startDate = new Date(unavailability.startDate);
            unavailability.endDate = new Date(unavailability.endDate);

            var checkStarts = unavailability.startDate.getDate() == bc.batch.startDate.getDate() && unavailability.startDate.getMonth() == bc.batch.startDate.getMonth() && unavailability.startDate.getFullYear() == bc.batch.startDate.getFullYear();
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

    // Ensures the batch end date can't be set before the start date.
    bc.validateBatchEndDate = function() {
        if (bc.batch.startDate && bc.batch.endDate <= bc.batch.startDate) {
            bc.batch.endDate = new Date(bc.oldBatchEndDate);
            bc.showToast("Batch's end date cannot be less than or equal to the batch's start date!");
        } else {
            bc.oldBatchEndDate = new Date(bc.batch.endDate);
        }
    }

    // Filters trainers and rooms based on available dates
    bc.updateTrainersAndRooms = function(trainers, rooms, batchStart, batchEnd) {
        bc.availableRooms = $filter('availableSelection')(rooms, batchStart, batchEnd);
        bc.availableTrainers = $filter('availableSelection')(trainers, batchStart, batchEnd);
    }

    // Updates list of selected skills based on curriculum and focus.
    bc.updateSelectedSkills = function() {
        bc.selectedSkills = [];
        var i;

        var cur = bc.curricula.find(function(a) {
            return ((a.currId ? a.currId : -1) == bc.batch.curriculum);
        });

        var foc = bc.foci.find(function(a) {
            return ((a.currId ? a.currId : -1) == bc.batch.focus);
        });

        if (cur) {
            for (i = 0; i < cur.skills.length; i += 1) {
                bc.selectedSkills.push(cur.skills[i].skillId);
            }
        }

        if (foc) {
            for (i = 0; i < foc.skills.length; i += 1) {
                bc.selectedSkills.push(foc.skills[i].skillId);
            }
        }

        bc.updateBatchSkills();
    }

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
    }

    // Calculates the percentage to which a trainer's skills correspond
    // to the batch's curriculum.
    bc.calcTrainerSkillRatio = function(trainer) {
        var cur = bc.selectedSkills;

        if (angular.isUndefined(cur) || cur === null) {
            return 0;
        } else if (cur.length == 0) {
            return 100;
        }

        var matches = 0;
        var total = 0;

        for (var i = 0; i < cur.length; i += 1) {
            for (var j = 0; j < trainer.skills.length; j += 1) {
                if (cur[i] == (trainer.skills[j] ? trainer.skills[j].skillId : -1)) {
                    matches++;
                    break;
                }
            }

            total++;
        }

        if (total > 0) {
            return Math.floor((matches / total) * 100);
        }

        return 100;
    }

    // Defaults location based on setting
    settingService.getById(3, function(response) {
        bc.findHQ = response.settingValue;
    }, function() {
        bc.showToast("Location default not found");
    });

    // Defaults building based on setting
    settingService.getById(9, function(response) {
        bc.findHQBuilding = response.settingValue;
    }, function() {
        bc.showToast("Building default not found");
    });

    // Defaults batch naming convention based on setting
    settingService.getById(23, function(response) {
        bc.nameString = response.settingName;
    }, function() {
        bc.nameString = "$c ($m/$d)"; //This is used in case setting not found
        bc.showToast("Batch name default not found");
    });

    // Select end date based on start date
    bc.selectEndDate = function() {
        var startDate = new Date(bc.batch.startDate);
        bc.batch.endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 67); //+67 is plus 10 weeks minus a weekend
        bc.oldBatchEndDate = new Date(bc.batch.endDate);
    }

    // Recalculates skill ratios for trainers based on the selected curriculum.
    bc.updateSkillRatios = function() {
        bc.trainers.forEach(function(t) {
            bc.trainerSkillRatios[t.trainerId] = bc.calcTrainerSkillRatio(t);
        });
    }

    // Disables all but Mondays in start datepickers
    bc.enableMondays = function(date) {
        return date.getDay() == 1;
    }

    // Disables all but Fridays in start datepickers
    bc.enableFridays = function(date) {
        return date.getDay() == 5;
    }

    // Saves/updates batch
    bc.saveBatch = function(isValid) {
        if (isValid) {
            switch (bc.state) {
                case "create":
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
    }

    // Saves room and trainer unavailabilities based on batch start and end dates
    bc.saveUnavailabilities = function() {
        bc.unavailability = {
            startDate: new Date(bc.batch.startDate),
            endDate: new Date(bc.batch.endDate)
        };
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
                        bc.repull();
                    }, function() {

                    });
                }, function() {
                    bc.showToast("Trainer unavailability addition not found.");
                });
                // Updates everything on-screen with newly persisted information.
            }, function() {});
        });
    }

    // Filters buildings based on selected location
    bc.filterBuildings = function(locationID) {
        if (locationID != undefined) {
            return bc.locations.filter(function(location) {
                return location.id === locationID
            })[0].buildings;
        }
    }

    // Filters rooms based on selected building
    bc.filterRooms = function(buildingID) {
        if (buildingID != undefined) {
            return bc.buildings.filter(function(building) {
                return building.id === buildingID
            })[0].rooms;
        } else {
            return [];
        }
    }

    // Counts the number of weeks between the start and end dates
    bc.updateWeeks = function() {
        var weeks = calendarService.countWeeks(bc.batch.startDate, bc.batch.endDate);
        if (!weeks) {
            bc.weeksSpan = "Spans 0 Weeks";
        } else {
            bc.weeksSpan = "Spans " + weeks + " Weeks";
        }
    }

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
    }

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
    }

    // Highlights batches whose matching bar was clicked on the timeline
    bc.highlightBatch = function(batch) {
        if (bc.selectedBatch !== undefined) {
            d3.select('#id' + bc.selectedBatch.id)
                .attr('filter', null);
        }
        bc.selectedBatch = batch;
        d3.select('#id' + batch.id)
            .attr('filter', 'url(#highlight)');
    }

    //****Input table row?? Returns a string?****\\
    // Determines if input table row needs the selectedBatch class
    bc.selectedBatchRow = function(batch) {
        if (bc.selectedBatch && batch.id == bc.selectedBatch.id) {
            return "selectedBatch";
        }
    }

    // Resets form
    bc.resetForm = function() {
        bc.batchesSelected = [];
        bc.changeState("create", null);
    }

    /* Table checkbox functions */
    //****Does this still function?****\\
    bc.toggleAll = function() {

        if (bc.batchesSelected.length == bc.batches.length) {
            bc.batchesSelected = [];
        } else {
            bc.batchesSelected = bc.batches;
        }
    }

    // Check if all are selected
    bc.allSelected = function() {
        return bc.batchesSelected.length == bc.batches.length;
    }

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
    }

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
    }

    /* Batch table button functions */
    // Edit batch
    bc.edit = function(batch) {
        bc.changeState("edit", batch);
        $window.scrollTo(0, 0);
    }

    // Clone batch
    bc.clone = function(batch) {
        bc.changeState("clone", batch);
        bc.updateTrainersAndRooms(bc.trainers, bc.filterRooms(bc.batch.building), bc.batch.startDate, bc.batch.endDate);
        $window.scrollTo(0, 0);
    }

    bc.deleteUnavailabilities = function() {
        bc.subtractUnavailabilities();
        roomService.update(bc.batch.room, function() {
        	bc.showToast("Updated room.");
        }, function() {
        	bc.showToast("Failed to update room.");
        });
        trainerService.update(bc.batch.trainer, function() {
        	bc.showToast("Updated trainer.");
        	bc.repull();
        }, function() {
        	bc.showToast("Failed to update trainer.");
        });
    }

    // Delete single batch
    bc.delete = function(batch) {
        batchService.delete(batch, function() {
            bc.batch = batch;
            bc.deleteUnavailabilities();
            bc.showToast("Batch deleted.");
        }, function() {
            bc.showToast("Failed to delete batch.");
        });
    }

    // Delete multiple batches
    bc.deleteMultiple = function() {
        bc.batches = undefined;
        var delList = bc.batchesSelected;
        bc.deleteMultipleHelper(delList);
    }

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
        bc.batch.location = bc.findHQ;
    }, function() {
        bc.showToast("Could not fetch locations.");
    });

    buildingService.getAll(function(response) {
        bc.buildings = response;
        bc.batch.building = bc.findHQBuilding;
    }, function() {
        bc.showToast("Could not fetch buildings.");
    });

    roomService.getAll(function(response) {
        bc.rooms = response;
    }, function() {
        bc.showToast("Could not fetch rooms.");
    });

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
