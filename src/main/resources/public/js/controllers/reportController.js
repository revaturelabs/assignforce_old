var assignforce = angular.module("batchApp");

assignforce.controller("reportCtrl", function($scope, skillService, trainerService, settingService, batchService, curriculumService, monthList) {

    var rc = this;
    var chart1, chart2, canSubmit;
    rc.data = [];
    rc.newTable = [];



    /**************************************************************************
     *                                                              FUNCTIONS
     *************************************************************************/

    /* FUNCTION - Calls showToast method of aCtrl */
    rc.showToast = function(message) {
        $scope.$parent.aCtrl.showToast(message);
    };


    /* FUNCTION - Formats data to be exported as .csv file */
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
    rc.export2 = function() {
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
            rc.currSummary2(curr).forEach(function(month) {
                year.push(month);
                sum += month;
            });
            year.push(sum);

            formatted.push(year);
        });

        var totalMonth = ["Total"];
        var sumTotal = 0;
        for (var i = 0; i < 12; i++) {
            var ttl = rc.sumMonth2(i);
            totalMonth.push(ttl);
            sumTotal += ttl;
        }
        totalMonth.push(sumTotal);

        formatted.push(totalMonth);

        return formatted;
    };



    /* FUNCTION - Summarizes graduate output of given curriculum for chosen year */
    rc.currSummary = function(curriculum) {

        var summary = [];
        var total;
        var date;

        for (var month = 0; month < 12; month++) {

            total = 0;

            for (var x = 0; x < rc.batches.length; x++) {

                date = new Date(rc.batches[x]['endDate']);

                var sonarSeparationOfComplexity = rc.batches[x]['curriculum'].name;
                var testToPassSonarQubeAndThisIfStatement = (
                    curriculum &&
                    (date.getMonth() == month) &&
                    (date.getFullYear() == rc.year) &&
                    (rc.batches[x]['curriculum'].currId == curriculum.currId)
                );

                if (sonarSeparationOfComplexity && testToPassSonarQubeAndThisIfStatement) {
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

                var sonarSeparationOfComplexity = rc.batches[x]['curriculum'].name;
                var testToPassSonarQubeAndThisIfStatement = (
                    curriculum &&
                    (date.getMonth() == month) &&
                    (date.getFullYear() == rc.year) &&
                    (rc.batches[x]['curriculum'].currId == curriculum.currId)
                );


                if (sonarSeparationOfComplexity && testToPassSonarQubeAndThisIfStatement) {
                    total2 += rc.incoming;
                }
            }
            summary2.push(total2);
        }
        return summary2;
    };


    /* FUNCTION - Sums months for given curriculum in chosen year */
    rc.sumCurrYear = function(total, num) {
        return total + num;
    };


    /* FUNCTION - Sums all curricula for the year */
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



    /* FUNCTION - Sums monthly total over all curricula */
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


    /* FUNCTION - This method will compute the required batch start date, given a required hire date */
    rc.calcStartDate = function(requiredDate, index){

        var tempDate = new Date(requiredDate);

        // Initializes a start date variable and assigns it the value in 'requiredDate'.
        var sDate = ( requiredDate == undefined ) ? (new Date()) : requiredDate;

        // Subtract 10 weeks from the 'requiredDate' to determine the 'startDate'.  **Using 11 week default.
        sDate.setDate( sDate.getDate() - ( 7 * (rc.batchLength)));

        // This code segment allows for the batch start date to be pushed to the closest Monday.
        switch(sDate.getDay()){
            case 0 :    sDate.setDate( sDate.getDate() + 1 ); break;
            case 1 :    sDate.setDate( sDate.getDate() + 0 ); break;
            case 2 :    sDate.setDate( sDate.getDate() - 1 ); break;
            case 3 :    sDate.setDate( sDate.getDate() - 2 ); break;
            case 4 :    sDate.setDate( sDate.getDate() - 3 ); break;
            case 5 :    sDate.setDate( sDate.getDate() - 4 ); break;
            case 6 :    sDate.setDate( sDate.getDate() - 5 ); break;
            default:    break;
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


    /* FUNCTION - This method will compute the number of batches needed 
     *            to be made, given the number of required Trainee's. */
    rc.calcReqBatch = function(requiredTrainees, index){

        //Compute the total number of Batches estimated.
        var neededBatches = Math.ceil(requiredTrainees/15);

        /*  Sets the reportsController's 'requiredBatches' data value in each index
         *  of the 'cardArr' to the computed 'neededBatches' values. */
        rc.cardArr[index].requiredBatches = neededBatches;

        //Calculates the total number of desired batches, across all sections.
        rc.cumulativeBatches();
    };



    /* FUNCTION - This method will assign the particular card objects
     *            'btchType' variable to the selected value. */
    rc.assignCurr = function(bType, index){

        rc.cardArr[index].batchType = bType;

        if(rc.cardArr[index].requiredGrads > 0) {

            rc.cumulativeBatches();

        }
    };



    /* FUNCTION - This method will add another card to the cardArr object,
     *            ultimately generating another card in the 'required Trainee's'
     *            tab in the Reports tab. */
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



    /* FUNCTION - This method will delete/remove a 'card' in the cardArr
     *            object, at a given index.  The deleted 'card' will no
     *            longer be displayed on the reports tab. */
    rc.removeCardClick = function(index){
        rc.cardArr.splice(index, 1);  // Removes a card object from the array index
        rc.cumulativeBatches();       // Re-evaluates the cumulative batches.
    };




    /* GOING TO HAVE TO CHANGE THIS BECAUSE IT DOESN'T
     * ALLOW FOR NEW CURRICULA IN THE FUTURE.
     *
     *
     * FUNCTION - This method will generate the sum of all batch types held
     *            within the 'cardArr' variable, ultimately displaying them
     *            in the 'master card' on the reports tab. */
    rc.cumulativeBatches = function(){

        rc.totalJavaBatch = 0;
        rc.totalNetBatch = 0;
        rc.totalSDETBatch = 0;
        rc.totalCumulativeBatches = 0;

        for (var x in rc.cardArr){
            if(!(angular.isUndefined(rc.cardArr[x].batchType))){

                batchVal = rc.cardArr[x].batchType.currId;

                switch(batchVal){
                    case 1 :   //Switch case for Java Batches
                        rc.totalJavaBatch += rc.cardArr[x].requiredBatches;
                        rc.totalCumulativeBatches += rc.cardArr[x].requiredBatches;
                        break;

                    case 2 :   //Switch case for .Net Batches
                        rc.totalNetBatch += rc.cardArr[x].requiredBatches;
                        rc.totalCumulativeBatches += rc.cardArr[x].requiredBatches;
                        break;

                    case 3 :   //Switch case for SDET Batches
                        rc.totalSDETBatch += rc.cardArr[x].requiredBatches;
                        rc.totalCumulativeBatches += rc.cardArr[x].requiredBatches;
                        break;

                    default:    break;
                }
            }
        }
    };


    /* FUNCTION - This method will assert that batches have valid credentials for submission. */
    rc.submittionValidityAssertion = function( index ){
        var flagArr = [ 0, 0, 0 ];
        var count = 0;

        if  ( !( rc.cardArr[index].requiredGrads == undefined ) && !( rc.cardArr[index].reqDate == undefined ) && !( rc.cardArr[index].batchType == undefined ) ) {

            canSubmit = 0;
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

            canSubmit = 1;
        }

        //Checks if multiple inputs are missing or invalid.
        //Sets the error message to the appropriate phrase, if multiple inputs are missing.
        for ( var x in flagArr ){
            if( flagArr[x] == 1 ){
                count = count + 1;
                if ( count > 1 ){
                    rc.errMsg = "Multiple Inputs Required.";
                }
            }
        }
        return canSubmit;
    };



    /**
     * @Author:  Jaina L. Brehm
     * Description:  This method will generate a new 'card' in the cardArr object,
     *                  which will be displayed to the user on the reports tab.
     *
     * @param index
     * @return
     */
    /* FUNCTION -  */
    rc.createBatchClick = function( index ) {

        // Create 'can submit' flag here.  '0' implies successful submit, '1' implies submission failure. Default to 1 value.

        // Determines whether or not the user is allowed to create batches.
        var canSubmit = rc.submittionValidityAssertion( index );

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
                //  to the batch object.
                rc.newBatch.curriculum = rc.cardArr[index].batchType.currId;

                //Create batch method called here...
                batchService.create(rc.newBatch, success, error);
            }
        }
        function success(){ rc.showToast("Successfully Created Batch");}
        function error()  { rc.showToast("Failed to Create Batch");}
    };



    /**
     * @Author:  Jaina L. Brehm
     * Description:  This method will generate all batches contained within all cards,
     *                  in the 'cardArr' array object.  All
     *
     * @param
     * @return
     */
    /* FUNCTION -  */
    rc.createAllBatchClick = function(){

        // Create 'can submit' flag here.  '0' implies successful submit, '1' implies submission failure. Default to 1 value.
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
                        //  to the batch object.
                        rc.newBatch.curriculum = rc.cardArr[index].batchType.currId;

                        //Create batch method called here...
                        batchService.create(rc.newBatch, success, error);
                    }
                }
            }
        }
        function success(){rc.showToast("All Batches Created");}
        function error()  {rc.showToast("Failed to Create Batches");}
    };



    //toggle the Grads table and graph on and off
    /* FUNCTION -  */
    rc.toggleCrateBatchToolbar = function () {
        rc.initBatchCreate = true;

        if(rc.toggleBatch){
            rc.toggleBatch = false;
            $("#batchArrow").text("keyboard_arrow_down");
        } else {
            rc.toggleBatch = true;
            $("#batchArrow").text("keyboard_arrow_up");
        }

        $('#batchCreate').slideToggle();
    };
    rc.toggleGradToolbar = function () {
        rc.initGrad = true;

        if(rc.toggleGrad){
            rc.toggleGrad = false;
            $("#gradArrow").text("keyboard_arrow_down");
        } else {
            rc.toggleGrad = true;
            $("#gradArrow").text("keyboard_arrow_up");
        }

        $('#gradTable').slideToggle();
    };
    rc.toggleIncomingToolbar = function () {
        rc.initIncoming = true;

        if(rc.toggleIncoming){
            rc.toggleIncoming = false;
            $("#incArrow").text("keyboard_arrow_down");
        } else {
            rc.toggleIncoming = true;
            $("#incArrow").text("keyboard_arrow_up");
        }

        $('#incomingTable').slideToggle();
    };



    /**************************************************************************
     *                                            RETRIEVE DATA & SET VALUES
     *************************************************************************/
    rc.year = new Date().getFullYear(); // Gets current year
    rc.today = new Date();              // The current date.
    rc.reqDate = new Date();            // The date Trainee's are needed by.
    rc.startDate = new Date();          // Batch(s) StartDate variable.
    rc.totalNetBatch = 0;               // Total number of .NET batches within 'cardArr'.
    rc.totalSDETBatch = 0;              // Total number of SDET batches within 'cardArr'.
    rc.totalJavaBatch = 0;              // Total number of Java batches within 'cardArr'.
    rc.totalCumulativeBatches = 0;      // Total number of required batches within 'cardArr'.

    // The 'newObj' object, and it's assignments, are used to generate
    // new objects to be placed within the 'cardArr' array object.
    rc.newObj = {};
    rc.newObj.requiredGrads = rc.requiredGrads;
    rc.newObj.reqDate = rc.reqDate;
    rc.newObj.requiredBatches = rc.requiredBatches;
    rc.newObj.startDate = rc.startDate;
    rc.newObj.formattedStartDate = rc.formattedStartDate;
    rc.newObj.batchType = rc.batchType;

    rc.cardArr = [rc.newObj];   // Array of Required Trainee batch generation objects.

    rc.currOrder = "name";

    rc.monthList = monthList;

    rc.toggleBatch = true; //used to hide and show graduates card
    rc.toggleGrad = true; //used to hide and show graduates card
    rc.toggleIncoming = true; //used to hide and show incoming card
    rc.initIncoming = false;
    rc.initGrad = false;


    settingService.getById(6, function(response) {
        rc.graduates = response.settingValue;
    });


    settingService.getById(7, function(response) {
        rc.batchLength = response.settingValue;
    });


    settingService.getById(8, function(response) {
        rc.incoming = response.settingValue;
    });


    settingService.getById(10, function(response){
        rc.minBatchSize = response.settingValue;
    }, function(){
        rc.showToast("Failed to set ")
    });


    settingService.getById(11, function(response){
        rc.maxBatchSize = response.settingValue;
    }, function(){
        rc.showToast("failure")
    });


    batchService.getAll(function(response) {
        rc.batches = response;
    }, function() {
        rc.showToast("Could not fetch batches.");
    });


    curriculumService.getAll(function(response) {
        var temp = response;
        rc.curricula = temp.filter(function(t){
            return (t.core);
        });
        rc.focuses = temp.filter(function(t){
            return !(t.core);
        });
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
    /* FUNCTION -  */
    rc.graphData = function() {
        var series = [];

        angular.forEach(rc.curricula, function (curr) {
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

        angular.forEach(rc.curricula, function(curr) {
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


    /* FUNCTION -  */
    $scope.myGraph = function() {
        chart1 = new Highcharts.chart('container', {
            chart: {
                type: 'column',
                events: {
                    load: function () {

                        setInterval(function () {
                            var data = rc.graphData();

                            for(var d = 0; d<chart1.series.length; d++) {
                                chart1.series[d].setData(data[d].data, true, true, true);
                            }
                        }, 1000);
                    }
                }
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
                headerFormat: '<span style="font-size:15px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0; font-size: 14px;">{series.name}: </td>' +
                '<td style="padding:0; font-size: 14px;"><b>{point.y}</b></td></tr>',
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
        chart2 = new Highcharts.chart('container2', {
            chart: {
                animation: true,
                backgroundColor: "#555",
                borderColor: '#EBBA95',
                borderWidth: 2,
                type: 'column',
                events: {
                    load: function () {

                        setInterval(function () {
                            var data = rc.graphData2();

                            for(var d = 0; d<chart2.series.length; d++) {
                                chart2.series[d].setData(data[d].data, true, true, true);
                            }
                        }, 1000);
                    }
                }
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
                    text: 'Trainees',
                    style:{ "fontSize": "13px", "fontWeight":"bold" }
                }
            },
            tooltip: {
                headerFormat: "<span style='font-size:15px'>{point.key}</span><table>",
                pointFormat: "<tr><td style='color:{series.color};padding:0; font-size: 14px;'>{series.name}: </td>" +
                "<td style='padding:0; font-size: 14px;'><b>{point.y}</b></td></tr>",
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                },
                dataLabels: {
                    enabled: true
                }
            },
            series: rc.graphData2()
        });
    };

});
