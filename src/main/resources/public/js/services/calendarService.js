var app = angular.module( "batchApp" );

app.service( "calendarService", function(secWeek){
    var cs = this;

    cs.countWeeks = function(startDate, endDate){
        var diff = (endDate / 1000) - (startDate / 1000);
        var secondsInWeek = 604800;
        var weeks = Math.ceil(diff / secondsInWeek);
        return weeks;
    };

    cs.createDate = function(ms){
        var date = new Date(ms).toDateString();

        if(date == "Invalid Date"){
            return "";
        }
        return date;
    };
});