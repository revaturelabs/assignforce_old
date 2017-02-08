// ReportsController.js

var assignforce = angular.module( "batchApp" );

assignforce.controller( "reportCtrl", function( $scope, batchService, curriculumService, monthList ) {
    //console.log("Beginning report controller.");
    var rc = this;
    $scope.batch = [];

    $scope.name = 'This is not a name.';


    $scope.options = [{
        title: 'Graduates summary table for 2017',
        content: 'Grad - Table'
    }, {
        title: 'Graduates summary graph for 2017',
        content: 'Grad - Graph'
    }, {
        title: 'Incoming summary table for 2017',
        content: 'Incoming Table'
    }, {
        title: 'Incoming summary graph for 2017',
        content: 'Incoming Graph'
    }];





    // functions
    // calls showToast method of aCtrl
    rc.showToast = function (message) {
        $scope.$parent.aCtrl.showToast(message);
    };

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
        rc.curricula.forEach(function (curr) {
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

    // summarizes graduate output of given curriculum for chosen year
    rc.currSummary = function (curriculum) {

        var summary = [];
        var total = 0;

        for (var month = 0; month < 12; month++) {
            total = 0;
            rc.batches.forEach(function (batch) {

                if (batch.curriculum && curriculum) {
                    date = new Date(batch.endDate);
                    if ((date.getMonth() == month) && (date.getFullYear() == rc.year) && (batch.curriculum.id == curriculum.id)) {
                        total += rc.graduates;
                    }
                }
            });
            summary.push(total);
        }

        return summary;
    };

    // sums months for given curriculum in chosen year
    rc.sumCurrYear = function (total, num) {
        return total + num;
    };

    // sums all curricula for the year
    rc.sumYear = function () {

        var total = 0;
        var summary;
        rc.curricula.forEach(function (curr) {
            summary = rc.currSummary(curr);
            total += summary.reduce(rc.sumCurrYear);
        });
        return total;
    };

    // sums monthly total over all curricula
    rc.sumMonth = function (month) {

        if (rc.batches) {
            var total = 0;
            var date;
            rc.batches.forEach(function (batch) {
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
     * This method will compute the required batch start date,
     * 		given a required hire date.
     *
     * @param requiredDate
     * @return nothing
     */

    rc.calcStarDate = function(requiredDate){

        //Initializes a start date variable and assigns it the value in 'requiredDate'.
        var sDate = ( requiredDate == undefined ) ? (new Date()) : requiredDate;


        //Subtract 10 weeks from the 'requiredDate' to determine the 'startDate'.  **Using 11 week default.
        sDate.setDate( sDate.getDate() - ( 7 * (rc.defWeeks)));

        // This code segment allows for the batch start date to be pushed to the closest Monday.
        switch(sDate.getDay()){

            case 0 : sDate.setDate( sDate.getDate() + 1 );
                break;

            case 1 : sDate.setDate( sDate.getDate() );
                break;

            case 2 : sDate.setDate( sDate.getDate() - 1 );
                break;

            case 3 : sDate.setDate( sDate.getDate() - 2 );
                break;

            case 4 : sDate.setDate( sDate.getDate() - 3 );
                break;

            case 5 : sDate.setDate( sDate.getDate() - 4 );
                break;

            case 6 : sDate.setDate( sDate.getDate() -5 );
                break;

            default: break;
        }


        // var monthArr = [ 'JAN', 'FEB','MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC' ];
        // var wkDayArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];

        //Formats the date to 'mm-dd-yyyy' and assigns the output for easier user visibility and comprehension.
        var formattedDate = monthArr[sDate.getMonth()] + "-" + sDate.getDate() + "-" + sDate.getFullYear() + " (" + wkDayArr[sDate.getDay()] +")";

        //Sets the 'startdate' equal to the formatted Date.
        rc.startDate = formattedDate;

    };

    /*************************************************************/
    /**
     * This method will compute the number of batches needed to be made,
     * 		given the number of required Trainee's.
     *
     * @param requiredTrainees
     * @return neededBatches
     */

    rc.calcReqBatch = function(requiredTrainees){

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

        //Sets the reportsController's 'requiredBatches' data value to the computed 'neededBatches' values.
        rc.requiredBatches = neededBatches;

        //Returns the reqBatches variable.  Needs to be both the
        //'reqStartDate' and the 'reqBatches', at a later point.
        return neededBatches;

    };

    /*************************************************************/

    // data
    rc.year = new Date().getFullYear();

    //The number of graduates.  Used in
    rc.graduates = 15;

    //The date Trainee's are needed by.
    rc.reqDate = new Date();

    //Batch(s) StartDate variable.
    rc.startDate = new Date();

    //Default batch time-period
    rc.defWeeks = 11;

    //Number of Required Graduates
    rc.requiredGrads = 40;

    //The number of Batches needed to be created
    rc.requiredBatches = 0;

    rc.currOrder = "name";

    rc.monthList = monthList;

    var monthArr = [ 'JAN', 'FEB','MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC' ];
    var wkDayArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];

    /*************************************************************/

    // page initialization
    // data gathering
    batchService.getAll(function (response) {
        //console.log("  (RC)  Retrieving all batches.");
        rc.batches = response;
        batch = response;
    }, function (error) {
        //console.log("  (RC)  Failed to retrieve all batches with error:", error.data.message);
        rc.showToast("Could not fetch batches.");
    });

    curriculumService.getAll(function (response) {
        console.log("  (RC)  Retrieving all curricula.");
        rc.curricula = response;
        console.log(response);
    }, function (error) {
        //console.log("  (RC)  Failed to retrieve all curricula with error:", error.data.message);
        rc.showToast("Could not fetch curricula.");
    });



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
            // console.log(empty);
            series.push(empty);
            // console.log(series);
        });

        return series;
    };



    // var series = [];
    // series = rc.graphData;


    // var fake = [0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 15, 0];
    // var test = {name: '.NET', data: fake};
    //
    // var empty = {};
    // empty.name = 'Java';
    // empty.data = [0, 30, 0, 15, 0, 0, 0, 15, 0, 0, 15, 0];
    //
    // var series = [test, empty];

    var categories = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    // var series = [{"name":[".NET"],"data":[0,0,0,0,0,0,0,15,0,0,15,0]},{"name":["Java"],"data":[15,45,0,15,15,0,15,0,15,0,0,30]},{"name":["SDET"],"data":[0,0,15,0,0,15,0,0,0,15,0,0]}];





    $scope.myGraph = function() {
        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Graduate Summary'
            },
            xAxis: {
                categories: categories,
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

        rc.randomColor = function() {
            var test = Math.floor(Math.random()*16777215).toString(16);
            console.log(test);
            return test;
        };


});




assignforce.directive('getData', function() {
    return {
        restrict: 'E',
        scope: true,
        template: '<div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
        bindToController: true,
        controller: function($scope) {
            console.log("Get Data Directive.");
            $scope.myGraph();
        }
    };
});




assignforce.directive('accordionDynamic', function(){
    console.log("Accordion  Directive");
    return{
        restrict: 'ACE',
        link: function(scope, element, attributes){
            var ele = angular.element(element);
            ele.bind('click',function(){
                ele.toggleClass('active');
                ele.next('.content').stop().slideToggle();
                ele.parents('li').siblings().find('md-toolbar').removeClass('active');
                ele.parents('li').siblings().find('.content').slideUp();
                return false;
            });
        }
    }
});
