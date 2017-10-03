var assignforce = angular.module("batchApp");

assignforce.controller("reportCtrl", function($scope, skillService, trainerService, settingService, batchService, curriculumService, monthList) {

    var chart1, chart2, canSubmit;
    $scope.data = [];
    $scope.newTable = [];



    /**************************************************************************
     *                                            RETRIEVE DATA & SET VALUES
     *************************************************************************/
    $scope.year = new Date().getFullYear(); // Gets current year
    $scope.today = new Date();              // The current date.
    $scope.reqDate = new Date();            // The date Trainee's are needed by.
    $scope.startDate = new Date();          // Batch(s) StartDate variable.
    $scope.totalNetBatch = 0;               // Total number of .NET batches within 'cardArr'.
    $scope.totalSDETBatch = 0;              // Total number of SDET batches within 'cardArr'.
    $scope.totalJavaBatch = 0;              // Total number of Java batches within 'cardArr'.
    $scope.totalSalesforceBatch = 0;              // Total number of Java batches within 'cardArr'.
    $scope.totalBigDataBatch = 0;              // Total number of Java batches within 'cardArr'.
    $scope.totalCumulativeBatches = 0;      // Total number of required batches within 'cardArr'.

    // The 'newObj' object, and it's assignments, are used to generate
    // new objects to be placed within the 'cardArr' array object.
    $scope.newObj = {};
    $scope.newObj.requiredGrads = $scope.requiredGrads;
    $scope.newObj.reqDate = $scope.reqDate;
    $scope.newObj.requiredBatches = $scope.requiredBatches;
    $scope.newObj.startDate = $scope.startDate;
    $scope.newObj.formattedStartDate = $scope.formattedStartDate;
    $scope.newObj.batchType = $scope.batchType;

    $scope.cardArr = [$scope.newObj];   // Array of Required Trainee batch generation objects.

    $scope.currOrder = "name";

    $scope.monthList = monthList;

    $scope.toggleBatch = true;    // Used to hide and show batch gen card
    $scope.toggleGrad = true;     // Used to hide and show graduates card
    $scope.toggleIncoming = true; // Used to hide and show trainees card



    /* DATA - Grabs all of the default settings from the DB */
    settingService.getSettingByName("reportGrads", function(response) {  // Default Grads per batch

        $scope.graduates = response
    });
    settingService.getSettingByName("batchLength", function(response) {  // Default length of batches

        $scope.batchLength = response
    });
    settingService.getSettingByName("reportIncomingGrads", function(response) {  // Default trainees per batch

        $scope.incoming = response
    });

    settingService.getSettingByName("minBatchSize", function(response){  // Default minimum size for a batch

        $scope.minBatchSize = response
    });


    settingService.getSettingByName("maxBatchSize", function(response){  // Default max size for a batch

        $scope.maxBatchSize = response
    });

    /* DATA - Gets all of the batches from the DB */
    batchService.getAll(function(response) {
        $scope.batches = response;
    }, function() {
        $scope.showToast("Could not fetch batches.");
    });

    /* DATA - Gets all of the curriculum from the DB */
    curriculumService.getAll(function(response) {
        var temp = response;
        $scope.curricula = temp.filter(function(t){
            return (t.core);
        });
        $scope.focuses = temp.filter(function(t){
            return !(t.core);
        });
    }, function() {
        $scope.showToast("Could not fetch curricula.");
    });

    /* DATA - Gets all of the trainers from the DB */
    trainerService.getAll(function(response) {
        $scope.trainers = response;
    }, function() {
        $scope.showToast("Could not fetch trainers.");
    });



    /**************************************************************************
     *                                                              FUNCTIONS
     *************************************************************************/
    /* FUNCTION - Calls showToast method of aCtrl */
    $scope.showToast = function(message) {
        $scope.$parent.aCtrl.showToast(message);
    };


    /* FUNCTION - Formats data to be exported as .csv file */
    $scope.export = function() {
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
        angular.forEach($scope.curricula, function(curr) {
            var year = [curr.name];
            var sum = 0;
            $scope.currSummary(curr).forEach(function(month) {
                year.push(month);
                sum += month;
            });
            year.push(sum);

            formatted.push(year);
        });

        var totalMonth = ["Total"];
        var sumTotal = 0;
        for (var i = 0; i < 12; i++) {
            var ttl = $scope.sumMonth(i);
            totalMonth.push(ttl);
            sumTotal += ttl;
        }
        totalMonth.push(sumTotal);

        formatted.push(totalMonth);

        return formatted;
    };
    $scope.export2 = function() {
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
        angular.forEach($scope.curricula, function(curr) {
            var year = [curr.name];
            var sum = 0;
            $scope.currSummary2(curr).forEach(function(month) {
                year.push(month);
                sum += month;
            });
            year.push(sum);

            formatted.push(year);
        });

        var totalMonth = ["Total"];
        var sumTotal = 0;
        for (var i = 0; i < 12; i++) {
            var ttl = $scope.sumMonth2(i);
            totalMonth.push(ttl);
            sumTotal += ttl;
        }
        totalMonth.push(sumTotal);

        formatted.push(totalMonth);

        return formatted;
    };


    /* FUNCTION - Summarizes graduate output of given curriculum for chosen year */
    $scope.currSummary = function(curriculum) {

        var summary = [];
        var total;
        var date;

        for (var month = 0; month < 12; month++) {

            total = 0;

            for (var x = 0; x < $scope.batches.length; x++) {

                date = new Date($scope.batches[x]['endDate']);

                var sonarSeparationOfComplexity = $scope.batches[x]['curriculum'].name;
                var testToPassSonarQubeAndThisIfStatement = (
                    curriculum &&
                    (date.getMonth() === month) &&
                    (date.getFullYear() === $scope.year) &&
                    ($scope.batches[x]['curriculum'].currId === curriculum.currId)
                );

                if (sonarSeparationOfComplexity && testToPassSonarQubeAndThisIfStatement) {
                    total += $scope.graduates;
                }
            }
            summary.push(total);
        }

        return summary;
    };
    $scope.currSummary2 = function(curriculum) {

        var summary2 = [];
        var total2;
        var date;

        for (var month = 0; month < 12; month++) {

            total2 = 0;

            for (var x = 0; x < $scope.batches.length; x++) {
                date = new Date($scope.batches[x]['endDate']);

                var sonarSeparationOfComplexity = $scope.batches[x]['curriculum'].name;
                var testToPassSonarQubeAndThisIfStatement = (
                    curriculum &&
                    (date.getMonth() === month) &&
                    (date.getFullYear() === $scope.year) &&
                    ($scope.batches[x]['curriculum'].currId === curriculum.currId)
                );


                if (sonarSeparationOfComplexity && testToPassSonarQubeAndThisIfStatement) {
                    total2 += $scope.incoming;
                }
            }
            summary2.push(total2);
        }
        return summary2;
    };


    /* FUNCTION - Sums months for given curriculum in chosen year */
    $scope.sumCurrYear = function(total, num) {
        return total + num;
    };


    /* FUNCTION - Sums all curricula for the year */
    $scope.sumYear = function() {

        var total = 0;
        var summary;
        angular.forEach($scope.curricula, function(curr) {
            summary = $scope.currSummary(curr);
            total += summary.reduce($scope.sumCurrYear);
        });
        return total;
    };
    $scope.sumYear2 = function() {

        var total2 = 0;
        var summary;
        angular.forEach($scope.curricula, function(curr) {
            summary = $scope.currSummary2(curr);
            total2 += summary.reduce($scope.sumCurrYear);
        });
        return total2;
    };



    /* FUNCTION - Sums monthly total over all curricula */
    $scope.sumMonth = function (month) {

        if ($scope.batches) {
            var total = 0;
            var date;
            angular.forEach($scope.batches, function (batch) {
                date = new Date(batch.endDate);
                if ((date.getMonth() === month) && (date.getFullYear() === $scope.year) && (batch.curriculum)) {
                    total += $scope.graduates;
                }

            });
            return total;
        }
    };
    $scope.sumMonth2 = function (month) {

        if ($scope.batches) {
            var total2 = 0;
            var date;
            angular.forEach($scope.batches, function (batch) {
                date = new Date(batch.endDate);
                if ((date.getMonth() === month) && (date.getFullYear() === $scope.year) && (batch.curriculum)) {
                    total2 += $scope.incoming;
                }
            });
            return total2;
        }
    };


    /* FUNCTION - This method will compute the required batch start date, given a required hire date */
    $scope.calcStartDate = function(requiredDate, index){

        var tempDate = new Date(requiredDate);

        // Initializes a start date variable and assigns it the value in 'requiredDate'.
        var sDate = ( requiredDate === undefined ) ? (new Date()) : requiredDate;

        // Subtract 10 weeks from the 'requiredDate' to determine the 'startDate'.  **Using 11 week default.
        sDate.setDate( sDate.getDate() - ( 7 * ($scope.batchLength)));

        // This code segment allows for the batch start date to be pushed to the closest Monday.
        switch(sDate.getDay()){
            case 0 :    sDate.setDate( sDate.getDate() + 1 );
            break;
            case 1 :    sDate.setDate( sDate.getDate() + 0 );
            break;
            case 2 :    sDate.setDate( sDate.getDate() - 1 );
            break;
            case 3 :    sDate.setDate( sDate.getDate() - 2 );
            break;
            case 4 :    sDate.setDate( sDate.getDate() - 3 );
            break;
            case 5 :    sDate.setDate( sDate.getDate() - 4 );
            break;
            case 6 :    sDate.setDate( sDate.getDate() - 5 );
            break;
            default:    break;
        }

        var wkDayArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];

        //Formats the date to 'mm-dd-yyyy' and assigns the output for easier user visibility and comprehension.
        var formattedDate = monthList[sDate.getMonth()] + "-" + sDate.getDate() + "-" + sDate.getFullYear() + " (" + wkDayArr[sDate.getDay()] +")";

        //Assigns tempDate to the objects 'reqDate'
        $scope.cardArr[index].reqDate = tempDate;

        //Sets the 'startDate' within 'cardArr', @ the index value, equal to the un-formatted start date.
        //This value is used when creating specific batches from the card pannel.
        $scope.cardArr[index].startDate = sDate;

        //Sets the 'startdate' within 'cardArr', @ the 'index' value, equal to the formatted Date.
        $scope.cardArr[index].formattedStartDate = formattedDate;
    };


    /* FUNCTION - This method will compute the number of batches needed
     *            to be made, given the number of required Trainee's. */
    $scope.calcReqBatch = function(requiredTrainees, index){

        //Compute the total number of Batches estimated.
        var neededBatches = Math.ceil(requiredTrainees/15);

        /*  Sets the reportsController's 'requiredBatches' data value in each index
         *  of the 'cardArr' to the computed 'neededBatches' values. */
        $scope.cardArr[index].requiredBatches = neededBatches;

        //Calculates the total number of desired batches, across all sections.
        $scope.cumulativeBatches();
    };



    /* FUNCTION - This method will assign the particular card objects
     *            'btchType' variable to the selected value. */
    $scope.assignCurr = function(bType, index){

        $scope.cardArr[index].batchType = bType;

        if($scope.cardArr[index].requiredGrads > 0) {

            $scope.cumulativeBatches();

        }
    };



    /* FUNCTION - This method will add another card to the cardArr object,
     *            ultimately generating another card in the 'required Trainee's'
     *            tab in the Reports tab. */
    $scope.genCard = function(){

        var temp = {};

        temp.requiredGrads = $scope.requiredGrads;
        temp.reqDate = new Date();
        temp.requiredBatches = $scope.requiredBatches;
        temp.startDate = $scope.startDate;
        temp.formattedStartDate = $scope.formattedStartDate;
        temp.batchType = $scope.batchType;

        //pushes the value onto the end of the array.
        $scope.cardArr.push(temp);

    };



    /* FUNCTION - This method will delete/remove a 'card' in the cardArr
     *            object, at a given index.  The deleted 'card' will no
     *            longer be displayed on the reports tab. */
    $scope.removeCardClick = function(index){
        $scope.cardArr.splice(index, 1);  // Removes a card object from the array index
        $scope.cumulativeBatches();       // Re-evaluates the cumulative batches.
    };




    /* GOING TO HAVE TO CHANGE THIS BECAUSE IT DOESN'T
     * ALLOW FOR NEW CURRICULA IN THE FUTURE.
     *
     *
     * FUNCTION - This method will generate the sum of all batch types held
     *            within the 'cardArr' variable, ultimately displaying them
     *            in the 'master card' on the reports tab. */
    $scope.cumulativeBatches = function(){

        $scope.totalJavaBatch = 0;
        $scope.totalNetBatch = 0;
        $scope.totalSDETBatch = 0;
        $scope.totalSalesforceBatch = 0;
        $scope.totalBigDataBatch = 0;
        $scope.totalCumulativeBatches = 0;

        for (var x in $scope.cardArr){
            if(!(angular.isUndefined($scope.cardArr[x].batchType))){

                var batchVal = $scope.cardArr[x].batchType.currId;

                switch(batchVal){
                    case 1 :   //Switch case for Java Batches
                        $scope.totalJavaBatch += $scope.cardArr[x].requiredBatches;
                        $scope.totalCumulativeBatches += $scope.cardArr[x].requiredBatches;
                        break;

                    case 2 :   //Switch case for .Net Batches
                        $scope.totalNetBatch += $scope.cardArr[x].requiredBatches;
                        $scope.totalCumulativeBatches += $scope.cardArr[x].requiredBatches;
                        break;

                    case 3 :   //Switch case for SDET Batches
                        $scope.totalSDETBatch += $scope.cardArr[x].requiredBatches;
                        $scope.totalCumulativeBatches += $scope.cardArr[x].requiredBatches;
                        break;

                    case 150 :   //Switch case for Salesforce Batches
                        $scope.totalSalesforceBatch += $scope.cardArr[x].requiredBatches;
                        $scope.totalCumulativeBatches += $scope.cardArr[x].requiredBatches;
                        break;

                    case 164 :   //Switch case for Big Data Batches
                        $scope.totalBigDataBatch += $scope.cardArr[x].requiredBatches;
                        $scope.totalCumulativeBatches += $scope.cardArr[x].requiredBatches;
                        break;

                    case 105 :   //Switch case for Custom Batches
                        $scope.totalCumulativeBatches += $scope.cardArr[x].requiredBatches;
                        break;

                    default:    break;
                }
            }
        }
    };


    /* FUNCTION - This method will assert that batches have valid credentials for submission. */
    $scope.submittionValidityAssertion = function( index ){
        var flagArr = [ 0, 0, 0 ];
        var count = 0;

        if  ( !( $scope.cardArr[index].requiredGrads === undefined ) && !( $scope.cardArr[index].reqDate === undefined ) && !( $scope.cardArr[index].batchType === undefined ) ) {
            canSubmit = 0;
            $scope.errMsg = "";
        }else{
            if( $scope.cardArr[index].requiredGrads === undefined ){
                $scope.errMsg = "Requires Trainee's.";
                flagArr[0] = 1;
            }
            if( $scope.cardArr[index].reqDate === undefined ) {
                $scope.errMsg = "Requires Hire Date.";
                flagArr[1] = 1;
            }
            //Ensures that the start date can't occur before the current date.
            if( $scope.cardArr[index].startDate <= $scope.today ){
                $scope.errMsg = "Invalid Hire Date.";
                flagArr[1] = 1;
            }
            //Ensures the batch type is selected.
            if( $scope.cardArr[index].batchType === undefined ) {
                $scope.errMsg = "Invalid Batch Type.";
                flagArr[2] = 1;
            }

            canSubmit = 1;
        }

        //Checks if multiple inputs are missing or invalid.
        //Sets the error message to the appropriate phrase, if multiple inputs are missing.
        for ( var x in flagArr ){
            if( flagArr[x] === 1 ){
                count = count + 1;
                if ( count > 1 ){
                    $scope.errMsg = "Multiple Inputs Required.";
                }
            }
        }
        return canSubmit;
    };


    /* FUNCTION - This method will generate a new 'card' in the cardArr object,
     *            which will be displayed to the user on the reports tab. */
    $scope.createBatchClick = function( index ) {
        // Determines whether or not the user is allowed to create batches.
        var canSubmit = $scope.submittionValidityAssertion( index );

        if ( canSubmit === 0 ) {
            //Create a batch object in the Reports Controller, using the batchService.
            $scope.newBatch = batchService.getEmptyBatch();

            //Declare a generic name for batch objects being created.
            var dName = " - ";

            for (var i = 0; i < $scope.cardArr[index].requiredBatches; i++){

                //Assigns the 'generic name' the batch object.
                $scope.newBatch.name = dName;

                //Assigns the 'start date' to the batch object.
                $scope.newBatch.startDate = $scope.cardArr[index].startDate;

                //Assigns the 'end date' to the batch object.
                $scope.newBatch.endDate = $scope.cardArr[index].reqDate;

                //Assigns the 'id' value of the Curriculum ('batch type' variable) to the batch object.
                $scope.newBatch.curriculum = $scope.cardArr[index].batchType.currId;

                //add the default location
                settingService.getSettingByName("defaultLocation", function(setting){
                    $scope.newBatch.location = setting;
                }, null)

                //Create batch method called here...
                batchService.create($scope.newBatch, success, error);
            }
        }
        function success(){ $scope.showToast("Successfully Created Batch");}
        function error()  { $scope.showToast("Failed to Create Batch");}
    };


    /* FUNCTION - This method will generate all batches contained within all cards, in the 'cardArr' array object. */
    $scope.createAllBatchClick = function(){

        // Create 'can submit' flag here.  '0' implies successful submit, '1' implies submission failure. Default to 1 value.
        for ( var index in $scope.cardArr ) {
            if( $scope.cardArr.hasOwnProperty(index) ) {
                // Determines whether or not the user is allowed to create batches.
                canSubmit = $scope.submittionValidityAssertion( index );
                if ( canSubmit === 0 ) {
                    //Create a batch object in the Reports Controller, using the batchService.
                    $scope.newBatch = batchService.getEmptyBatch();

                    //Declare a generic name for batch objects being created.
                    var dName = " - ";

                    for ( var i = 0; i < $scope.cardArr[index].requiredBatches; i++ ) {

                        //Assigns the 'generic name' the batch object.
                        $scope.newBatch.name = dName;

                        //Assigns the 'start date' to the batch object.
                        $scope.newBatch.startDate = $scope.cardArr[index].startDate;

                        //Assigns the 'end date' to the batch object.
                        $scope.newBatch.endDate = $scope.cardArr[index].reqDate;

                        //Assigns the 'id' value of the Curriculum ('batch type' variable) to
                        //  to the batch object.
                        $scope.newBatch.curriculum = $scope.cardArr[index].batchType.currId;

                        //Create batch method called here...
                        batchService.create($scope.newBatch, success, error);
                    }
                }
            }
        }
        function success(){$scope.showToast("All Batches Created");}
        function error()  {$scope.showToast("Failed to Create Batches");}
    };



    /* FUNCTION - Toggle sections on page up and down */
    $scope.toggleCrateBatchToolbar = function () {
        $scope.initBatchCreate = true;

        if($scope.toggleBatch){
            $scope.toggleBatch = false;
            $("#batchArrow").text("keyboard_arrow_down");
        } else {
            $scope.toggleBatch = true;
            $("#batchArrow").text("keyboard_arrow_up");
        }

        $('#batchCreate').slideToggle();
    };
    $scope.toggleGradToolbar = function () {
        $scope.initGrad = true;

        if($scope.toggleGrad){
            $scope.toggleGrad = false;
            $("#gradArrow").text("keyboard_arrow_down");
        } else {
            $scope.toggleGrad = true;
            $("#gradArrow").text("keyboard_arrow_up");
        }

        $('#gradTable').slideToggle();
    };
    $scope.toggleIncomingToolbar = function () {
        $scope.initIncoming = true;

        if($scope.toggleIncoming){
            $scope.toggleIncoming = false;
            $("#incArrow").text("keyboard_arrow_down");
        } else {
            $scope.toggleIncoming = true;
            $("#incArrow").text("keyboard_arrow_up");
        }

        $('#incomingTable').slideToggle();
    };


    /* FUNCTION - Generates JSON object containing the info contained inside grad graph */
    $scope.graphData = function() {
        var series = [];

        angular.forEach($scope.curricula, function (curr) {
            var empty = {};
            var data = [];
            empty.name = curr.name;
            $scope.currSummary(curr).forEach(function (month) {
                data.push(month);
            });

            empty.data = data;
            series.push(empty);
        });
        return series;
    };


    /* FUNCTION - Generates JSON object containing the info contained inside incoming/trainee graph */
    $scope.graphData2 = function() {
        var series = [];

        angular.forEach($scope.curricula, function(curr) {
            var empty = {};
            var data = [];
            empty.name = curr.name;
            $scope.currSummary2(curr).forEach(function(month) {
                data.push(month);
            });

            empty.data = data;
            series.push(empty);
        });
        return series;
    };


    /* FUNCTION - Displays the grad graph */
    $scope.myGraph = function() {
        chart1 = new Highcharts.chart('container', {
            chart: {
                animation: true,
                type: 'column',
                events: {
                    load: function () {

                        setInterval(function () {
                            var data = $scope.graphData();

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
                    text: 'Graduates',
                    style:{ "fontSize": "13px", "fontWeight":"bold" }
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
            series: $scope.graphData()
        });
    };


    /* FUNCTION - Displays the incoming graph */
    $scope.myGraph2 = function() {
        chart2 = new Highcharts.chart('container2', {
            chart: {
                animation: true,
                type: 'column',
                events: {
                    load: function () {

                        setInterval(function () {
                            var data = $scope.graphData2();

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
            series: $scope.graphData2()
        });
    };
});
