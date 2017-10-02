var assignforce = angular.module( "batchApp" );

var app = angular.module('batchApp');

/*--------------------------CONTROLLER---------------------------*/

 app.controller("TimelineCtrl", function($scope, $window, batchService, calendarService, trainerService, curriculumService, settingService, locationService, buildingService){
	
    var tlc = this;

    //For displaying toast messages.
    tlc.showToast = function( message ){
        $scope.$parent.aCtrl.showToast( message );
    };
    
    //For checking if something is undefined or null.
    tlc.isUndefinedOrNull = function(obj)
    {
    	return (angular.isUndefined(obj) || obj === null || !obj);
    }
    
    //For checking if something is a valid number or not.
    tlc.isNaN = function(obj)
    {
    	return (!angular.isNumber(obj) || isNaN(parseInt(obj)));
    }
    
    //Filter removes batches that don't have any assigned trainers.
    tlc.removeNoTrainer = function(batch) {
        return (!tlc.isUndefinedOrNull(batch.trainer));
    };
    
    //Filter removes batches that have already concluded.
    tlc.removeConcluded = function(batch) {
        return (batch.endDate > tlc.currentDate);
    };
    
    //Filter removes batches whose dates don't exist.
    tlc.removeDateless = function(batch) {
        return (!tlc.isUndefinedOrNull(batch.startDate) && !tlc.isUndefinedOrNull(batch.endDate));
    };
    
    
    //Filter removes batches whose date range fall outside the view of the timeline.
    tlc.removeOutOfDateRange = function(batch) {
    	return ((new Date(batch.startDate) <= tlc.maxDate) && (new Date(batch.endDate) >= tlc.minDate));
    };
    
    //Filter removes batches that don't have a matching curriculum to the selected view by the user.
    tlc.removeUnmatchingCurriculum = function(batch)
    {
    	return (tlc.selectedCurriculum == 0 || (!tlc.isUndefinedOrNull(batch.curriculum) && (batch.curriculum.currId == tlc.selectedCurriculum)));
    };
    
    //Filter removes batches that don't have a matching location to the selected view by the user.
    tlc.removeUnmatchingLocation = function(batch)
    {
    	return (tlc.selectedLocation == 0 || (!tlc.isUndefinedOrNull(batch.location) && (batch.location.id == tlc.selectedLocation)));
    };
    
    //Filter removes batches that don't have a matching building to the selected view by the user.
    tlc.removeUnmatchingBuilding = function(batch)
    {
    	return (tlc.selectedBuilding == 0 || (!tlc.isUndefinedOrNull(batch.building) && (batch.building.id == tlc.selectedBuilding)));
    };
    
    //Filter removes batches that don't have a matching focus to the selected view by the user.
    tlc.removeUnmatchingFocus = function(batch)
    {
    	return (tlc.selectedFocus == 0 || (!tlc.isUndefinedOrNull(batch.focus) && (batch.focus.currId == tlc.selectedFocus)));
    };
    
    //Filter removes batches who don't have any matching trainers.
    tlc.removeIrrelevantBatches = function(batch) {
		var trainerIndex = tlc.filteredTrainers.findIndex(function (d)
		{
			return (d == $scope.trainerColumnName(batch.trainer));
		});
		
        return (trainerIndex > -1);
    };
    
    //Filter removes trainers that are outside the view of the pagination.
    tlc.removeTrainersOutOfPage = function(trainer) {
		var trainerIndex = tlc.trainers.findIndex(function (d)
		{
			return (d == trainer);
		});
		
		var trainerDisplayed = (tlc.trainerListEndIndex == 0 || (trainerIndex > -1 && trainerIndex >= tlc.trainerListStartIndex && trainerIndex < tlc.trainerListEndIndex));
		
        return trainerDisplayed;
    };
    
    //Filter removes trainers that don't have any batches.
    tlc.removeBatchlessTrainers = function(trainer) {
		var trainerIndex = tlc.filteredBatches.findIndex(function (d)
		{
			return (d.trainer.trainerId == parseInt(trainer.substring(1, trainer.indexOf(')'))));
		});
		
        return (trainerIndex > -1);
    };

	//Options for datepicker
	tlc.options = {
		datepickerMode: "month",
		minMode: "month"
	};
	
	//Timeline axis range variables
	tlc.minDate;
	tlc.oldMinDate;
	tlc.maxDate;
	tlc.oldMaxDate;
	tlc.currentDate = (new Date()).getTime();

	//Timeline variables
	tlc.timelineFormatting = {};
	tlc.timelineFormatting.margin_top = 76;
	tlc.timelineFormatting.margin_right = 36;
	tlc.timelineFormatting.margin_left = 75;
	tlc.timelineFormatting.margin_bottom = 0;
	tlc.timelineFormatting.width = $window.innerWidth - tlc.timelineFormatting.margin_left - tlc.timelineFormatting.margin_right;
	tlc.timelineFormatting.height = 2000;
	tlc.timelineFormatting.xPadding = 72;
	
	tlc.selectedCurriculum = 0;
	tlc.selectedFocus = 0;
	tlc.selectedLocation = 0;
	tlc.selectedBuilding = 0;
	tlc.trainersPerPage = 0;
	tlc.realTrainersPerPage = 0;
	tlc.trainerPage = 1;
	tlc.realTrainerPage = 1;
	tlc.maxTrainerPages = 1;
	tlc.trainerListStartIndex = 0;
	tlc.trainerListEndIndex = 0;
	tlc.previousPageButtonDisabled = false;
	tlc.nextPageButtonDisabled = false;
	tlc.hideConcludedBatches = false;
	tlc.hideBatchlessTrainers = false;
	tlc.filteredTrainers;
	tlc.filteredBatches;
	
	//Ensures the start date selection is valid, and forces it to reset if not.
	tlc.validateStartDate = function()
	{
		if (tlc.minDate >= tlc.maxDate)
		{
			tlc.minDate = new Date(tlc.oldMinDate);
			tlc.showToast("Timeline:  Start date cannot be equal to or after the end date!");
		}
		else
		{
			tlc.oldMinDate = new Date(tlc.minDate);
		}
	}
	
	//Ensures the end date selection is valid, and forces it to reset if not.
	tlc.validateEndDate = function()
	{
		if (tlc.maxDate <= tlc.minDate)
		{
			tlc.maxDate = new Date(tlc.oldMaxDate);
			tlc.showToast("Timeline:  End date cannot be equal to or before the start date!");
		}
		else
		{
			tlc.oldMaxDate = new Date(tlc.maxDate);
		}
	}

	//Set the min and max dates based on the batches.
	//Also grabs the length of the longest trainer name.
	tlc.getDateRange = function(byFilteredBatches)
	{	
		var batchList;
		
		if (byFilteredBatches)
		{
			batchList = tlc.filteredBatches;
		}
		else
		{
			batchList = tlc.batches;
		}
		
		if (!batchList || batchList.length <= 0)
		{
			return;
		}
		
		tlc.minDate = new Date(3000, 7, 0);
		tlc.oldMinDate = new Date(tlc.minDate);
		tlc.maxDate = new Date(2000, 12, 0);
		tlc.oldMaxDate = new Date(tlc.maxDate);
		
		var startDate;
		var endDate;

		for (var b in batchList)
		{
			if (!tlc.isUndefinedOrNull(batchList[b].trainer) && !tlc.isUndefinedOrNull(batchList[b].startDate) && !tlc.isUndefinedOrNull(batchList[b].endDate))
			{
				startDate = new Date(batchList[b].startDate);
				if (startDate.getTime() < tlc.minDate.getTime()) {
					tlc.minDate = startDate;
				}
				
				endDate = new Date(batchList[b].endDate);
				if (endDate.getTime() > tlc.maxDate.getTime()) {
					tlc.maxDate = endDate;
				}
			}
		}
		
		tlc.oldMinDate = new Date(tlc.minDate);
		tlc.oldMaxDate = new Date(tlc.maxDate);
	}


	//Fetches all the batches for the controller  Also attaches their location and building information if possible.
	tlc.getAllBatches = new Promise(function(resolve)
	{
	    batchService.getAll( function(response) {
	        tlc.batches = response;
	        tlc.getDateRange(false);
	        
	        tlc.batches.forEach(function(b){
	        	if (!tlc.isUndefinedOrNull(b.room))
	        	{
	        		var building = tlc.buildings.find(function(building){
	        			return (building.id == b.room.building);
	        		});
	        		
	        		if (building)
	        		{
	        			b.building = building;
	        			
		        		var location = tlc.locations.find(function(location){
		        			return (location.id == b.building.location);
		        		});
	        			
	        			if (location)
	        			{
	        				b.location = location;
	        			}
	        			else
		        		{
			        		b.location = undefined;
		        		}
	        		}
	        		else
	        		{
		        		b.building = undefined;
		        		b.location = undefined;
	        		}
	        	}
	        	else
	        	{
	        		b.building = undefined;
	        		b.location = undefined;
	        	}
	        });
	        
	        resolve(1);
	    }, function() {
	    	tlc.showToast("Timeline:  Could not fetch batches.");
	    	resolve(0);
	    });
	});
	
	//Returns the location object selected in the filter dropdown.
	tlc.getSelectedLocation = function()
	{
		var location = tlc.locations.find(function(l){
			return (l.id == tlc.selectedLocation);
		});
		
		return location;
	}


	//Fetches all the trainers for the controller.
	tlc.getAllTrainers = new Promise(function(resolve)
	{
	    trainerService.getAll( function(response) {
			tlc.trainers = response.map(function(trainer){return $scope.trainerColumnName(trainer)});

			resolve(1);
	    }, function() {
	    	tlc.showToast("Timeline:  Could not fetch trainers.");
	    	resolve(0);
	    });
	});
    
	//Fetches all the curricula for the controller.
    curriculumService.getAll( function(response) {
    	var temp = response;
    	
        tlc.curricula = temp.filter(function(t){
        	return (t.core);
        });
        
        tlc.foci = temp.filter(function(t){
        	return !(t.core);
        });
    }, function() {
    	tlc.showToast("Timeline:  Could not fetch curricula.");
    });
    
	//Fetches all the locations for the controller.
    locationService.getAll( function(response) {
        tlc.locations = response;
    }, function() {
    	tlc.showToast("Timeline:  Could not fetch locations.");
    });
    
	//Fetches all the buildings for the controller.
    buildingService.getAll( function(response) {
        tlc.buildings = response;
    }, function() {
    	tlc.showToast("Timeline:  Could not fetch buildings.");
    });

    //Fetches the default value for trainers displayed per page.
    settingService.getSettingByName("trainersPerPage", function (response) {
        tlc.trainersPerPage = response;
    }, function(){
    	tlc.showToast("Timeline:  Could not fetch setting for default trainers per page.");
    });

	//Watches for "repullTimeline" to be broadcast, such that the timeline is repulled.
	$scope.$on("repullTimeline", function(){
		tlc.repull();
	});

	// Range values for timeline in milliseconds
	var MAX_RANGE = 126140000000000; // 4000 years
	var MIN_RANGE = 1000000; // 1 minute

	// Events for the timeline
	$scope.mousedown = function(evt){
		evt.stopPropagation();

		if(evt.offsetY > tlc.timelineFormatting.margin_top && evt.offsetY < tlc.timelineFormatting.height + tlc.timelineFormatting.margin_top){

			// Initial y-coordinate of the mouse
			var init = evt.offsetY - tlc.timelineFormatting.margin_top;
			var mousedownY = init;
			var pageY = evt.pageY;

			// Get the date with respect to the y-coordinate
			var yScale = d3.time.scale()
				.domain([0,tlc.timelineFormatting.height])
				.range([tlc.minDate, tlc.maxDate]);

			var yDate = new Date(yScale(init)).getTime();
			var diff = tlc.maxDate.getTime() - tlc.minDate.getTime();
			var topFraction = (yDate - tlc.minDate.getTime()) / diff;
			var bottomFraction = 1 - topFraction; 

			// Draw the zoompoint
			tlc.projectTimeline(mousedownY);
			
			// Fire when there is a mousemove event on the #timeline element
			$(".toastContainer").mousemove(function(evt){

				// Prevent text highlighting
				evt.preventDefault();
				evt.stopPropagation();

				// Number of milliseconds between min and max date
				var millisecondRange = tlc.maxDate.getTime() - tlc.minDate.getTime();

				// Recalculate the scaling factor based on the number of milliseconds currently on the timeline
				tlc.scalingFactor = millisecondRange / 10;
				var topMilliseconds = Math.trunc(tlc.scalingFactor * topFraction);
				var bottomMilliseconds = Math.trunc(tlc.scalingFactor * bottomFraction);
				var minDateMilliseconds = new Date(tlc.minDate).getTime();
				var maxDateMilliseconds = new Date(tlc.maxDate).getTime();

			    // If the mouse moves up
			    if(pageY > evt.pageY && millisecondRange > MIN_RANGE){
			    	// Set the newly calculated min and max dates
			    	tlc.minDate = new Date(minDateMilliseconds + topMilliseconds);
			    	tlc.maxDate = new Date(maxDateMilliseconds - bottomMilliseconds);
				}
			    else if(pageY < evt.pageY && millisecondRange < MAX_RANGE) {
					tlc.minDate = new Date(minDateMilliseconds - topMilliseconds);
					tlc.maxDate = new Date(maxDateMilliseconds + bottomMilliseconds);
				}

			    tlc.projectTimeline(mousedownY);
			    
				// Update the last coordinate of the mouse
				pageY = evt.pageY;
			});
		}
	};

	$(".toastContainer").mouseup(function(evt){
		// Erase the zoompoint(or move out of view)
		tlc.projectTimeline(-100);
		// Remove mousemove listener from the container
		$(".toastContainer").off("mousemove");
		evt.stopPropagation();
	});
	

	//Promise for the repulling of the timeline.
    tlc.repullPromise = new Promise(function(resolve){
    	tlc.getAllBatches.then(function()
    	{
	    	tlc.getAllTrainers.then(function()
	    	{
	    		resolve(1);
	    	});
    	});
    });
    
    //Calls the promise immediately upon loading the page.
    tlc.repullPromise.then(function(result)
    {
    	if (result){ 
    		tlc.filterTimelineData();
    		tlc.projectTimeline(-100); 
    	}
    }, function(){
    	//error
    });
    
    //Function repulls the trainers and batches, and re-projects the timeline.
    tlc.repull = function()
    {
        tlc.repullPromise.then(function(result)
	    {
        	if (result){
        		tlc.projectTimeline(-100);
        	}
	    }, function(){
	    	//error
	    });
    };
    
    //Only re-projects the timeline.
    tlc.projectTimelineOnly = function()
    {
        tlc.projectTimeline(-100);
    }
    
    //Function to change how many trainers are displayed per page.
	tlc.changeTrainersPerPage = function(useFilteredTrainers)
	{
		var trainerList;
		
		if (useFilteredTrainers)
		{
			trainerList = tlc.filteredTrainers;
		}
		else
		{
			trainerList = tlc.trainers;
		}
		
		var numTrainers = (trainerList ? trainerList.length : 0);
		
		tlc.realTrainersPerPage = Math.floor(tlc.trainersPerPage);
		
		if (tlc.isNaN(tlc.realTrainersPerPage) || tlc.realTrainersPerPage < 0) {
			tlc.realTrainersPerPage = 0; 
		}
		
		tlc.realTrainersPerPage = Math.min(tlc.realTrainersPerPage, numTrainers);
		
		tlc.trainerListStartIndex = 0;
		
		tlc.trainerListEndIndex = Math.min(tlc.realTrainersPerPage, numTrainers);
		
		tlc.realTrainerPage = 1;
		tlc.trainerPage = tlc.realTrainerPage;
		tlc.maxTrainerPages = Math.ceil(numTrainers / tlc.realTrainersPerPage); 
		
		if (tlc.realTrainersPerPage > 0)
		{
			tlc.hideBatchlessTrainers = false;
		}
		
		tlc.previousPageButtonStatus(useFilteredTrainers);
		tlc.nextPageButtonStatus(useFilteredTrainers);
	};
	
	//Function to go to the previous trainer page.
	tlc.previousTrainerPage = function(useFilteredTrainers)
	{
		tlc.trainerListStartIndex -= tlc.realTrainersPerPage;
		tlc.trainerListEndIndex -= tlc.realTrainersPerPage;
		
		tlc.realTrainerPage -= 1;
		tlc.trainerPage = tlc.realTrainerPage;
		
		tlc.previousPageButtonStatus(useFilteredTrainers);
		tlc.nextPageButtonStatus(useFilteredTrainers);
	};
	
	//Function to go to the next trainer page.
	tlc.nextTrainerPage = function(useFilteredTrainers)
	{
		tlc.trainerListStartIndex += tlc.realTrainersPerPage;
		tlc.trainerListEndIndex += tlc.realTrainersPerPage;
		
		tlc.realTrainerPage += 1;
		tlc.trainerPage = tlc.realTrainerPage;
		
		tlc.previousPageButtonStatus(useFilteredTrainers);
		tlc.nextPageButtonStatus(useFilteredTrainers);
	};
	
	//Function to jump to the first trainer page.
	tlc.firstTrainerPage = function(useFilteredTrainers)
	{
		tlc.realTrainerPage = 1;
		tlc.trainerPage = tlc.realTrainerPage;
		
		tlc.trainerListStartIndex = 0;
		tlc.trainerListEndIndex = tlc.realTrainersPerPage;
		
		tlc.previousPageButtonStatus(useFilteredTrainers);
		tlc.nextPageButtonStatus(useFilteredTrainers);
	};
	
	//Function to jump to the last trainer page.
	tlc.lastTrainerPage = function(useFilteredTrainers)
	{
		tlc.realTrainerPage = tlc.maxTrainerPages;
		tlc.trainerPage = tlc.realTrainerPage;
		
		tlc.trainerListStartIndex = tlc.realTrainersPerPage * (tlc.realTrainerPage - 1);
		tlc.trainerListEndIndex = tlc.trainerListStartIndex + tlc.realTrainersPerPage;
		
		tlc.previousPageButtonStatus(useFilteredTrainers);
		tlc.nextPageButtonStatus(useFilteredTrainers);
	};
	
	//Function for going to a specific page based on user input.
	tlc.goToTrainerPage = function(useFilteredTrainers)
	{
		tlc.realTrainerPage = Math.floor(tlc.trainerPage);
		
		if (tlc.realTrainerPage < 0 || tlc.isNaN(tlc.realTrainerPage)) {
			tlc.realTrainerPage = 1;
		}
		
		if (tlc.realTrainerPage > tlc.maxTrainerPages) { 
			tlc.realTrainerPage = tlc.maxTrainerPages; 
		}
		
		tlc.trainerListStartIndex = tlc.realTrainersPerPage * (tlc.realTrainerPage - 1);
		tlc.trainerListEndIndex = tlc.trainerListStartIndex + tlc.realTrainersPerPage;
		
		tlc.previousPageButtonStatus(useFilteredTrainers);
		tlc.nextPageButtonStatus(useFilteredTrainers);
	};
	
	//Status of the previous page button.  Enabled/Disabled.
	tlc.previousPageButtonStatus = function(useFilteredTrainers)
	{
		//True = disabled, false = enabled.
		if (tlc.trainerListStartIndex == 0 || tlc.realTrainersPerPage == 0) { 
			tlc.previousPageButtonDisabled = true; 
		}
		else { 
			tlc.previousPageButtonDisabled = false; 
		}
	};
	
	
	//Status of the next page button.  Enabled/Disabled.
	tlc.nextPageButtonStatus = function(useFilteredTrainers)
	{
		var trainerList;
		
		if (useFilteredTrainers)
		{
			trainerList = tlc.filteredTrainers;
		}
		else
		{
			trainerList = tlc.trainers;
		}
		
		var numTrainers = (trainerList ? trainerList.length : 0);
		
		//True = disabled, false = enabled.
		if (tlc.trainerListStartIndex + tlc.realTrainersPerPage >= numTrainers || tlc.realTrainersPerPage == 0) { 
			tlc.nextPageButtonDisabled = true;
		}
		else { tlc.nextPageButtonDisabled = false; }
	};
	
	
	//Calls for an update to the trainers per page upon loading the page.
	tlc.changeTrainersPerPage(false);
	
	//Conditions on which to use the filtered list of batches, for requisite functions.
	tlc.useFilteredBatches = function()
	{
		return (tlc.hideConcludedBatches || tlc.hideFocuslessBatches || tlc.selectedCurriculum > 0 || tlc.selectedFocus > 0 || tlc.selectedLocation > 0 || tlc.selectedBuilding > 0);
	}
	
	//Refilters the data for the timeline.
	tlc.filterTimelineData = function(worryAboutPagination)
	{
		tlc.filteredTrainers = tlc.trainers;

		if(tlc.batches) {
            tlc.filteredBatches = tlc.batches.filter(tlc.removeNoTrainer).filter(tlc.removeDateless).filter(tlc.removeOutOfDateRange).filter(tlc.removeUnmatchingCurriculum).filter(tlc.removeUnmatchingFocus).filter(tlc.removeUnmatchingLocation).filter(tlc.removeUnmatchingBuilding);
        }
		
		if (tlc.hideConcludedBatches)
		{
			tlc.filteredBatches = tlc.filteredBatches.filter(tlc.removeConcluded);
		}
		
		if (tlc.hideFocuslessBatches)
		{
			tlc.filteredBatches = tlc.filteredBatches.filter(tlc.removeFocusless);
		}
		
		if (tlc.hideBatchlessTrainers)
		{
			tlc.filteredTrainers = tlc.filteredTrainers.filter(tlc.removeBatchlessTrainers);
		}
		
		if (worryAboutPagination)
		{
			tlc.filteredTrainers = tlc.filteredTrainers.filter(tlc.removeTrainersOutOfPage);
		}
			
		if(tlc.filteredBatches){
            tlc.filteredBatches = tlc.filteredBatches.filter(tlc.removeIrrelevantBatches);
		}
		
		//Sorts the trainer column names based on id.
		tlc.filteredTrainers.sort(function(a,b)
		{
			var aID = parseInt(a.substring(1, a.indexOf(')')));
			var bID = parseInt(b.substring(1, b.indexOf(')')));
			
			if(aID < bID){ 
				return -1; 
			}
			else if(aID > bID){ 
				return 1; 
			}
			return 0;
		});
	}
	
	//Calls for the timeline to be re-projected.
	tlc.projectTimeline = function(yOffset)
	{
		$scope.projectTimeline(tlc.timelineFormatting, tlc.minDate, tlc.maxDate, yOffset, tlc.filteredBatches, $scope.$parent, calendarService.countWeeks, tlc.filteredTrainers);
	};
	
	//Generates the string used in the columns
	$scope.trainerColumnName = function(trainer)
	{
		return ("(" + trainer.trainerId + ")" + " " + trainer.firstName + " " + trainer.lastName);
	};

	// Draw timeline
	$scope.projectTimeline = function(timelineFormatting, minDate, maxDate, yCoord, timelineData, parentScope, numWeeks, trainerNames){
		
		//Define Scales
		var colorScale = d3.scale.category20();
		
		var yScale = d3.time.scale()
			.domain([minDate, maxDate])
			.range([0,timelineFormatting.height]);
		
		var xScale = d3.scale.ordinal()
			.domain(trainerNames)
			.rangePoints([timelineFormatting.xPadding, timelineFormatting.width - timelineFormatting.xPadding]);
		
		//Define axis
		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient('left')
			.tickSize(2);
		
		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient('top')
			.tickSize(6,0);
		
		//Used to create line breaks in table word data.
		var wrap = function (text, width) {
			  text.each(function() {
				    var el = d3.select(this),
				        words = el.text().split(/\s+/).reverse(),
				        word,
				        line = [],
				        lineNumber = 0,
				        lineHeight = 1.1, // ems
				        x = el.attr("x"),
				        y = el.attr("y"),
				        dy = parseFloat(el.attr("dy")),
				        tspan = el.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
				    
				    while (word = words.pop()) {
				      line.push(word);
				      tspan.text(line.join(" "));
				      if (tspan.node().getComputedTextLength() > width) {
				        line.pop();
				        tspan.text(line.join(" "));
				        line = [word];
				        tspan = el.append("tspan").attr("x", x).attr("y", y).attr("dy", lineNumber++ * lineHeight + dy + "em").text(word);
				      }
				    }
				  });
				};
		
		//Sort data for Timeline
		
		timelineData.sort(function(a,b){
			if(new Date(a.startDate) < new Date(b.startDate)){
				return -1;
			}
			else if(new Date(a.startDate) > new Date(b.startDate)){
				return 1;
			}
			else{
				return 0;
			}
		});
		
		//Create lines for between batches
		var batchCount = {};
		for(var x = 0; x < timelineData.length; x++){
			
			if(batchCount[timelineData[x].trainer ? $scope.trainerColumnName(timelineData[x].trainer) : 'No trainer'] === undefined){
				batchCount[timelineData[x].trainer ? $scope.trainerColumnName(timelineData[x].trainer) : 'No trainer'] = [];
			}
			
			batchCount[timelineData[x].trainer ? $scope.trainerColumnName(timelineData[x].trainer) : 'No trainer'].push(timelineData[x]);
		}
		
		var betweenBatches = [];
		
		for(var trainer in batchCount){
			if (batchCount.hasOwnProperty(trainer)){
				for(x = 0; x < batchCount[trainer].length-1; x++){
					var between = {x: xScale(batchCount[trainer][x].trainer ? $scope.trainerColumnName(batchCount[trainer][x].trainer) : 'No trainer'),
							y1: yScale(new Date(batchCount[trainer][x].endDate)),
							y2: yScale(new Date(batchCount[trainer][x+1].startDate)),
							length:numWeeks(batchCount[trainer][x].endDate,batchCount[trainer][x+1].startDate)};
					betweenBatches.push(between);
				}
			}
		}
		
		var lanePadding = (xScale.range()[1]-xScale.range()[0])/2;
		
		//Create timeline
	    var svg = d3.select("#timeline");
	    svg.selectAll("*").remove();
	    
	    //Tooltip setup.
		var tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .html(function(d) {
			  var msg = "";
			  var startDate = new Date(d.startDate);
			  var endDate = new Date(d.endDate);
			  var days = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];
			  var months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

			  msg += d.curriculum ? ("<span style='color:orange'>" + d.curriculum.name + "</span> Batch <br/>") : "<span style='color:tomato'>No curriculum</span> for this batch. <br/>";
			  msg += d.focus ? ("w/ focus on <span style='color:orange'>" + d.focus.name + "</span><br/>") : "w/ <span style='color:tomato'>no focus</span>. <br/>";
			  msg += "----------<br/>";
			  msg += d.trainer ? ("Trainer:  <span style='color:gold'>" + d.trainer.firstName + " " + d.trainer.lastName + "</span> <br/>") : "<span style='color:tomato'>No trainer</span> for this batch. <br/>";
			  msg += d.cotrainer ? ("Cotrainer:  <span style='color:gold'>" + d.cotrainer.firstName + " " + d.cotrainer.lastName + "</span> <br/>") : "<span style='color:tomato'>No cotrainer</span> for this batch. <br/>";
			  msg += d.startDate ? ("Start Date:  <span style='color:gold'>" + days[startDate.getDay()] + ", " + months[startDate.getMonth()] + " " + startDate.getDate() + ", " + startDate.getFullYear() + "</span> <br/>") : "<span style='color:tomato'>No start date</span> for this batch. <br/>";
			  msg += d.endDate ? ("End Date:  <span style='color:gold'>" + days[endDate.getDay()] + ", " + months[endDate.getMonth()] + " " + endDate.getDate() + ", " + endDate.getFullYear() + "</span> <br/>") : "<span style='color:tomato'>No end date</span> for this batch. <br/>";
			  msg += "----------<br/>";
			  msg += d.location ? ("Location:  <span style='color:gold'>" + d.location.name + " - " + d.location.city + ", "+ d.location.state + "</span> <br/>") : "<span style='color:tomato'>No location</span> for this batch. <br/>";
			  msg += d.building ? ("Building:  <span style='color:gold'>" + d.building.name + "</span> <br/>") : "<span style='color:tomato'>No building</span> for this batch. <br/>";
			  msg += d.room ? ("Room:  <span style='color:gold'>" + d.room.roomName + "</span> <br/>") : "<span style='color:tomato'>No room</span> for this batch. <br/>";
			  
			  return msg;
		  });
		
		svg = d3.select('#timeline')
			.append('svg')
				.attr('width',timelineFormatting.width + timelineFormatting.margin_left + timelineFormatting.margin_right)
				.attr('height',timelineFormatting.height + timelineFormatting.margin_bottom + timelineFormatting.margin_top)
			.append('g')
				.attr('transform','translate('+timelineFormatting.margin_left+','+timelineFormatting.margin_top+')');
				
		svg.call(tip);
		

		
		svg.append('g')
			.attr('class','y axis')
			.call(yAxis);
		
		//Add swimlanes to timeline
		svg.append('g')
			.attr('class','swimlanes');
			
		d3.select('.swimlanes')
			.selectAll('line')
			.data(trainerNames)
			.enter()
			.append('line')
				.attr('x1', function(d){
					var x = xScale(d)+lanePadding;
					
					return isNaN(x) ? 0 : x;
				})
				.attr('y1', 0)
				.attr('x2', function(d){
					var x = xScale(d)+lanePadding;
					
					return isNaN(x) ? 0 : x;
				})
				.attr('y2', timelineFormatting.height)
				.attr('stroke','lightgray');

		//Add line for current date on timeline
		svg.append('g')
			.attr('class','currentdate');
			
		d3.select('.currentdate')
			.append('line')
				.attr('x1', 0)
				.attr('x2', timelineFormatting.width)
				.attr('y1', yScale(new Date()))
				.attr('y2',yScale(new Date()))
				.attr('stroke','#f26a25');

		// Create line for zoompoint
		svg.append('g')
			.attr('class','zoompoint');
			
		d3.select('.zoompoint')
			.append('line')
				.attr('x1', 0)
				.attr('x2', timelineFormatting.width)
				.attr('y1', yCoord)
				.attr('y2', yCoord)
				.attr('stroke','#000000')
				.attr('stroke-width', 1);
		
		//Add batches to timeline
		var defs = svg.append("defs");

		var filter = defs.append("filter")
			.attr("id", "highlight");

		filter.append("feGaussianBlur")
			.attr("in", "SourceAlpha")
			.attr("stdDeviation", 5)
			.attr("result", "blur");
		filter.append("feComponentTransfer")
			.attr("in", "blur")
			.attr("result","betterBlur")
			.append("feFuncA")
			.attr("type","linear")
			.attr("slope","1.5");
		filter.append("feFlood")
			.attr("in", "betterBlur")
			.attr("flood-color", "#f26a25")
			.attr("result", "color");
		filter.append("feComposite")
			.attr("in", "color")
			.attr("in2", "betterBlur")
			.attr("operator", "in")
			.attr("result", "colorBlur");


		
		var feMerge = filter.append("feMerge");
		
		feMerge.append("feMergeNode")
			.attr("in", "colorBlur");
		feMerge.append("feMergeNode")
			.attr("in", "SourceGraphic");
		  
		//Normal stuff
		svg.append('g')
			.attr('class','rectangles');

        /*
        svg.append('rect')
            .attr('class','axisrect')
            .attr('width',100)
            .attr('height',100)
            .style('fill','red');
            */

        var x = svg.append('g')
            .attr('class','x axis')
            .attr('style', 'position: -webkit-sticky; position: sticky');
            //.call(xAxis);

        var brect = x.append('rect');

        x.call(xAxis);





		d3.select('.rectangles')
			.selectAll('g')
			.data(timelineData)
			.enter()
			.append('g')
				.attr('class','rect')
			.append('rect')
				.attr('id',function(d){return 'id'+d.id;})
				.attr('y', function(d) {
					var y = yScale(new Date(d.startDate));
					
					if (y < 0){ 
						y = 0; 
					}
					
					return y;
				})
				.attr('width', 32)
				.attr('x', function(d) {return xScale(d.trainer ? $scope.trainerColumnName(d.trainer) : 'No trainer') - (d3.select(this).attr("width") / 2);})
				.attr('height', function(d) {
					var start = yScale(new Date(d.startDate));
					var end = yScale(new Date(d.endDate));
					
					if (start < 0){ 
						start = 0; 
					}
					if(end > timelineFormatting.height){ 
						end = timelineFormatting.height; 
					}
					
					return end - start;
				})
				.on('mouseover', function(d)
				{
				    var mouse_coordinates;
				    
				    mouse_coordinates = d3.mouse(this);
					tip.offset([mouse_coordinates[1] - d3.select(this).attr("y") - 8, mouse_coordinates[0] - d3.select(this).attr("x") - (d3.select(this).attr("width") / 2)]).show(d);
					d3.event.stopPropagation();
				})
				.on('mouseout', function(d)
				{
					tip.hide(d);
					d3.event.stopPropagation();
				})
				.on('click', function(d){
					tip.hide(d);
					parentScope.bCtrl.highlightBatch(d);
					parentScope.$apply();
					d3.event.stopPropagation();
				})
				.on('mousedown', function(d)
				{
					tip.hide(d);
					d3.event.stopPropagation();
				})
				.on('mouseup', function(d)
				{
				    tip.show(d);
					d3.event.stopPropagation();
				})
				.on('mousemove', function(d)
				{
				    var mouse_coordinates;
				    
				    mouse_coordinates = d3.mouse(this);
				    tip.hide(d);
					tip.offset([mouse_coordinates[1] - d3.select(this).attr("y") - 8, mouse_coordinates[0] - d3.select(this).attr("x") - (d3.select(this).attr("width") / 2)]).show(d);
					d3.event.stopPropagation();
				})
				.style('fill', function(d) {return colorScale(d.curriculum ? d.curriculum.name : 'No curriculum');});
		d3.selectAll('.rect')
			.append('text')
				.attr('y', function(d) { 
					var y = yScale(new Date(d.startDate));
					
					if (y < 0){ 
						y = 0; 
					}
					
					return (y+25);
				})
				.attr('x', function(d) {return xScale(d.trainer ?  $scope.trainerColumnName(d.trainer) : 'No trainer')-7;})
				.on('mouseover', function(d)
				{
				    var mouse_coordinates;
				    
				    mouse_coordinates = d3.mouse(this);
					tip.offset([mouse_coordinates[1] - d3.select(this).attr("y"), mouse_coordinates[0] - d3.select(this).attr("x") - 8]).show(d);
					d3.event.stopPropagation();
				})
				.on('mouseout', function(d)
				{
					tip.hide(d);
					d3.event.stopPropagation();
				})
				.on('click', function(d){
					tip.hide(d);
					parentScope.bCtrl.highlightBatch(d);
					parentScope.$apply();
					d3.event.stopPropagation();
				})
				.on('mousedown', function(d)
				{
					tip.hide(d);
					d3.event.stopPropagation();
				})
				.on('mouseup', function(d)
				{
				    tip.show(d);
					d3.event.stopPropagation();
				})
				.on('mousemove', function(d)
				{
				    var mouse_coordinates;
				    
				    mouse_coordinates = d3.mouse(this);
				    tip.hide(d);
					tip.offset([mouse_coordinates[1] - d3.select(this).attr("y"), mouse_coordinates[0] - d3.select(this).attr("x") - 8]).show(d);
					d3.event.stopPropagation();
				})
				.text(function(d) {return numWeeks(d.startDate,d.endDate) + " W E E K S";})
					.attr("dy", 0);
		
		d3.selectAll('.rect')
			.selectAll("text")
				.call(wrap, 0.1);
		
		//Linewrap column names.
		svg.selectAll('g.x.axis g text')
			.attr('y', '-3.0em')
			.call(wrap, 0.1);
				
		//Add between batch length to timeline
		svg.append('g')
			.attr('class','betweenbatches');

		d3.select('.betweenbatches')
			.selectAll('g')
			.data(betweenBatches)
			.enter()
			.append('g')
				.attr('class','between')
			.append('line')
				.attr('x1', function(d){return d.x;})
				.attr('y1', function(d){return d.y1;})
				.attr('x2', function(d){return d.x;})
				.attr('y2', function(d){return d.y2;})
				.style('stroke', 'black');
		d3.selectAll('.between')
			.append('text')
				.attr('y', function(d) {return ((d.y1+d.y2)/2)+5;})
				.attr('x', function(d) {return d.x+5;})
				.text(function(d) {return d.length;});

		tlc.moveAxis();
        if(x!=null){
            if(x.node()!=null){
                brect
                    .attr('class','axisrect')
                    .attr('transform','translate('+(timelineFormatting.margin_left/2)+',-'+x.node().getBoundingClientRect().height+')')
                    .attr('width',x.node().getBoundingClientRect().width+timelineFormatting.margin_left/2)
                    .attr('height',x.node().getBoundingClientRect().height)
                    .style('fill','white');
            }
        }


	}

//	function to freeze trainers names over the graph at the top of the window whenever you scroll out of the window
	tlc.axisDisplacement = 0
    tlc.moveAxis= function () {
        var x = document.getElementsByClassName("x axis");
        if(x[0]!=undefined ) {
            if(x[0].getBoundingClientRect().top){
                tlc.axisDisplacement -= x[0].getBoundingClientRect().top
                if(tlc.axisDisplacement <0){tlc.axisDisplacement =0;}
                    x[0].setAttribute("transform", "translate(0," + tlc.axisDisplacement + ")");
            }

        }//else{
//            setTimeout(tlc.moveAxis,120);
        window.requestAnimationFrame(tlc.moveAxis);
        //}
    }
});