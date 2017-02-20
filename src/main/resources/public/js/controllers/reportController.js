var assignforce = angular.module( "batchApp" );

assignforce.controller( "reportCtrl", function( $scope, $mdPanel, settingService, batchService, curriculumService, monthList ) {

    var rc = this;

    rc.cardArr = [];


    // functions
    // calls showToast method of aCtrl
    rc.showToast = function (message) {
        $scope.$parent.aCtrl.showToast(message);
    };

    /*************************************************************/

    // formats data to be exported as .csv file
    rc.export = function () {
        var formatted = [];
        formatted.push([
            "Curriculum",
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
            "Total"
        ]);
        angular.forEach(rc.curricula, function (curr) {
            var year = [curr.name];
            var sum = 0;
            rc.currSummary(curr).forEach(function (month) {
                year.push(month);
                sum += month;
            });
            year.push(sum);

            formatted.push(year);
        });

        var totalMonth = ["Total"];
        var sumTotal = 0;
        for (var i = 0; i < 12; i++) {
            var ttl = rc.sumMonth(i);
            totalMonth.push(ttl);
            sumTotal += ttl;
        }
        totalMonth.push(sumTotal);

        formatted.push(totalMonth);

        return formatted;
    };

    /*************************************************************/

    // summarizes graduate output of given curriculum for chosen year
    rc.currSummary = function (curriculum) {

        var summary = [];
        var total;
        var date;

        for (var month = 0; month < 12; month++) {

            total = 0;

            for(var x = 0; x < rc.batches.length; x++){
                date = new Date(rc.batches[x]['endDate']);
                if (rc.batches[x]['curriculum'].name && curriculum && (date.getMonth() == month) && (date.getFullYear() == rc.year) && (rc.batches[x]['curriculum'].currId == curriculum.currId)) {
                    total += rc.graduates;
                }
            }
            summary.push(total);
        }

        return summary;
    };

    /*************************************************************/

    // sums months for given curriculum in chosen year
    rc.sumCurrYear = function (total, num) {
        return total + num;
    };

    // sums all curricula for the year
    rc.sumYear = function () {

        var total = 0;
        var summary;
        angular.forEach(rc.curricula, function (curr) {
            summary = rc.currSummary(curr);
            total += summary.reduce(rc.sumCurrYear);
        });
        return total;
    };

    /*************************************************************/

    // sums monthly total over all curricula
    rc.sumMonth = function (month) {

        if (rc.batches) {
            var total = 0;
            var date;
            angular.forEach(rc.batches, function (batch) {
                date = new Date(batch.endDate);
                if ((date.getMonth() == month) && (date.getFullYear() == rc.year) && (batch.curriculum)) {
                    total += rc.graduates;
                }
            });
            return total;
        }
    };

    /*************************************************************/
    /**
     * @Author:  Jaina L. Brehm
     * This method will compute the required batch start date,
     * 		given a required hire date.
     *
     * @param requiredDate
     * @return nothing
     */

    rc.calcStartDate = function(requiredDate, index){
    	
    	var tempDate = new Date(requiredDate);
    	
        //Initializes a start date variable and assigns it the value in 'requiredDate'.
        var sDate = ( requiredDate == undefined ) ? (new Date()) : requiredDate;
       
        //Subtract 10 weeks from the 'requiredDate' to determine the 'startDate'.  **Using 11 week default.
        sDate.setDate( sDate.getDate() - ( 7 * (rc.batchLength)));

        // This code segment allows for the batch start date to be pushed to the closest Monday.
        switch(sDate.getDay()){

            case 0 :	sDate.setDate( sDate.getDate() + 1 );
                		break;

            case 1 :	sDate.setDate( sDate.getDate() );
                		break;

            case 2 : 	sDate.setDate( sDate.getDate() - 1 );
                		break;

            case 3 :	sDate.setDate( sDate.getDate() - 2 );
                		break;

            case 4 : 	sDate.setDate( sDate.getDate() - 3 );
                		break;

            case 5 :	sDate.setDate( sDate.getDate() - 4 );
                		break;

            case 6 : 	sDate.setDate( sDate.getDate() - 5 );
                		break;

            default:	break;
        }

        var wkDayArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];

        //Formats the date to 'mm-dd-yyyy' and assigns the output for easier user visibility and comprehension.
        var formattedDate = monthList[sDate.getMonth()] + "-" + sDate.getDate() + "-" + sDate.getFullYear() + " (" + wkDayArr[sDate.getDay()] +")";

        //Assigns tempDate to the objects 'reqDate'
        rc.cardArr[index].reqDate = tempDate;
        
        //Sets the 'startDate' within 'cardArr', @ the index value, equal to the un-formatted start date.
        //This value is used when creating specific batches from the card pannel.
        rc.cardArr[index].startDate = sDate;
    	
        //Sets the 'startdate' within 'cardArr', @ the 'index' value, equal to the formatted Date.
        rc.cardArr[index].formattedStartDate = formattedDate;

    };

    /*************************************************************/
    /**
     * @Author: Jaina L. Brehm
     * This method will compute the number of batches needed to be made,
     * 		given the number of required Trainee's.
     *
     * @param requiredTrainees
     * @return neededBatches
     */

    rc.calcReqBatch = function(requiredTrainees, index){

        //Compute the total number of Batches estimated.
        var neededBatches = requiredTrainees/15;

        /**
         * 	Ensures the correct number of batches are created, regardless of any remainder of trainee's required.
         * 		Example:  If the total number of required trainee's is 40 and the average batch
         * 					size is 15, the resulting number of batches is '2.666666'.
         * 					This result should be rounded up to accommodate for the remainder.
         */
        if (( neededBatches > Math.floor(neededBatches)) && (neededBatches < Math.ceil(neededBatches))){

            neededBatches = Math.ceil( neededBatches );

        }

        /**  Sets the reportsController's 'requiredBatches' data value in each index 
         * 		of the 'cardArr' to the computed 'neededBatches' values.
         */
        rc.cardArr[index].requiredBatches = neededBatches;

        //Calculates the total number of desired batches, across all sections.
        rc.cumulativeBatches();

    };

    /*************************************************************/
    /**
     * @Author: Jaina L. Brehm
     * This method will assign the particular card objects 'btchType' variable
     * 		to the selected value.
     *
     * @param
     * @return
     */

    rc.assignCurr = function(bType, index){

        rc.cardArr[index].batchType = bType;

        if(rc.cardArr[index].requiredGrads > 0) {
        	
            rc.cumulativeBatches();
        
        }
    };

    /*************************************************************/
    /**
     * @Author: Jaina L. Brehm
     * Description:  This method will add another card to the cardArr object,
     * 					ultimately generating another card in the 'required Trainee's' tab
     * 					in the Reports tab.
     *
     * @param
     * @return
     */

    rc.genCard = function(){

        var temp = {};
    	
    	temp.requiredGrads = rc.requiredGrads;
        temp.reqDate = new Date();
        temp.requiredBatches = rc.requiredBatches;
        temp.startDate = rc.startDate;
        temp.formattedStartDate = rc.formattedStartDate;
        temp.batchType = rc.batchType;
    	
        //pushes the value onto the end of the array.
        rc.cardArr.push(temp);

    };

    /*************************************************************/
    /**
     * @Author:  Jaina L. Brehm
     * Description:  This method will delete/remove a 'card' in the cardArr object,
     * 					at a given index.  The deleted 'card' will no longer 
     * 					be displayed on the reports tab. 
     *
     * @param index
     * @return
     */
    
    rc.removeCardClick = function(index){
   
    	//Removes a card object from the array at a specifically designated index.
    	rc.cardArr.splice(index, 1);
    	
    	//Re-evaluates the cumulative batches.
    	rc.cumulativeBatches();
    	
    };
    
    /************************************************************/
    /**
     * @Author:  Jaina L. Brehm
     * Description:  This method will generate the sum of all batch types held
     * 					within the 'cardArr' variable, ultimately displaying them
     * 					in the 'master card' on the reports tab.
     *
     * @param
     * @return
     */

    rc.cumulativeBatches = function(){

        rc.totalJavaBatch = 0;
        rc.totalNetBatch = 0;
        rc.totalSDETBatch = 0;
        rc.totalCumulativeBatches = 0;

        for (var x in rc.cardArr){
            if(rc.cardArr.hasOwnProperty(x)){
                var batchVal = rc.cardArr[x].batchType.id;

                switch(batchVal){

                    //Switch case for Java Batches
                    case 1 : 	rc.totalJavaBatch += rc.cardArr[x].requiredBatches;
                        		rc.totalCumulativeBatches += rc.cardArr[x].requiredBatches;
                        		break;

                    //Switch case for .Net Batches
                    case 2 : 	rc.totalNetBatch += rc.cardArr[x].requiredBatches;
                        		rc.totalCumulativeBatches += rc.cardArr[x].requiredBatches;
                        		break;

                    //Switch case for SDET Batches
                    case 3 : 	rc.totalSDETBatch += rc.cardArr[x].requiredBatches;
                        		rc.totalCumulativeBatches += rc.cardArr[x].requiredBatches;
                        		break;

                    default: 	break;
                }
        
            }
        
        }
        
    };

    /************************************************************/
    /**
     * @Author:  Jaina L. Brehm
     * Description:  This method will generate a new 'card' in the cardArr object,
     * 					which will be displayed to the user on the reports tab. 
     *
     * @param index
     * @return
     */
    
    rc.createBatchClick = function(index){
 
    	//Create a batch object in the Reports Controller, using the batchService.
        rc.newBatch = batchService.getEmptyBatch();
        
        //Declare a generic name for batch objects being created.
        var dName = " - ";
        
        for (var i = 0; i < rc.cardArr[index].requiredBatches; i++){

        	//Assigns the 'generic name' the batch object.
            rc.newBatch.name = dName;
            
            //Assigns the 'start date' to the batch object. 
            rc.newBatch.startDate = rc.cardArr[index].startDate;
            
            //Assigns the 'end date' to the batch object.
            rc.newBatch.endDate = rc.cardArr[index].reqDate;
            
            //Assigns the 'id' value of the Curriculum ('batch type' variable) to
            //	to the batch object.
            rc.newBatch.curriculum = rc.cardArr[index].batchType.id;
            
            //Create batch method called here...
            batchService.create(rc.newBatch, success, error);
        }

        function success (){
        	$scope.$parent.aCtrl.showToast("Successfully created Batch.");
        }

        function error(){
    	   $scope.$parent.aCtrl.showToast("Failed to created Batch.");
        }
       
    };

    /************************************************************/
    /**
     * @Author:  Jaina L. Brehm
     * Description:  This method will generate all batches contained within all cards,
     * 					in the 'cardArr' array object.  All  
     *
     * @param 
     * @return
     */
    
    rc.createAllBatchClick = function(){
         
        for ( var index in rc.cardArr ) {
        
        	if(rc.cardArr.hasOwnProperty(index)){
        		
	        	//Create a batch object in the Reports Controller, using the batchService.
	            rc.newBatch = batchService.getEmptyBatch();
	            
	            //Declare a generic name for batch objects being created.
	            var dName = " - ";
	        
		        for ( var i = 0; i < rc.cardArr[index].requiredBatches; i++ ) {
		
		        	//Assigns the 'generic name' the batch object.
		            rc.newBatch.name = dName;
		            
		            //Assigns the 'start date' to the batch object. 
		            rc.newBatch.startDate = rc.cardArr[index].startDate;
		            
		            //Assigns the 'end date' to the batch object.
		            rc.newBatch.endDate = rc.cardArr[index].reqDate;
		            
		            //Assigns the 'id' value of the Curriculum ('batch type' variable) to
		            //	to the batch object.
		            rc.newBatch.curriculum = rc.cardArr[index].batchType.id;
		            
		            //Create batch method called here...
		            batchService.create(rc.newBatch, success, error);
		        }	        
        	} 
       }
        
       function success (){
       	 rc.showToast("Successfully created Batch.");
       }

       function error(){
       	 rc.showToast("Failed to created Batch.");
       }
    }
    
    /************************************************************/
    /************************************************************/

    // Reports Controller Data members
    
    rc.year = new Date().getFullYear();

    //The number of graduates.
    

    //The date Trainee's are needed by.
    rc.reqDate = new Date();
    
    //Batch(s) StartDate variable.
    rc.startDate = new Date();

    //Default batch time-period.

    //Number of Required Graduates.
    rc.requiredGrads;

    //The number of Batches needed to be created.
    rc.requiredBatches;

    //The type of a 'batch' (ie. Java, SDET, .Net, ... )
    rc.batchType;

    //Total number of .NET batches within 'cardArr'.
    rc.totalNetBatch = 0;

    //Total number of SDET batches within 'cardArr'.
    rc.totalSDETBatch = 0;

    //Total number of Java batches within 'cardArr'.
    rc.totalJavaBatch = 0;

    //Total number of required batches within 'cardArr'.
    rc.totalCumulativeBatches = 0;

    /**
     * The 'newObj' object, and it's assignments, are used to generate new objects
     * 	to be placed within the 'cardArr' array object.
     */

    rc.newObj = {};
    rc.newObj.requiredGrads = rc.requiredGrads;
    rc.newObj.reqDate = rc.reqDate;
    rc.newObj.requiredBatches = rc.requiredBatches;
    rc.newObj.startDate = rc.startDate;
    rc.newObj.formattedStartDate = rc.formattedStartDate;
    rc.newObj.batchType = rc.batchType;
    
    /**
     *	Array of Required Trainee batch generation objects.
     * 	 	Each object in the array represents a list of objects
     * 		that may be required in creating a desired number of batches.
     */
    rc.cardArr = [  rc.newObj  ];

    rc.currOrder = "name";

    rc.monthList = monthList;

    /*************************************************************/
    /*************************************************************/


    settingService.getById(6, function (response) {
        rc.graduates = response.settingValue;
    });
    settingService.getById(7, function (response) {
        rc.batchLength = response.settingValue;
    });
    settingService.getById(8, function (response) {
        rc.incoming = response.settingValue;
    });


    // settingService.getAll(function (response) {
    //     rc.settings = response;
    //     console.log(response);
    //     rc.graduates = rc.settings[1].settingValue;
    //     rc.batchLength = rc.settings[1].settingValue;
    //     // console.log(rc.testGrads);
    //     // rc.graduates = (settingService.getById(6)).settingValue;
    //     // rc.tester = settingService.getById(6);
    //     // rc.tester2 = settingService.getById(6)[0].settingValue;
    //
    //     settingService.getById(1, function (response) {
    //         rc.test = response;
    //         console.log(rc.test.settingValue);
    //     });
    //
    //     console.log(rc.test);
    //     // rc.tester2 = settingService.getById(6).settingValue;
    //
    //     // console.log(rc.tester2);
    //
    // }, function () {
    //     rc.showToast("Could not fetch settings.");
    // });

    // data gathering
    batchService.getAll(function (response) {
        rc.batches = response;
    }, function () {
        rc.showToast("Could not fetch batches.");
    });


    curriculumService.getAll(function (response) {
        rc.curricula = response;
    }, function () {
        rc.showToast("Could not fetch curricula.");
    });


    // Create second var for graph tat defaults to tables default.
    rc.graphData = function() {
        var series = [];
        // var i=1;

        var curricula = rc.curricula;

        // console.log(rc.batches);

        angular.forEach(curricula, function (curr) {
            var empty = {};
            var data = [];
            empty.name = curr.name;
            rc.currSummary(curr).forEach(function (month) {
                data.push(month);
            });

            empty.data = data;
            series.push(empty);
        });

        return series;
    };



    $scope.myGraph = function() {
        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Graduate Summary'
            },
            xAxis: {
                categories: monthList,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Graduates'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: rc.graphData()
        })};


    rc.chartOptions = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Graduate Summary'
        },
        xAxis: {
            categories: monthList,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Graduates'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: rc.graphData()
    };



    $scope.myTest = 'container2';


});


