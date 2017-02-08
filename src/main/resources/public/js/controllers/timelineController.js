var assignforce = angular.module( "batchApp" );

var app = angular.module('batchApp');

/*--------------------------CONTROLLER---------------------------*/

app.controller("TimelineCtrl", function($scope, $window, batchService, calendarService, trainerService){
    var tlc = this;

    tlc.removeNoTrainer = function(batch) {
        return (batch.trainer);
    };

	//Options for datepicker
	tlc.options = {
		datepickerMode: "month",
		minMode: "month"
	}
	
	//Timeline axis range variables
	tlc.minDate = new Date(3000, 7, 0);
	tlc.maxDate = new Date(2000, 12, 0);
	
	//Set the min and max dates based on the batches.
	tlc.getDateRange = function()
	{	
		if (tlc.batches)
		{
			var startDate;
			var endDate;
			
			for (b in tlc.batches)
			{
				if (!angular.isUndefined(tlc.batches[b].trainer) && tlc.batches[b].trainer !== null)
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
	
	$scope.$on("repullTimeline", function(event, data){
		tlc.getAllTrainers();
		tlc.getAllBatches();
	});

	tlc.getAllBatches = function()
	{
	    batchService.getAll( function(response) {
	        tlc.batches = response;
	        tlc.getDateRange();

	        if (!angular.isUndefined(tlc.trainers) && tlc.trainers !== null && !angular.isUndefined(tlc.trainerNames) && tlc.trainerNames !== null)
	        {
				projectTimeline($window.innerWidth, tlc.minDate, tlc.maxDate, 0, tlc.batches.filter(tlc.removeNoTrainer), $scope.$parent, calendarService.countWeeks, tlc.trainers);
	        }
	    }, function(error) {
	    });
	}

	tlc.getAllTrainers = function()
	{
	    trainerService.getAll( function(response) {
			tlc.trainers = response.map(function(trainer){return (trainer.trainerID)});
			tlc.trainerNames = response.map(function(trainer){return (trainer.firstName + " " + trainer.lastName)});
			tlc.getDateRange();

	        if (!angular.isUndefined(tlc.batches) && tlc.batches !== null && !angular.isUndefined(tlc.trainerNames) && tlc.trainerNames !== null)
	        {
				projectTimeline($window.innerWidth, tlc.minDate, tlc.maxDate, 0, tlc.batches.filter(tlc.removeNoTrainer), $scope.$parent, calendarService.countWeeks, tlc.trainers);
	        }
	    }, function(error) {
	    });
	}
	
	tlc.getAllBatches();

    tlc.getAllTrainers();
    
	$scope.$watch(
		function(){
			return tlc.minDate;
		},
		function(){
			if(tlc.batches !== undefined && tlc.trainers !== undefined){
				projectTimeline($window.innerWidth, tlc.minDate, tlc.maxDate, 0, tlc.batches.filter(tlc.removeNoTrainer), $scope.$parent, calendarService.countWeeks, tlc.trainers);
			}
		}
	);
	
	$scope.$watch(
		function(){
			return tlc.maxDate;
		},
		function(){
			if(tlc.batches !== undefined && tlc.trainers !== undefined) {
                projectTimeline($window.innerWidth, tlc.minDate, tlc.maxDate, 0, tlc.batches.filter(tlc.removeNoTrainer), $scope.$parent, calendarService.countWeeks, tlc.trainers);
            }
		}
	);

	// Events for the timeline

	$("#timeline").mousedown(function(evt){

		if(evt.offsetY > 30 && evt.offsetY < 1970){

			// Initial y-coordinate of the mouse
			var init = evt.offsetY - 29;
			var mousedownY = init;
			var pageY = evt.pageY;

			// Get the date with respect to the y coordinate
			var yScale = d3.time.scale()
				.domain([0,1940])
				.range([tlc.minDate, tlc.maxDate]);

			var yDate = new Date(yScale(init)).getTime();
			var diff = tlc.maxDate.getTime() - tlc.minDate.getTime();
			var topFraction = (yDate - tlc.minDate.getTime()) / diff;
			var bottomFraction = 1 - topFraction; 

			// Draw the zoompoint
			projectTimeline($window.innerWidth, tlc.minDate, tlc.maxDate, mousedownY, tlc.batches.filter(tlc.removeNoTrainer), $scope.$parent, calendarService.countWeeks, tlc.trainers);
			
			// // Fire when there is a mousemove event on the #timeline element
			$(".toastContainer").mousemove(function(evt){

				evt.preventDefault();

				// Recalculate the scaling factor based on the number of milliseconds(more accuracy) currently on the timeline
				tlc.scalingFactor = (new Date(tlc.maxDate).getTime() - new Date(tlc.minDate).getTime()) / 10;
				diff = tlc.maxDate.getTime() - tlc.minDate.getTime();

			    // If the mouse moves up
			    if(pageY > evt.pageY && diff > 1000000){

			    	// Set the newly calculated min and max dates
			    	tlc.minDate = new Date(new Date(tlc.minDate).getTime() + Math.trunc(tlc.scalingFactor * topFraction));
			    	tlc.maxDate = new Date(new Date(tlc.maxDate).getTime() - Math.trunc(tlc.scalingFactor * bottomFraction));
				
				} else if(pageY < evt.pageY && diff < 126140000000000) { // If the mouse moves down(big number is milliseconds in 4000 years)

					tlc.minDate = new Date(new Date(tlc.minDate).getTime() - Math.trunc(tlc.scalingFactor * topFraction));
					tlc.maxDate = new Date(new Date(tlc.maxDate).getTime() + Math.trunc(tlc.scalingFactor * bottomFraction));
				}

				projectTimeline($window.innerWidth, tlc.minDate, tlc.maxDate, mousedownY, tlc.batches.filter(tlc.removeNoTrainer), $scope.$parent, calendarService.countWeeks, tlc.trainers);
				
				// Update the last coordinate of the mouse
				pageY = evt.pageY;
				
			});
		}
	});

	$(".toastContainer").mouseup(function(){
		// Erase the zoompoint(or move out of view)
		projectTimeline($window.innerWidth, tlc.minDate, tlc.maxDate, -100, tlc.batches.filter(tlc.removeNoTrainer), $scope.$parent, calendarService.countWeeks, tlc.trainers);
		// Remove mousemove listener from the timeline
		$(".toastContainer").off("mousemove");
	});


});

// Draw timeline
function projectTimeline(windowWidth, minDate, maxDate, yCoord, timelineData, parentScope, numWeeks, trainerNames){
	
	//Timeline variables
	var margin = {top: 30, right: 10, bottom: 30, left:75},
	width = windowWidth - margin.left - margin.right,
	height = 2000 - margin.top - margin.bottom,
	xPadding = 50;

	//Define Scales
	var colorScale = d3.scale.category20();
	
	var yScale = d3.time.scale()
		.domain([minDate, maxDate])
		.range([0,height]);
console.log(trainerNames);
	var xScale = d3.scale.ordinal()
		.domain(trainerNames)
		.rangePoints([xPadding,width-xPadding]);
	
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
	timelineData = timelineData.filter(function(batch){
		return ((new Date(batch.startDate) <= maxDate)&&(new Date(batch.endDate) >= minDate));
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
		
		if(batchCount[timelineData[x].trainer ? (timelineData[x].trainer.trainerID) : 'No trainer'] === undefined){
			batchCount[timelineData[x].trainer ? (timelineData[x].trainer.trainerID) : 'No trainer'] = [];
		}
		
		batchCount[timelineData[x].trainer ? (timelineData[x].trainer.trainerID) : 'No trainer'].push(timelineData[x]);
	}
	
	var betweenBatches = [];
	
	for(var trainer in batchCount){
		if (batchCount.hasOwnProperty(trainer)){
			for(x = 0; x < batchCount[trainer].length-1; x++){
				var between = {x: xScale(batchCount[trainer][x].trainer ? (batchCount[trainer][x].trainer.trainerID) : 'No trainer'),
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
	
	svg = d3.select('#timeline')
		.append('svg')
			.attr('width',width + margin.left + margin.right)
			.attr('height',height + margin.bottom + margin.top)
		.append('g')
			.attr('transform','translate('+margin.left+','+margin.top+')');
			
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
			.attr('x1', function(d){return xScale(d)+lanePadding;})
			.attr('y1', 0)
			.attr('x2', function(d){return xScale(d)+lanePadding;})
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
				if (y < 0){
					y = 0;
				}
				return y;
			})
			.attr('x', function(d) {return xScale(d.trainer ? (d.trainer.trainerID) : 'No trainer')-15;})
			.attr('width', 30)
			.attr('height', function(d) {
				var start = yScale(new Date(d.startDate));
				var end = yScale(new Date(d.endDate));
				if (start < 0){
					start = 0;
				}
				if(end > height){
					end = 1940;
				}
				return end - start;
			})
			.on('mouseover', function()
			{
				//tip.show;
				d3.event.stopPropagation();
			})
			.on('mouseout', function()
			{
				//tip.hide;
				d3.event.stopPropagation();
			})
			.on('mousedown', function()
			{
				d3.event.stopPropagation();
			})
			.on('mousemove', function()
			{
				d3.event.stopPropagation();
			})
			.on('click', function(d){
				parentScope.bCtrl.highlightBatch(d);
				parentScope.$apply();
				d3.event.stopPropagation();
			})
			.style('fill', function(d) {return colorScale(d.trainer ? (d.trainer.trainerID) : 'No trainer');});
	d3.selectAll('.rect')
		.append('text')
			.attr('y', function(d) { 
				var y = yScale(new Date(d.startDate));
				if (y < 0){
					y = 0;
				}
				return (y+25);
			})
			.attr('x', function(d) {return xScale(d.trainer ? (d.trainer.trainerID) : 'No trainer')-7;})
			.text(function(d) {return numWeeks(d.startDate,d.endDate) + " W E E K S";})
				.attr("dy", 0);
	
	d3.selectAll('.rect')
		.selectAll("text")
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