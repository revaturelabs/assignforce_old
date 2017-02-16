var assignforce = angular.module( "batchApp" );

var app = angular.module('batchApp');

/*--------------------------CONTROLLER---------------------------*/

app.controller("TimelineCtrl", function($scope, $window, batchService, calendarService, trainerService, curriculumService, settingService){
    var tlc = this;

    tlc.removeNoTrainer = function(batch) {
        return (batch.trainer && batch.startDate && batch.endDate);
    };
    
    tlc.removeIrrelevantBatches = function(batch) {
		var trainerIndex = tlc.filteredTrainers.findIndex(function (d)
		{
			return (d == trainerColumnName(batch.trainer));
		});
		
        return (trainerIndex > -1);
    };
    
    tlc.removeTrainersOutOfPage = function(trainer) {
		var trainerIndex = tlc.trainers.findIndex(function (d)
		{
			return (d == trainer);
		});
		
		var trainerDisplayed = (tlc.trainerListEndIndex == 0 || (trainerIndex > -1 && trainerIndex >= tlc.trainerListStartIndex && trainerIndex < tlc.trainerListEndIndex));
		
        return trainerDisplayed;
    };

	//Options for datepicker
	tlc.options = {
		datepickerMode: "month",
		minMode: "month"
	}
	
	//Timeline axis range variables
	tlc.minDate = new Date(3000, 7, 0);
	tlc.maxDate = new Date(2000, 12, 0);
	
	tlc.maxTrainerNameCharacters = 6;
	tlc.selectedCurriculum = 0;
	tlc.trainersPerPage = 0;
	tlc.realTrainersPerPage = 0;
	tlc.trainerPage = 1;
	tlc.realTrainerPage = 1;
	tlc.maxTrainerPages = 1;
	tlc.trainerListStartIndex = 0;
	tlc.trainerListEndIndex = 0;
	tlc.previousPageButtonDisabled = false;
	tlc.nextPageButtonDisabled = false;
	tlc.filteredTrainers;
	tlc.filteredBatches;
	
	//Set the min and max dates based on the batches.
	//Also grabs the length of the longest trainer name.
	tlc.getDateRange = function()
	{	
		if (tlc.batches)
		{
			var startDate;
			var endDate;
			
			for (var b in tlc.batches)
			{
				if (!angular.isUndefined(tlc.batches[b].trainer) && tlc.batches[b].trainer !== null && !angular.isUndefined(tlc.batches[b].startDate) && tlc.batches[b].startDate !== null && !angular.isUndefined(tlc.batches[b].endDate) && tlc.batches[b].endDate !== null)
				{
					if (angular.isUndefined(tlc.minDate))
					{
						tlc.minDate = new Date(tlc.batches[b].startDate);
					}
					else
					{
						startDate = new Date(tlc.batches[b].startDate);
						if (startDate.getTime() < tlc.minDate.getTime()) {tlc.minDate = startDate;}
					}
					
					if (angular.isUndefined(tlc.maxDate))
					{
						tlc.maxDate = new Date(tlc.batches[b].endDate);
					}
					else
					{
						endDate = new Date(tlc.batches[b].endDate);
						if (endDate.getTime() > tlc.maxDate.getTime()) {tlc.maxDate = endDate;}
					}
				}
			}
		}
	}
	
	//Project timeline when data changes
	var batches;
	var trainerNames;
	
	$scope.$on("repullTimeline", function(){
		tlc.repull();
	});

	tlc.getAllBatches = new Promise(function(resolve, reject)
	{
	    batchService.getAll( function(response) {
	        tlc.batches = response;
	        tlc.getDateRange();
	        resolve(1);
	    }, function(reject) {
	    	resolve(0);
	    });
	});

	tlc.getAllTrainers = new Promise(function(resolve, reject)
	{
	    trainerService.getAll( function(response) {
			tlc.trainers = response.map(function(trainer){return trainerColumnName(trainer)});

			resolve(1);
	    }, function(reject) {
	    	resolve(0);
	    });
	});
    
    curriculumService.getAll( function(response) {
        tlc.curricula = response;
    }, function(error) {
    });

    settingService.getById(5, function (response) {
        tlc.trainersPerPage = response.settingValue;
        tlc.changeTrainersPerPage();
    }, function () {
    });
    
	$scope.$watch(
		function(){
			return tlc.minDate;
		},
		function(){
			if(tlc.batches !== undefined && tlc.trainers !== undefined){
				tlc.projectTimeline(0);
			}
		}
	);
	
	$scope.$watch(
		function(){
			return tlc.maxDate;
		},
		function(){
			if(tlc.batches !== undefined && tlc.trainers !== undefined) {
				tlc.projectTimeline(0);

            }
		}
	);

	// Range values for timeline
	var MAX_RANGE = 126140000000000; // 4000 years
	var MIN_RANGE = 1000000; // 1 minute

	// Events for the timeline
	$("#timeline").mousedown(function(evt){
		evt.stopPropagation();

		if(evt.offsetY > 79 && evt.offsetY < 1970){

			console.log(evt.offsetY);

			// Initial y-coordinate of the mouse
			var init = evt.offsetY - 79;
			var mousedownY = init;
			var pageY = evt.pageY;

			// Get the date with respect to the y-coordinate
			var yScale = d3.time.scale()
				.domain([0,1888])
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
				
				} else if(pageY < evt.pageY && millisecondRange < MAX_RANGE) {

					tlc.minDate = new Date(minDateMilliseconds - topMilliseconds);
					tlc.maxDate = new Date(maxDateMilliseconds + bottomMilliseconds);
				}

			    tlc.projectTimeline(mousedownY);
			    
				// Update the last coordinate of the mouse
				pageY = evt.pageY;
			});
		}
	});

	$(".toastContainer").mouseup(function(evt){
		// Erase the zoompoint(or move out of view)
		tlc.projectTimeline(-100);
		// Remove mousemove listener from the container
		$(".toastContainer").off("mousemove");
		evt.stopPropagation();
	});
	
    tlc.repullPromise = new Promise(function(resolve, reject){
    	tlc.getAllBatches.then(function(result)
    	{
	    	tlc.getAllTrainers.then(function(result)
	    	{
	    		resolve(1);
	    	});
    	});
    });
    
    tlc.repullPromise.then(function(result)
    {
    	if (result) { tlc.projectTimeline(0); }
    }, function(error){});
    
    tlc.repull = function()
    {
        tlc.repullPromise.then(function(result)
	    {
        	if (result) { tlc.projectTimeline(0); }
	    }, function(error){});
    }
    
    //Pagination functions
	tlc.changeTrainersPerPage = function()
	{
		var numTrainers = (tlc.trainers ? tlc.trainers.length : 0);
		
		
		tlc.realTrainersPerPage = Math.floor(tlc.trainersPerPage);
		
		if (!angular.isNumber(tlc.realTrainersPerPage) || isNaN(parseInt(tlc.realTrainersPerPage)) || tlc.realTrainersPerPage < 0) { tlc.realTrainersPerPage = 0; }
		
		tlc.realTrainersPerPage = Math.min(tlc.realTrainersPerPage, numTrainers);
		
		tlc.trainerListStartIndex = 0;
		
		tlc.trainerListEndIndex = Math.min(tlc.realTrainersPerPage, numTrainers);
		
		tlc.realTrainerPage = 1;
		tlc.trainerPage = tlc.realTrainerPage;
		tlc.maxTrainerPages = Math.ceil(numTrainers / tlc.realTrainersPerPage);
		
		tlc.previousPageButtonStatus();
		tlc.nextPageButtonStatus();
	}
	
	tlc.previousTrainerPage = function()
	{
		tlc.trainerListStartIndex -= tlc.realTrainersPerPage;
		tlc.trainerListEndIndex -= tlc.realTrainersPerPage;
		
		tlc.realTrainerPage -= 1;
		tlc.trainerPage = tlc.realTrainerPage;
		
		tlc.previousPageButtonStatus();
		tlc.nextPageButtonStatus();
	}
	
	tlc.nextTrainerPage = function()
	{
		tlc.trainerListStartIndex += tlc.realTrainersPerPage;
		tlc.trainerListEndIndex += tlc.realTrainersPerPage;
		
		tlc.realTrainerPage += 1;
		tlc.trainerPage = tlc.realTrainerPage;
		
		tlc.previousPageButtonStatus();
		tlc.nextPageButtonStatus();
	}
	
	tlc.firstTrainerPage = function()
	{
		tlc.realTrainerPage = 1;
		tlc.trainerPage = tlc.realTrainerPage;
		
		tlc.trainerListStartIndex = 0;
		tlc.trainerListEndIndex = tlc.realTrainersPerPage;
		
		tlc.previousPageButtonStatus();
		tlc.nextPageButtonStatus();
	}
	
	tlc.lastTrainerPage = function()
	{
		tlc.realTrainerPage = tlc.maxTrainerPages;
		tlc.trainerPage = tlc.realTrainerPage;
		
		tlc.trainerListStartIndex = tlc.realTrainersPerPage * (tlc.realTrainerPage - 1);
		tlc.trainerListEndIndex = tlc.trainerListStartIndex + tlc.realTrainersPerPage;
		
		tlc.previousPageButtonStatus();
		tlc.nextPageButtonStatus();
	}
	
	tlc.goToTrainerPage = function()
	{
		tlc.realTrainerPage = Math.floor(tlc.trainerPage);
		
		if (tlc.realTrainerPage < 0 || !angular.isNumber(tlc.realTrainerPage) || isNaN(tlc.realTrainerPage)) {tlc.realTrainerPage = 1;}
		if (tlc.realTrainerPage > tlc.maxTrainerPages) { tlc.realTrainerPage = tlc.maxTrainerPages; }
		
		tlc.trainerListStartIndex = tlc.realTrainersPerPage * (tlc.realTrainerPage - 1);
		tlc.trainerListEndIndex = tlc.trainerListStartIndex + tlc.realTrainersPerPage;
		
		tlc.previousPageButtonStatus();
		tlc.nextPageButtonStatus();
	}
	
	tlc.previousPageButtonStatus = function()
	{
		//True = disabled, false = enabled.
		if (tlc.trainerListStartIndex == 0 || tlc.realTrainersPerPage == 0) { tlc.previousPageButtonDisabled = true; }
		else { tlc.previousPageButtonDisabled = false; }
	}
	
	tlc.nextPageButtonStatus = function()
	{
		var numTrainers = (tlc.trainers ? tlc.trainers.length : 0);
		
		//True = disabled, false = enabled.
		if (tlc.trainerListStartIndex + tlc.realTrainersPerPage >= numTrainers || tlc.realTrainersPerPage == 0) { tlc.nextPageButtonDisabled = true; }
		else { tlc.nextPageButtonDisabled = false; }
	}
	
	tlc.changeTrainersPerPage();
	
	tlc.projectTimeline = function(yOffset)
	{
		if (tlc.trainers && tlc.batches)
		{
			tlc.filteredTrainers = tlc.trainers.filter(tlc.removeTrainersOutOfPage);
			
			tlc.filteredBatches = tlc.batches.filter(tlc.removeNoTrainer).filter(tlc.removeIrrelevantBatches);
			
			tlc.filteredTrainers.sort(function(a,b)
			{
				var aID = parseInt(a.substring(1, a.indexOf(')')));
				var bID = parseInt(b.substring(1, b.indexOf(')')));
				
				if(aID < bID){ return -1; }
				else if(aID > bID){ return 1; }
				return 0;
			});
			
			
			
			projectTimeline($window.innerWidth, tlc.minDate, tlc.maxDate, yOffset, tlc.filteredBatches, $scope.$parent, calendarService.countWeeks, tlc.filteredTrainers, tlc.selectedCurriculum);
		}
	}
});

