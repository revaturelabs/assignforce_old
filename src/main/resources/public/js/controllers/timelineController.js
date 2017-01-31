var assignforce = angular.module( "batchApp" );

var app = angular.module('batchApp');

/*--------------------------CONTROLLER---------------------------*/

app.controller("TimelineCtrl", function($scope, $window, batchService, calendarService, trainerService){
    console.log("Beginning timeline controller.");
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
	tlc.minDate = new Date(2016,7,0);
	tlc.maxDate = new Date(2017,12,0);
	
	//Project timeline when data changes
	var batches;
	var trainerNames;
	$scope.$on("repullTimeline", function(event, data){
		batchService.getAll( function(response) {
            console.log("  (TLC) Retrieving all batches.")
            tlc.batches = response;
            if (tlc.trainers) {
                projectTimeline($window.innerWidth, tlc.minDate, tlc.maxDate, tlc.batches.filter(tlc.removeNoTrainer), $scope.$parent, calendarService.countWeeks, tlc.trainers);
            }
        }, function(error) {
            console.log("  (TLC) Failed to retrieve all batches with error:", error.data.message);
        });

        trainerService.getAll( function(response) {
            console.log("  (TLC) Retrieving all trainers.")
            tlc.trainers = response.map(function(trainer){return trainer.firstName});
            if (tlc.batches) {
                projectTimeline($window.innerWidth, tlc.minDate, tlc.maxDate, tlc.batches.filter(tlc.removeNoTrainer), $scope.$parent, calendarService.countWeeks, tlc.trainers);
            }
        }, function(error) {
            console.log("  (TLC) Failed to retrieve all trainers with error:", error.data.message);
        });
	});

    batchService.getAll( function(response) {
        console.log("  (TLC) Retrieving all batches.")
        tlc.batches = response;
        if (tlc.trainers) {
			projectTimeline($window.innerWidth, tlc.minDate, tlc.maxDate, tlc.batches.filter(tlc.removeNoTrainer), $scope.$parent, calendarService.countWeeks, tlc.trainers);
        }
    }, function(error) {
        console.log("  (TLC) Failed to retrieve all batches with error:", error.data.message);
    });

    trainerService.getAll( function(response) {
        console.log("  (TLC) Retrieving all trainers.")
		tlc.trainers = response.map(function(trainer){return trainer.firstName});
        if (tlc.batches) {
			projectTimeline($window.innerWidth, tlc.minDate, tlc.maxDate, tlc.batches.filter(tlc.removeNoTrainer), $scope.$parent, calendarService.countWeeks, tlc.trainers);
        }
    }, function(error) {
        console.log("  (TLC) Failed to retrieve all trainers with error:", error.data.message);
    });
	
	$scope.$watch(
		function(){
			return tlc.minDate;
		},
		function(){
			if(tlc.batches !== undefined || tlc.trainers !== undefined){
				projectTimeline($window.innerWidth, tlc.minDate, tlc.maxDate, tlc.batches.filter(tlc.removeNoTrainer), $scope.$parent, calendarService.countWeeks, tlc.trainers);
			}
		}
	);
	
	$scope.$watch(
		function(){
			return tlc.maxDate
		},
		function(){
			if(tlc.batches !== undefined || tlc.trainers !== undefined) {
                projectTimeline($window.innerWidth, tlc.minDate, tlc.maxDate, tlc.batches.filter(tlc.removeNoTrainer), $scope.$parent, calendarService.countWeeks, tlc.trainers);
            }
		}
	);
});

function projectTimeline(windowWidth, minDate, maxDate, timelineData, parentScope, numWeeks, trainerNames){
	
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
		.tickSize(6,0);
	
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
		
		if(batchCount[timelineData[x].trainer ? timelineData[x].trainer.firstName : 'No trainer'] === undefined){
			batchCount[timelineData[x].trainer ? timelineData[x].trainer.firstName : 'No trainer'] = [];
		}
		
		batchCount[timelineData[x].trainer ? timelineData[x].trainer.firstName : 'No trainer'].push(timelineData[x]);
	}
	
	var betweenBatches = [];
	
	for(var trainer in batchCount){
		for(var x = 0; x < batchCount[trainer].length-1; x++){
			var between = {x: xScale(batchCount[trainer][x].trainer ? batchCount[trainer][x].trainer.firstName : 'No trainer'),
					y1: yScale(new Date(batchCount[trainer][x].endDate)),
					y2: yScale(new Date(batchCount[trainer][x+1].startDate)),
					length:numWeeks(batchCount[trainer][x].endDate,batchCount[trainer][x+1].startDate)};
			betweenBatches.push(between);
		}
	}
	
	var lanePadding = (xScale.range()[1]-xScale.range()[0])/2;
	
	//Create timeline
    var svg = d3.select("#timeline");
	// d3.select('svg').remove();
    svg.selectAll("*").remove();
	
	var svg = d3.select('#timeline')
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
			.attr('x', function(d) {return xScale(d.trainer ? d.trainer.firstName : 'No trainer')-15;})
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
			.on('click', function(d){parentScope.bCtrl.highlightBatch(d);parentScope.$apply();})
			.style('fill', function(d) {return colorScale(d.trainer ? d.trainer.firstName : 'No trainer');});
	d3.selectAll('.rect')
		.append('text')
			.attr('y', function(d) { 
				var y = yScale(new Date(d.startDate));
				if (y < 0){
					y = 0;
				}
				return (y+25);
			})
			.attr('x', function(d) {return xScale(d.trainer ? d.trainer.firstName : 'No trainer')-7;})
			.text(function(d) {return numWeeks(d.startDate,d.endDate);});
	
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
};