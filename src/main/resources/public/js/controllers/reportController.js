// ReportsController.js

var assignforce = angular.module( "batchApp" );

assignforce.controller( "reportCtrl", function( $scope, batchService, curriculumService, monthList ) {
    //console.log("Beginning report controller.");
    var rc = this;




    $scope.options = [{
        title: 'Item1',
        content: 'Lorem Ipsum is simply dummy texts standard dummy text ever since the 1500s'
    }, {
        title: 'Item2',
        content: 'Lorem Ipsum is simply dummy texts standard dummy text ever since the 1500s'
    }, {
        title: 'Item3',
        content: 'Lorem Ipsum is simply dummy texts standard dummy text ever since the 1500s'
    }, {
        title: 'Item4',
        content: 'Lorem Ipsum is simply dummy texts standard dummy text ever since the 1500s'
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

    // data
    rc.year = new Date().getFullYear();
    rc.graduates = 15;
    rc.futureGrads = 15;

    rc.currOrder = "name";

    rc.monthList = monthList;

    // page initialization
    // data gathering
    batchService.getAll(function (response) {
        //console.log("  (RC)  Retrieving all batches.");
        rc.batches = response;
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

    // Only batches and curricula are necessary now, but these are here in the event that new reports require the use of other object lists
    // Nate Vardell Deleted the commented out block that was here because SonarQube wouldn't pass with it.
    // Contained 4 functions for getting skills, trainers, & locations.
    // I have the deleted methods if we need them in the future.


    rc.graphData = function() {
        var series = [];
        var myCur = rc.curricula;
        series.push([
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
            "December"
        ]);


        return series;
    };


    var categories = ['-55', '-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-05', '0'];
    var test1 = {name: 'Inbound',data: [29.9, 71.5, 25.4, 43.2, 37.0, 33.0, 35.6, 48.5, 21.4, 19.1, 16.6, 54.4]};
    var test2 = {name: 'Outbound',data: [19.3, 56.3, 23.1, 38.5, 32.9, 27.0, 30.6, 42.3, 17.4, 12.0, 9.1, 34.0]};


    Highcharts.chart('container', {
        options: {
            chart: {
                type: 'area'
            }
        },

        title: {
            text: 'Network Usage - Last 60 Minutes'
        },
        yAxis: {
            title: {
                text: 'Throughput MBit/s'
            }
        },
        xAxis: {
            title: {
                text: 'Minutes'
            },
            categories: categories
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        series: [
            test1,
            test2
        ]
    });






});



assignforce.directive('accordionDynamic', function(){
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
