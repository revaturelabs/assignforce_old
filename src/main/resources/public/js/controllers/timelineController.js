var app = angular.module('batchApp');

/*--------------------------CONTROLLER---------------------------*/

 app.controller("TimelineCtrl", function($scope, $window, batchService, calendarService, trainerService, curriculumService, settingService, locationService, buildingService, utilService){
	
    let tlc = this;

    //For displaying toast messages.
    tlc.showToast = function( message ){
        $scope.$parent.aCtrl.showToast( message );
    };

    tlc.batchHasNotConcluded = function(batch) {
        return (batch.endDate > tlc.currentDate);
    };
    
    $scope.batchHasDate = function(batch) {
        return (Boolean(batch.startDate) && Boolean(batch.endDate));
    };
    $scope.batchIsInDateRange = function(batch, start, end) {
        return utilService.day.inRange(batch.startDate,start,end) || utilService.day.inRange(batch.endDate,start,end)
    };
    
    //Filter removes batches that don't have a matching curriculum to the selected view by the user.
    tlc.removeUnmatchingCurriculum = function(batch)
    {
    	return (tlc.selectedCurriculum === 0 || ((batch.curriculum) && (batch.curriculum.currId === tlc.selectedCurriculum)));
    };
    
    //Filter removes batches that don't have a matching location to the selected view by the user.
    tlc.removeUnmatchingLocation = function(batch)
    {
    	return (tlc.selectedLocation === 0 || ((batch.location) && (batch.location.id === tlc.selectedLocation)));
    };
    
    //Filter removes batches that don't have a matching building to the selected view by the user.
    tlc.removeUnmatchingBuilding = function(batch)
    {
    	return (tlc.selectedBuilding === 0 || (batch.building && batch.building.id === tlc.selectedBuilding));
    };
    
    //Filter removes batches that don't have a matching focus to the selected view by the user.
    tlc.removeUnmatchingFocus = function(batch)
    {
    	return (tlc.selectedFocus === 0 || (batch.focus) && batch.focus.currId === tlc.selectedFocus);
    };

    $scope.areEqualTrainers = function(a,b)
	{
		if(a && b)
    		return a.trainerId === b.trainerId;
		else
			return false;
    };
     $scope.compareTrainersByFirstName = function(a,b)
     {
         if(a.firstName < b.firstName) {
             return -1;
         }
         else if(a.firstName>b.firstName){
             return 1;
         }
         return 0;
     };

	 //Filter removes batches who don't have any matching trainers.
	 tlc.removeIrrelevantBatches = function(batch) {
		 return tlc.filteredTrainers.filter((d) => tlc.areEqualTrainers(d,batch.trainer)).length > 0;
	 };

    
    //Filter removes trainers that don't have any batches.
     tlc.removeBatchlessTrainers = function(trainer) {
         return tlc.filteredBatches.filter((d) => tlc.areEqualTrainers(d.trainer,trainer)).length < 0;
     };

	//Options for datepicker
	tlc.options = {
		datepickerMode: "month",
		minMode: "month"
	};
	let privateDate = () =>
	{
		let myDate = new Date();
		return (newdate) =>
		{
			if(newdate||newdate === 0) myDate = new Date(newdate);
			return myDate;
        }
    }

	$scope.StartDate = privateDate();
	$scope.StartDate(utilService.day.addDays(new Date, -100));
	$scope.EndDate = privateDate();
	$scope.selectCurricula = [];
	$scope.Curricula = [];
	$scope.selectFoci = [];
	$scope.Foci = [];
	$scope.selectLocations = [];
	$scope.Location = [];
	$scope.selectBuildings =[];
	$scope.Buildings = [];
	$scope.hideConcludedBatches = false;
	$scope.hideBatchlessTrainers = true;
	$scope.completeBatchlist;
	$scope.completeTrainerList;





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


     //Fetches all the batches for the controller  Also attaches their location and building information if possible.
     tlc.getAllBatches = new Promise(function(resolve)
     {
         batchService.getAll( function(response) {
             tlc.batches = response;
             tlc.getDateRange(false);

             tlc.batches.forEach(function(b){
                 if (b.room)
                 {
                     var building = tlc.buildings.find(function(building){
                         return (building.id === b.room.building);
                     });

                     if (building)
                     {
                         b.building = building;

                         var location = tlc.locations.find(function(location){
                             return (location.id === b.building.location);
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
                 $scope.completeBatchList = tlc.batches
             });

             resolve(1);
         }, function() {
             tlc.showToast("Timeline:  Could not fetch batches.");
             resolve(0);
         });
     });
     //Fetches all the trainers for the controller.
     tlc.getAllTrainers = new Promise(function(resolve)
     {
         trainerService.getAll( function(response) {
             tlc.trainers = response;
			 $scope.completeTrainerList = tlc.trainers;
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
             /* after data is avalible */
             $scope.EndDate($scope.lastBatchEndDate());
             $scope.projectTimeline(-100);
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
	};
	
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
	};

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
			if (batchList[b].trainer && batchList[b].startDate && batchList[b].endDate)
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




     //Returns the location object selected in the filter dropdown.
     tlc.getSelectedLocation = function()
     {
         var location = tlc.locations.find(function(l){
             return (l.id === tlc.selectedLocation);
         });

         return location;
     }

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
			$scope.projectTimeline(mousedownY);
			
			// Fire when there is a mousemove event on the #timeline element
			$scope.mousemove = function(evt){

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

			    $scope.projectTimeline(mousedownY);
			    
				// Update the last coordinate of the mouse
				pageY = evt.pageY;
			};
		}
	};

	$scope.mouseup = function(evt){
		// Erase the zoompoint(or move out of view)
		$scope.projectTimeline(-100);
		// Remove mousemove listener from the container
		$(".toastContainer").off("mousemove");
		evt.stopPropagation();
	};

	//determines the maximum date of the enddate datepicker
	$scope.maximumDate = function ()
	{
		return utilService.day.addDays(new Date(), 365 *2);
    }
	$scope.minimumDate= function () {
        return utilService.day.addDays(new Date, -180)
    }
	$scope.findMinimumDate = () =>
	{
        return $scope.completeBatchList
            .filter($scope.batchHasDate)
            .map((a) => a.startDate)
            .reduce((a,b) => a>b?b:a);
	}
	$scope.setEndDateToOneQuarter= ()=>
	{
		let start = $scope.StartDate();
		$scope.EndDate(utilService.day.addDays(start, 180));
	};
	$scope.lastBatchEndDate = () =>
	{
        return $scope.completeBatchList
            .filter($scope.batchHasDate)
            .map((a) => a.endDate)
            .reduce((a,b) => a<b?b:a);
	}


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
		
		if (isNaN(tlc.realTrainersPerPage) || tlc.realTrainersPerPage < 0) {
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
		
		if (tlc.realTrainerPage < 0 || isNaN(tlc.realTrainerPage)) {
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
	tlc.previousPageButtonStatus = function()
	{
		//True = disabled, false = enabled.
		if (tlc.trainerListStartIndex === 0 || tlc.realTrainersPerPage === 0) {
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
		if (tlc.trainerListStartIndex + tlc.realTrainersPerPage >= numTrainers || tlc.realTrainersPerPage === 0) {
			tlc.nextPageButtonDisabled = true;
		}
		else { tlc.nextPageButtonDisabled = false; }
	};
	
	
	//Calls for an update to the trainers per page upon loading the page.
	tlc.changeTrainersPerPage(false);
	
	//Conditions on which to use the filtered list of batches, for requisite functions.
	tlc.useFilteredBatches = function()
	{
		if(tlc.hideConcludedBatches || tlc.hideFocuslessBatches || tlc.selectedCurriculum > 0 || tlc.selectedFocus > 0){
		    return true;
		}
		else if(tlc.selectedLocation > 0 || tlc.selectedBuilding > 0){
		    return true;
		}
		else{
		    return false;
		};
	}
	
	//Refilters the data for the timeline.
	tlc.filterTimelineData = function(worryAboutPagination)
	{
		tlc.filteredTrainers = tlc.trainers.slice();

		if(tlc.batches) {
            tlc.filteredBatches = tlc.batches
				.filter((b) => {return Boolean(b.trainer)})
				.filter(tlc.batchHasDate)
				.filter((b) => tlc.batchIsInDateRange(b,tlc.minDate,tlc.maxDate))
				.filter(tlc.removeUnmatchingCurriculum)
				.filter(tlc.removeUnmatchingFocus)
				.filter(tlc.removeUnmatchingLocation)
				.filter(tlc.removeUnmatchingBuilding);
        }
		
		if (tlc.hideConcludedBatches)
		{
			tlc.filteredBatches = tlc.filteredBatches
				.filter(tlc.batchHasNotConcluded());
		}
		
		if (tlc.hideFocuslessBatches)
		{
			//TODO
			tlc.filteredBatches = tlc.filteredBatches
				.filter(tlc.removeFocusless);
		}
		
		if (tlc.hideBatchlessTrainers)
		{
			tlc.filteredTrainers = tlc.filteredTrainers.filter(tlc.removeBatchlessTrainers);
		}
		
		if (worryAboutPagination)
		{
			tlc.filteredTrainers = tlc.filteredTrainers.splice(tlc.trainerListStartIndex-1, tlc.trainerListEndIndex);
		}
			
		if(tlc.filteredBatches){
            tlc.filteredBatches = tlc.filteredBatches.filter(tlc.removeIrrelevantBatches);
		}
		
		//Sorts the trainer column names based on firstname
		tlc.filteredTrainers = tlc.filteredTrainers.sort(tlc.compareTrainersByFirstName);

        if (worryAboutPagination)
        {
            tlc.filteredTrainers = tlc.filteredTrainers.splice(tlc.trainersPerPage);
        }
	}
	
	//Calls for the timeline to be re-projected.
	$scope.projectTimeline = function(yOffset)
	{

		$scope.filteredBatchList = $scope.completeBatchList
			.filter($scope.batchHasDate) //makes no sense to have dateless batches on the timeline
			.filter((batch) => Boolean(batch.trainer)) 	//never show trainerless batches
			.filter((batch) => $scope.batchIsInDateRange(batch,$scope.StartDate(),$scope.EndDate())) //remove batches that dont fall into the time range\
			.filter((batch) => ($scope.selectCurricula.length ===0)) //filter Curricula


		$scope.filteredBatchList.forEach((batch) => {
			let trainerIndex = $scope.completeTrainerList.findIndex((t) => $scope.areEqualTrainers(t,batch.trainer));
			if(!$scope.completeTrainerList[trainerIndex].hasBatch)
				$scope.completeTrainerList[trainerIndex].hasBatch = true;
		});


		$scope.filteredTrainerList = $scope.completeTrainerList
			.filter((trainer) => {return (trainer.active || trainer.hasBatch)}) //never show inactive trainers who do not have a batch
			.sort($scope.compareTrainersByFirstName);


		$scope.renderTimeline(tlc.timelineFormatting, $scope.StartDate(), $scope.EndDate(), yOffset, $scope.filteredBatchList, $scope.$parent, calendarService.countWeeks, $scope.filteredTrainerList);
	};
	
	//Generates the string used in the columns
	$scope.trainerColumnName = function(trainer)
	{
		return trainer?( trainer.firstName + " " + trainer.lastName):'No trainer';
	};

	// Draw timeline
	$scope.renderTimeline = function(timelineFormatting, minDate, maxDate, yCoord, timelineData, parentScope, numWeeks, trainerNames){
        //Define Scales
		let colorScale = d3.scale.category20();
		
		let yScale = d3.time.scale()
			.domain([minDate, maxDate])
			.range([0,timelineFormatting.height]);
		
		let xScale = d3.scale.ordinal()
			.domain(trainerNames.map($scope.trainerColumnName))
			.rangePoints([timelineFormatting.xPadding, timelineFormatting.width - timelineFormatting.xPadding]);
		
		//Define axis
		let yAxis = d3.svg.axis()
			.scale(yScale)
			.orient('left')
			.tickSize(2);
		
		let xAxis = d3.svg.axis()
			.scale(xScale)
			.orient('top')
			.tickSize(6,0);
		
		//Used to create line breaks in table word data.
		let wrap = function (text, width) {
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
		//
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
        let betweenBatches = [];

        trainerNames.forEach((trainer) =>
		{
			let batches = timelineData.filter((b) => $scope.areEqualTrainers(trainer,b.trainer) );
			betweenBatches.push( utilService.functions.zip(batches.slice(1),batches, (b,a) => {
								return { x: xScale($scope.trainerColumnName(b.trainer)),
									y1: yScale(new Date(a.endDate)),
									y2: yScale(new Date(b.startDate)),
									length:numWeeks(a.endDate,b.startDate)
								}
				}).filter((between) => between.length > 0 ));

		});
        betweenBatches = betweenBatches.filter((a1) => a1 !== []).reduce((a,b) => a.concat(b));

		
		var lanePadding = (xScale.range()[1]-xScale.range()[0])/2;
		
		//Create timeline
	    let svg = d3.select("#timeline");
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

        var xLine = svg.append('g')
            .attr('class','x axis')
            .attr('id','x axis')
            .style('position','sticky')

        svg.call(tip);


		svg.append('g')
			.attr('class','y axis')
			.call(yAxis);
		
		//Add swimlanes to timeline
		svg.append('g')
			.attr('class','swimlanes');
			
		d3.select('.swimlanes')
			.selectAll('line')
			.data(trainerNames.map($scope.trainerColumnName))
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




            //.call(xAxis);

        var brect = xLine.append('rect');

        xLine.call(xAxis);





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
        if(timelineData.length!==null && xLine.node()!==null){
            brect
                .attr('class','axisrect')
                .attr('transform','translate('+(timelineFormatting.margin_left/2)+',-'+xLine.node().getBoundingClientRect().height+')')
                .attr('width',xLine.node().getBoundingClientRect().width+timelineFormatting.margin_left/2)
                .attr('height',xLine.node().getBoundingClientRect().height)
                .style('fill','white');
        }
	}

//	function to freeze trainers names over the graph at the top of the window whenever you scroll out of the window
	tlc.axisDisplacement = 0;
    tlc.moveAxis= function () {
        // let x = document.getElementById("x axis");
        //  if(x !== undefined){
        //     if(x.getBoundingClientRect().top){
        //         tlc.axisDisplacement -= x.getBoundingClientRect().top
        //         if(tlc.axisDisplacement <0){tlc.axisDisplacement =0;}
        //             x.setAttribute("transform", "translate(0," + tlc.axisDisplacement + ")");
        //     }
        //  }
        // //else{
        // window.requestAnimationFrame(tlc.moveAxis);
        // //}
    }
    //window.setTimeout(() => {$scope.projectTimeline()}, 60000);
});