//Generates the string used in the columns
function trainerColumnName(trainer)
{
	return ("(" + trainer.trainerID + ")" + " " + trainer.firstName + " " + trainer.lastName);
}

// Draw timeline
function projectTimeline(windowWidth, minDate, maxDate, yCoord, timelineData, parentScope, numWeeks, trainerNames, selectedCurriculum){
	//Timeline variables
	var margin = {top: 80, right: 16, bottom: 32, left: 72},
	width = windowWidth - margin.left - margin.right,
	height = 2000 - margin.top - margin.bottom,
	xPadding = 72;
	
	//Define Scales
	var colorScale = d3.scale.category20();
	
	var yScale = d3.time.scale()
		.domain([minDate, maxDate])
		.range([0,height]);
	
	var xScale = d3.scale.ordinal()
		.domain(trainerNames)
		.rangePoints([xPadding, width - xPadding]);
	
	//Define axis
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient('left')
		.tickSize(2);
	
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('top')
		.tickSize(6,0)
	
	//Used to create line breaks in table word data.
	var wrap = function (text, width) {
		  text.each(function() {
			    var el = d3.select(this),
			        words = el.text().split(/\s+/).reverse(),
			        word,
			        line = [],
			        lineNumber = 0,
			        lineHeight = 1.1, // ems
			        x = el.attr("x")
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
			}
	
	//Filter & sort data for that in range of Timeline
	//Also for the selected curriculum type.
	timelineData = timelineData.filter(function(batch){
		var dateInRange = ((new Date(batch.startDate) <= maxDate) && (new Date(batch.endDate) >= minDate));
		var matchingCurriculum = (selectedCurriculum == 0 || (!(angular.isUndefined(batch.curriculum)) && (batch.curriculum.id == selectedCurriculum)));

		return (dateInRange && matchingCurriculum);
	});
	
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
		
		if(batchCount[timelineData[x].trainer ? trainerColumnName(timelineData[x].trainer) : 'No trainer'] === undefined){
			batchCount[timelineData[x].trainer ? trainerColumnName(timelineData[x].trainer) : 'No trainer'] = [];
		}
		
		batchCount[timelineData[x].trainer ? trainerColumnName(timelineData[x].trainer) : 'No trainer'].push(timelineData[x]);
	}
	
	var betweenBatches = [];
	
	for(var trainer in batchCount){
		if (batchCount.hasOwnProperty(trainer)){
			for(x = 0; x < batchCount[trainer].length-1; x++){
				var between = {x: xScale(batchCount[trainer][x].trainer ? trainerColumnName(batchCount[trainer][x].trainer) : 'No trainer'),
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
    
	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .html(function(d) {
		  var msg = "";
		  var startDate = new Date(d.startDate);
		  var endDate = new Date(d.endDate);
		  
		  var parseDay = function(day)
		  {
			  switch (day)
			  {
			  	case 0: return "Sun.";
			  	case 1: return "Mon.";
			  	case 2: return "Tue.";
			  	case 3: return "Wed.";
			  	case 4: return "Thu.";
			  	case 5: return "Fri.";
			  	case 6: return "Sat.";
			  }
		  }
		  
		  var parseMonth = function(month)
		  {
			  switch (month)
			  {
			  	case 0: return "Jan.";
			  	case 1: return "Feb.";
			  	case 2: return "Mar.";
			  	case 3: return "Apr.";
			  	case 4: return "May";
			  	case 5: return "Jun.";
			  	case 6: return "Jul.";
			  	case 7: return "Aug.";
			  	case 8: return "Sep.";
			  	case 9: return "Oct.";
			  	case 10: return "Nov.";
			  	case 11: return "Dec.";
			  }
		  }
		  
		  msg += d.curriculum ? ("<span style='color:orange'>" + d.curriculum.name + "</span> Batch <br/>") : "<span style='color:red'>No curriculum</span> for this batch. <br/>";
		  msg += d.trainer ? ("Trainer:  <span style='color:gold'>" + d.trainer.firstName + " " + d.trainer.lastName + "</span> <br/>") : "<span style='color:gold'>No trainer</span> for this batch. <br/>";
		  msg += d.cotrainer ? ("Cotrainer:  <span style='color:gold'>" + d.cotrainer.firstName + " " + d.cotrainer.lastName + "</span> <br/>") : "<span style='color:gold'>No cotrainer</span> for this batch. <br/>";
		  msg += d.startDate ? ("Start Date:  <span style='color:gold'>" + parseDay(startDate.getDay()) + ", " + parseMonth(startDate.getMonth()) + " " + startDate.getDate() + ", " + startDate.getFullYear() + "</span> <br/>") : "<span style='color:gold'>No start date</span> for this batch. <br/>";
		  msg += d.endDate ? ("End Date:  <span style='color:gold'>" + parseDay(endDate.getDay()) + ", " + parseMonth(endDate.getMonth()) + " " + endDate.getDate() + ", " + endDate.getFullYear() + "</span> <br/>") : "<span style='color:gold'>No end date</span> for this batch. <br/>";
		  
		  return msg;
	  });
	
	svg = d3.select('#timeline')
		.append('svg')
			.attr('width',width + margin.left + margin.right)
			.attr('height',height + margin.bottom + margin.top)
		.append('g')
			.attr('transform','translate('+margin.left+','+margin.top+')');
			
	svg.call(tip);
	
	svg.append('g')
		.attr('class','x axis')
		.call(xAxis);
	
	svg.append('g')
		.attr('class','y axis')
		.call(yAxis);
	
	//Add swimlanes to timeline
	svg.append('g')
		.attr('class','swimlanes')
		
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
			.attr('y2', height)
			.attr('stroke','lightgray');
	
	//Add line for current date on timeline
	svg.append('g')
		.attr('class','currentdate')
		
	d3.select('.currentdate')
		.append('line')
			.attr('x1', 0)
			.attr('x2', width)
			.attr('y1', yScale(new Date()))
			.attr('y2',yScale(new Date()))
			.attr('stroke','#f26a25');

	// Create line for zoompoint
	svg.append('g')
		.attr('class','zoompoint')
		
	d3.select('.zoompoint')
		.append('line')
			.attr('x1', 0)
			.attr('x2', width)
			.attr('y1', yCoord)
			.attr('y2', yCoord)
			.attr('stroke','#000000')
			.attr('stroke-width', 1);
	
	//Add batches to timeline
	var defs = svg.append("defs");

	var filter = defs.append("filter")
		.attr("id", "highlight")

	filter.append("feGaussianBlur")
		.attr("in", "SourceAlpha")
		.attr("stdDeviation", 5)
		.attr("result", "blur");
	filter.append("feComponentTransfer")
		.attr("in", "blur")
		.attr("result","betterBlur")
		.append("feFuncA")
		.attr("type","linear")
		.attr("slope","1.5")
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
		.attr("in", "colorBlur")
	feMerge.append("feMergeNode")
		.attr("in", "SourceGraphic");
	  
	//Normal stuff
	svg.append('g')
		.attr('class','rectangles');

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
				
				if (y < 0){ y = 0; }
				
				return y;
			})
			.attr('width', 32)
			.attr('x', function(d) {return xScale(d.trainer ? trainerColumnName(d.trainer) : 'No trainer') - (d3.select(this).attr("width") / 2);})
			.attr('height', function(d) {
				var start = yScale(new Date(d.startDate));
				var end = yScale(new Date(d.endDate));
				
				if (start < 0){ start = 0; }
				if(end > height){ end = 1940; }
				
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
				
				if (y < 0){ y = 0; }
				
				return (y+25);
			})
			.attr('x', function(d) {return xScale(d.trainer ?  trainerColumnName(d.trainer) : 'No trainer')-7;})
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
				.attr("dy", 0)
	
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
}