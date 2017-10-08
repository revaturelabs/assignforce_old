var app = angular.module('batchApp');

/*--------------------------CONTROLLER---------------------------*/

 app.controller("TimelineCtrl", function($scope, $window, batchService, calendarService, trainerService, curriculumService, settingService, locationService, buildingService, utilService){

     let privateDate = () =>
     {
         let myDate = new Date();
         return (newdate) =>
         {
             if(newdate||newdate === 0) myDate = new Date(newdate);
             return myDate;
         }
     }
     $scope.batchHasDate = function(batch) {
         return (Boolean(batch.startDate) && Boolean(batch.endDate));
     };
     $scope.batchIsInDateRange = function(batch, start, end) {
         return utilService.day.inRange(batch.startDate,start,end) || utilService.day.inRange(batch.endDate,start,end)
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

     //Generates the string used in the columns
     $scope.trainerColumnName = function(trainer)
     {
         return trainer?( trainer.firstName + " " + trainer.lastName):'No trainer';
     };

     $scope.filterBuildings = (locations) =>
         (building) =>
             (locations.includes(building.location))

     let p = () =>
     {
         let perPage = 0;
         let totalCount = 0;
         let currentPage = 1;
         let maxPage = () =>
         {
             if(totalCount > 0 && perPage > 0 && totalCount>perPage)
                return Math.ceil(totalCount / perPage);
             else
                 return 1;
         };
         return {
             perPage: (n) =>
             {
                 if(angular.isNumber(n) && n >=0) perPage = n;
                 return perPage;
             },
             totalCount: (n) =>
             {
                 if(angular.isNumber(n) && n >=0) totalCount = n;
                 return totalCount;
             },
             currentPage: (n) =>
             {
                 if(angular.isNumber(n) && n >0 && n<=maxPage()) currentPage = n;
                 return currentPage;
             },
             nextPage: ()=>
             {
                 if (currentPage < maxPage())
                     currentPage++;
             },
             previousPage: () =>
             {
                 if(currentPage > 1)
                     currentPage--;
             },
             maxPage: () => maxPage(),
             shouldPaginate: () => ( maxPage() !== 1)
         };
     };
     $scope.pagination = p();


         $scope.isLoaded = false;
     $scope.StartDate = privateDate();
     $scope.StartDate(utilService.day.addDays(new Date, -100));
     $scope.EndDate = privateDate();
     $scope.maximumDate = privateDate();
     $scope.minimumDate = privateDate();
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
     $scope.selectDatesAutomatically =true;
     $scope.completeBatchlist = [];
     $scope.completeTrainerList = [];
     $scope.noBatchesFound = false;

     //Timeline variables
     $scope.timelineFormatting =
         {
             margin_top: 76,
             margin_right: 36,
             margin_left: 75,
             margin_bottom: 0,
             // $window.innerWidth - margin_left - margin_right
             width: $window.innerWidth - 75 - 36,
             height: 2000,
             xPadding: 72,
         };
     //	function to freeze trainers names over the graph at the top of the window whenever you scroll out of the window
     let setupRenderHeaderLoop =() =>
     {
         let isRunning = false;
         let axisDisplacement = 0;
         let moveAxis = () =>
         {
             let x = document.getElementById("x axis");
             if (x !== undefined) {
                 if (x.getBoundingClientRect().top) {
                     let newAxisDisplacement = axisDisplacement - x.getBoundingClientRect().top;
                     if (newAxisDisplacement !== axisDisplacement) {
                         axisDisplacement = newAxisDisplacement;
                         if (axisDisplacement < 0) {
                             axisDisplacement = 0;
                         }
                         x.setAttribute("transform", "translate(0," + axisDisplacement + ")");
                     }
                 }
                 window.requestAnimationFrame(moveAxis);
             }
             else
             {
                 isRunning = false
             }
         };
         return () =>
         {

             if(!isRunning){
                 isRunning = true;
                 window.requestAnimationFrame(moveAxis);
             }
         }
     };
     $scope.fireRenderHeaderLoop = setupRenderHeaderLoop();

     //For displaying toast messages.
     $scope.showToast = function( message ){
         $scope.$parent.aCtrl.showToast( message );
     };


     const pull = () => {
         return Promise.all([

             //Fetches all the curricula for the controller.
             new Promise((resolve, reject) => {
                 curriculumService.getAll((response) => {
                     $scope.Curricula = response.filter((a) => (a.core));
                     $scope.Foci = response.filter((a) => !(a.core));
                     resolve(true);
                 }, () => reject("Timeline:  Could not fetch curricula."));
             }),
             //Fetches all the locations for the controller.
             new Promise((resolve, reject) => {
                 locationService.getAll((response) => {
                     $scope.Location = response;
                     resolve(true);
                 }, () => reject("Timeline:  Could not fetch locations."));
             }),
             new Promise((resolve, reject) => {
                 buildingService.getAll((response) => {
                     $scope.Buildings = response;
                     resolve(true);
                 }, () => reject("Timeline:  Could not fetch buildings."));
             }),
             //Fetches the default value for trainers displayed per page.
             new Promise((resolve, reject) => {
                 settingService.getSettingByName("trainersPerPage", (response) => {
                     $scope.pagination.perPage(response);
                     resolve(true);
                 }, () => reject("Timeline:  Could not fetch setting for default trainers per page."));
             }),
             new Promise((resolve, reject) => {
                 batchService.getAll((reponse) => {
                     $scope.completeBatchlist = reponse;
                     resolve(true);
                 }, () => reject("Timeline:  Could not fetch batches."));

             }),
             new Promise((resolve, reject) => {
                trainerService.getAll((response) => {
                     $scope.completeTrainerList = response;
                     resolve(true);
                 }, () => reject("Timeline:  Could not fetch trainers"));
             })

         ])
     };
     //actually initialize the controller
     const load = ($scope) => () =>
     {

         $scope.completeBatchlist.forEach((batch) =>
         {
             if(batch.batchLocation)
             {
                 if(batch.batchLocation.locationId)
                 {
                     batch.location = $scope.Location.find()
                 }
             }
         });

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

         $scope.firstBatchStartDate = (list) =>
         {
             return list
                 .filter($scope.batchHasDate)
                 .map((a) => a.startDate)
                 .reduce((a,b) => a>b?b:a);
         };
         $scope.lastBatchEndDate = (list) =>
         {
             return list
                 .filter($scope.batchHasDate)
                 .map((a) => a.endDate)
                 .reduce((a,b) => a<b?b:a);
         };

         //determines the maximum date of the enddate datepicker
         $scope.maximumDate(utilService.day.addDays(new Date(),365 * 2));
         $scope.minimumDate($scope.firstBatchStartDate($scope.completeBatchlist));

         //Calls for the timeline to be re-projected.
         $scope.projectTimeline = function(yOffset)
         {
             //$scope from our closure isn't up to date
             //but because this function is a member of $scope, 'this' refers to the up to date $scope
             $scope = this;

             let filteredBatchList = $scope.completeBatchlist
                 .filter($scope.batchHasDate) //makes no sense to have dateless batches on the timeline
                 .filter((batch) => Boolean(batch.trainer)) 	//never show trainerless batches
                 .filter((batch) => $scope.batchIsInDateRange(batch,$scope.StartDate(),$scope.EndDate())) //remove batches that dont fall into the time range\
                 .filter((batch) => ($scope.selectCurricula.length ===0 ||(batch.curriculum &&  $scope.selectCurricula.includes(batch.curriculum.currId)))) //filter Curricula
                 .filter((batch) => ($scope.selectFoci.length ===0 ||(batch.focus  && $scope.selectFoci.includes(batch.focus.currId)))) //filter Foci
                 .filter((batch) => ($scope.selectLocations.length ===0 ||(batch.batchLocation && $scope.selectLocations.includes(batch.batchLocation.locationId)))) //filter Locations
                 .filter((batch) => ($scope.selectBuildings.length ===0 ||(batch.batchLocation && $scope.selectBuildings.includes(batch.batchLocation.buildingId)))) //filter buildings
                 .filter((batch) => (!$scope.hideConcludedBatches || batch.endDate > new Date())) //filter running batches
                 ;

             if(filteredBatchList.length === 0)
             {
                 $scope.noBatchesFound = true;
                 return;
             }
             else
             {
                 $scope.noBatchesFound = false;
             }

             if($scope.selectDatesAutomatically) {
                 $scope.StartDate($scope.firstBatchStartDate(filteredBatchList));
                 $scope.EndDate($scope.lastBatchEndDate(filteredBatchList));
             }



             let trainerHasBatch = (trainer) =>
             {
                 return filteredBatchList.map((batch) => batch.trainer.trainerId).includes(trainer.trainerId)
             }
             let filteredTrainerList = $scope.completeTrainerList
                 .filter((trainer) => {return (trainer.active || trainerHasBatch(trainer))}) //never show inactive trainers who do not have a batch
                 .filter((trainer) => (!$scope.hideBatchlessTrainers || trainerHasBatch(trainer))) //filter batchless trainers
                 .sort($scope.compareTrainersByFirstName); //trainers must be sorted by firstname

             $scope.pagination.totalCount(filteredTrainerList.length);

             let paginatedBatchList = filteredBatchList;
             let paginatedTrainerList = filteredTrainerList;
             if($scope.pagination.shouldPaginate())
             {

                 let startIndex = ($scope.pagination.currentPage()-1) * $scope.pagination.perPage();
                 let endIndex = startIndex + $scope.pagination.perPage();
                 paginatedTrainerList = filteredTrainerList.slice(startIndex,endIndex);
                 paginatedBatchList = filteredBatchList.filter((batch) => {
                     return paginatedTrainerList
                         .map((trainer) => trainer.trainerId)
                         .includes(batch.trainer.trainerId);
                 });

             }

            $scope.renderTimeline($scope.timelineFormatting, $scope.StartDate(), $scope.EndDate(), yOffset, paginatedBatchList, $scope.$parent, calendarService.countWeeks, paginatedTrainerList);
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
             betweenBatches = betweenBatches.filter((a1) => a1 !== []).reduce((a,b) => a.concat(b), []);


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

             var xLine = svg.append('g')
                 .attr('class','x axis')
                 .attr('id','x axis')
                 .style('position','sticky')

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


             this.fireRenderHeaderLoop();
             if(timelineData.length!==null && xLine.node()!==null){
                 brect
                     .attr('class','axisrect')
                     .attr('transform','translate('+(timelineFormatting.margin_left/2)+',-'+xLine.node().getBoundingClientRect().height+')')
                     .attr('width',xLine.node().getBoundingClientRect().width+timelineFormatting.margin_left/2)
                     .attr('height',xLine.node().getBoundingClientRect().height)
                     .style('fill','white');
             }
         }



         $scope.isLoaded = true;
         $scope.projectTimeline(-100);
         $scope.projectTimeline(-100);

     };

     //Watches for "repullTimeline" to be broadcast, such that the timeline is repulled.
     let pullThenLoad = () =>
     {
         pull().then(load($scope)).catch((msgs) => console.error(msgs));
     };
     $scope.$on("repullTimeline",pullThenLoad);
     pullThenLoad();

     // $scope.$on("repullTimeline", function(){
     //    // pull().then(load($scope)).catch((msgs) => { msgs.forEach((msg) => $scope.showToast(msg)) });
     // });
     //
     // pull().then(load($scope)).catch((msgs) => console.log(msgs));
});