assignforce.directive('getSumTable', function() {
    return {
        restrict: 'ACE',
        scope: true,
        templateUrl: "html/templates/gradTableTemplate.html",
        // template: '<div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
        bindToController: true
    };
});


assignforce.directive('getData', function() {
    return {
        restrict: 'ACE',
        scope: true,
        template: '<div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
        bindToController: true,
        controller: function($scope) {
            $scope.myGraph();
        }
    };
});


assignforce.directive('accordionDynamic', function(){
    return{
        restrict: 'ACE',
        link: function(scope, element){
            var ele = angular.element(element);
            ele.bind('click',function(){
                ele.toggleClass('active');
                ele.next('.content').stop().slideToggle();
                ele.parents('md-card').siblings().find('md-toolbar').removeClass('active');
                // ele.parents('md-card').siblings().find('.content').slideUp();
                return false;
            });
        }
    }
});



assignforce.directive('hcPie', function () {
    return {
        restrict: 'C',
        replace: true,
        scope: true,
        controller: function ($scope, $element, $attrs) {
        },
        template: '<div id="container2" style="margin: 0 auto">not working</div>',
        link: function ($scope, element, attrs) {
            Highcharts.Chart({
                chart: {
                    renderTo: $scope.myTest,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Browser market shares January, 2015 to May, 2015'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [{
                    name: 'Brands',
                    colorByPoint: true,
                    data: [{
                        name: 'Microsoft Internet Explorer',
                        y: 56.33
                    }, {
                        name: 'Chrome',
                        y: 24.03,
                        sliced: true,
                        selected: true
                    }, {
                        name: 'Firefox',
                        y: 10.38
                    }, {
                        name: 'Safari',
                        y: 4.77
                    }, {
                        name: 'Opera',
                        y: 0.91
                    }, {
                        name: 'Proprietary or Undetectable',
                        y: 0.2
                    }]
                }]
            });
        }

    }
});
