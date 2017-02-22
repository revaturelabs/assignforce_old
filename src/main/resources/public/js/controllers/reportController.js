var assignforce = angular.module("batchApp");

assignforce.controller("reportCtrl", function($scope, limitToFilter, skillService, trainerService, settingService, batchService, curriculumService, monthList) {



    $scope.ideas = [
        ['ideas1', 1],
        ['ideas2', 8],
        ['ideas3', 5]
    ];

    $scope.limitedIdeas = limitToFilter($scope.ideas, 2);

    var rc = this;
    rc.data = [];
    rc.newTable = [];
    var chart;
    var chart2;


    // functions
    // calls showToast method of aCtrl
    /**************************************************************************
     * sums months for given curriculum in chosen year
     */
    rc.showToast = function(message) {
        $scope.$parent.aCtrl.showToast(message);
    };

    /*************************************************************/
    // formats data to be exported as .csv file
    /**************************************************************************
     * sums months for given curriculum in chosen year
     */
    rc.export = function() {
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
        angular.forEach(rc.curricula, function(curr) {
            var year = [curr.name];
            var sum = 0;
            rc.currSummary(curr).forEach(function(month) {
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
    /**************************************************************************
     * sums months for given curriculum in chosen year
     */
    rc.currSummary = function(curriculum) {

        var summary = [];
        var total;
        var date;

        for (var month = 0; month < 12; month++) {

            total = 0;

            for (var x = 0; x < rc.batches.length; x++) {

                date = new Date(rc.batches[x]['endDate']);

                var testToPassSonarQubeAndThisIfStatement = (
                    rc.batches[x]['curriculum'].name &&
                    curriculum &&
                    (date.getMonth() == month) &&
                    (date.getFullYear() == rc.year) &&
                    (rc.batches[x]['curriculum'].currId == curriculum.currId)
                );



                if (testToPassSonarQubeAndThisIfStatement) {
                    total += rc.graduates;
                }
            }
            summary.push(total);
        }

        return summary;
    };
    rc.currSummary2 = function(curriculum) {

        var summary2 = [];
        var total2;
        var date;


        for (var month = 0; month < 12; month++) {

            total2 = 0;

            for (var x = 0; x < rc.batches.length; x++) {
                date = new Date(rc.batches[x]['endDate']);


                var testToPassSonarQubeAndThisIfStatement = (
                    rc.batches[x]['curriculum'].name &&
                    curriculum &&
                    (date.getMonth() == month) &&
                    (date.getFullYear() == rc.year) &&
                    (rc.batches[x]['curriculum'].currId == curriculum.currId)
                );



                if (testToPassSonarQubeAndThisIfStatement) {
                    total2 += rc.incoming;
                }
            }
            summary2.push(total2);
        }
        return summary2;
    };


    /**************************************************************************
     * sums months for given curriculum in chosen year
     */
    rc.sumCurrYear = function(total, num) {
        return total + num;
    };

    // sums all curricula for the year
    /**************************************************************************
     * sums months for given curriculum in chosen year
     */
    rc.sumYear = function() {

        var total = 0;
        var summary;
        angular.forEach(rc.curricula, function(curr) {
            summary = rc.currSummary(curr);
            total += summary.reduce(rc.sumCurrYear);
        });
        return total;
    };
    rc.sumYear2 = function() {

        var total2 = 0;
        var summary;
        angular.forEach(rc.curricula, function(curr) {
            summary = rc.currSummary2(curr);
            total2 += summary.reduce(rc.sumCurrYear);
        });
        return total2;
    };

    /*************************************************************/
    // sums monthly total over all curricula
    /**************************************************************************
     * sums months for given curriculum in chosen year
     */
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
    rc.sumMonth2 = function (month) {

        if (rc.batches) {
            var total2 = 0;
            var date;
            angular.forEach(rc.batches, function (batch) {
                date = new Date(batch.endDate);
                if ((date.getMonth() == month) && (date.getFullYear() == rc.year) && (batch.curriculum)) {
                    total2 += rc.incoming;
                }
            });
            return total2;
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
        sDate.setDate( sDate.getDate() - ( 7 * (rc.defWeeks)));

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

        if ( ( neededBatches > Math.floor( neededBatches ) ) && ( neededBatches < Math.ceil(neededBatches ) ) ) {
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
                var batchVal = rc.cardArr[x].batchType.currId;

                switch(batchVal){

                    //Switch case for Java Batches
                    case 1 : 	rc.totalJavaBatch += rc.cardArr[x].requiredBatches;
                        rc.totalCumulativeBatches += rc.cardArr[x].requiredBatches;
                        break;

                    //Switch case for .Net Batches
                    case 2 : 	 rc.totalNetBatch += rc.cardArr[x].requiredBatches;
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

    rc.createBatchClick = function( index ) {

        // Create 'can submit' flag here.  '0' implies successful submit, '1' implies submission failure. Default to 1 value.
        var canSubmit;

        // Determines whether or not the user is allowed to create batches.
        canSubmit = rc.submittionValidityAssertion( index );

        if ( canSubmit == 0 ) {

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
                rc.newBatch.curriculum = rc.cardArr[index].batchType.currId;

                //Create batch method called here...
                batchService.create(rc.newBatch, success, error);
            }
        }
        function success ( ) {
                $scope.$parent.aCtrl.showToast("Successfully created Batch.");
            }

            function error ( ) {
                $scope.$parent.aCtrl.showToast("Failed to created Batch.");
            }
    };

    /************************************************************/
    /**
     * @Author:  Jaina L. Brehm
     * Description:  This method will assert that batches have valid credentials
     * 					for submission.
     *
     * @param index
     * @return canSubmit
     */

    rc.submittionValidityAssertion = function( index ){
        var flagArr = [ 0, 0, 0 ];
        var count = 0;

        if	( !( rc.cardArr[index].requiredGrads == undefined ) && !( rc.cardArr[index].reqDate == undefined ) &&
            !( rc.cardArr[index].requiredBatches == undefined ) && !( rc.cardArr[index].startDate == undefined ) &&
            !( rc.cardArr[index].formattedStartDate == undefined ) && !( rc.cardArr[index].batchType == undefined ) ) {

            var canSubmit = 0;
            rc.errMsg = "";
        }else{

            if( rc.cardArr[index].requiredGrads == undefined ){
                rc.errMsg = "Requires Trainee's.";
                flagArr[0] = 1;
            }
            if( rc.cardArr[index].reqDate == undefined ) {
                rc.errMsg = "Requires Hire Date.";
                flagArr[1] = 1;
            }
            //Ensures that the start date can't occur before the current date.
            if( rc.cardArr[index].startDate <= rc.today ){
                rc.errMsg = "Invalid Hire Date.";
                flagArr[1] = 1;
            }
            //Ensures the batch type is selected.
            if( rc.cardArr[index].batchType == undefined ) {
                rc.errMsg = "Invalid Batch Type.";
                flagArr[2] = 1;
            }
            //Checks if multiple inputs are missing or invalid.
            //Sets the error message to the appropriate phrase, if multiple inputs are missing.
            for (var x in flagArr ){
                if( flagArr.hasOwnProperty(index) ){
                    if( flagArr[x] == 1 ){
                        count = count + 1;
                        if ( count > 1 ){
                            rc.errMsg = "Multiple Inputs Required.";
                        }
                    }
                }
            }

            canSubmit = 1;
        }

        return canSubmit;
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

        // Create 'can submit' flag here.  '0' implies successful submit, '1' implies submission failure. Default to 1 value.
        var canSubmit;

        for ( var index in rc.cardArr ) {

            if( rc.cardArr.hasOwnProperty(index) ) {
                // Determines whether or not the user is allowed to create batches.
                canSubmit = rc.submittionValidityAssertion( index );
                if ( canSubmit == 0 ) {
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
                        rc.newBatch.curriculum = rc.cardArr[index].batchType.currId;

                        //Create batch method called here...
                        batchService.create(rc.newBatch, success, error);
                    }
                }
            }
        }
        function success (){
                rc.showToast("Successfully created Batch.");
            }

            function error(){
                rc.showToast("Failed to created Batch.");
            }
    };


    /*************************************************************************/
    /*************************************************************************/
    // Reports Controller Data members
    rc.year = new Date().getFullYear();


    //The date Trainee's are needed by.
    rc.reqDate = new Date();

    //Batch(s) StartDate variable.
    rc.startDate = new Date();

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
     *  to be placed within the 'cardArr' array object.
     */

    rc.newObj = {};
    rc.newObj.requiredGrads = rc.requiredGrads;
    rc.newObj.reqDate = rc.reqDate;
    rc.newObj.requiredBatches = rc.requiredBatches;
    rc.newObj.startDate = rc.startDate;
    rc.newObj.formattedStartDate = rc.formattedStartDate;
    rc.newObj.batchType = rc.batchType;

    /**
     *  Array of Required Trainee batch generation objects.
     *      Each object in the array represents a list of objects
     *      that may be required in creating a desired number of batches.
     */
    rc.cardArr = [rc.newObj];

    rc.currOrder = "name";

    rc.monthList = monthList;


    /*************************************************************************/
    /*************************************************************************/
    // data gathering
    settingService.getById(6, function(response) {
        rc.graduates = response.settingValue;
    });
    settingService.getById(7, function(response) {
        rc.batchLength = response.settingValue;
    });

    settingService.getById(8, function(response) {
        rc.incoming = response.settingValue;
    });

    // var minBatchSize;
    settingService.getById(10, function(response){
        rc.minBatchSize = response.settingValue;
    }, function(){
        rc.showToast("failure")
    });

    //var maxBatchSize = 16;
    // var maxBatchSize;
    settingService.getById(11, function(response){
        rc.maxBatchSize = response.settingValue;
    }, function(){
        rc.showToast("failure")
    });

    batchService.getAll(function(response) {
        rc.batches = response;
        // $scope.data = rc.graphData();
        // $scope.newTable = rc.graphData2();
        // data.push(tData);
    }, function() {
        rc.showToast("Could not fetch batches.");
    });


    curriculumService.getAll(function(response) {
        rc.curricula = response;
    }, function() {
        rc.showToast("Could not fetch curricula.");
    });


    // gets all trainers and stores them in variable trainers
    trainerService.getAll(function(response) {
        rc.trainers = response;
    }, function() {
        rc.showToast("Could not fetch trainers.");
    });



    // Create second var for graph tat defaults to tables default.
    rc.graphData = function() {
        var series = [];

        var curricula = rc.curricula;

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


    rc.graphData2 = function() {
        var series = [];

        var curricula = rc.curricula;

        angular.forEach(curricula, function(curr) {
            var empty = {};
            var data = [];
            empty.name = curr.name;
            rc.currSummary2(curr).forEach(function(month) {
                data.push(month);
            });

            empty.data = data;
            series.push(empty);
        });

        return series;
    };





    /**************************************************************************
     *
     */
    $scope.myGraph = function() {
        chart = new Highcharts.chart('container', {
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
        });
    };


    $scope.myGraph2 = function() {
        $scope.newTable = rc.graphData2();
        chart2 = new Highcharts.chart('container2', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Trainee Summary'
            },
            xAxis: {
                categories: monthList,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Trainees'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:15px">{point.key}</span><table>',
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
            series: rc.graphData2()
        });
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




assignforce.directive('getTrainData', function() {
    return {
        restrict: 'ACE',
        scope: true,
        template: '<div id="container2" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
        bindToController: true,
        controller: function($scope) {
            // $scope.data = rc.graphData();
            // console.log("New Data In Directive: ");
            // console.log($scope.data);
            $scope.myGraph2();
        }
    };
});




assignforce.directive('getGradTableTemplate', function() {
    // assignforce.tempTtl = 30;
    return {
        restrict: 'ACE',
        scope: true,
        templateUrl: "html/templates/gradTableTemplate.html",
        bindToController: true
    };
});

assignforce.directive('getGradGraphTemplate', function() {
    // assignforce.tempTtl = 30;
    return {
        restrict: 'ACE',
        scope: true,
        templateUrl: "html/templates/gradGraphTemplate.html",
        bindToController: true
    };
});

assignforce.directive('getIncomingTableTemplate', function() {
    // tempTtl = rc.incoming;
    return {
        restrict: 'ACE',
        scope: true,
        templateUrl: "html/templates/incomingTableTemplate.html",
        bindToController: true
    };
});


assignforce.directive('getBatchGenTemplate', function() {
    // tempTtl = rc.incoming;
    return {
        restrict: 'ACE',
        scope: true,
        templateUrl: "html/templates/batchGenTemplate.html",
        bindToController: true
    };
});



assignforce.directive('accordionDynamic', function() {
    return {
        restrict: 'ACE',
        link: function(scope, element) {
            var ele = angular.element(element);
            ele.bind('click', function() {
                ele.toggleClass('active');
                ele.next('.content').stop().slideToggle();
                ele.parents('md-card').siblings().find('md-toolbar').removeClass('active');
                return false;
            });
        }
    }
});
