    
    var assignforce = angular.module( "batchApp" );

    assignforce.filter( "timeMode", function(secWeek) {
        return function(items, mode, params) {

            if (items == undefined) {
                return items;
            }
            
              // define time given number of weeks from now
            var now = new Date().getTime();
            if (mode == "upcoming") {
                var offset = now + secWeek * params.numWeeks;
            }
            var result = [];

            items.forEach( function(item) {
                switch (mode) {
                case "active":
                    if ( (item.startDate <= now) && (item.endDate > now) ) {
                        result.push(item);
                    }
                    break;
                case "upcoming":
                    if ( (item.startDate > now) && (item.startDate <= offset) ) {
                        result.push(item);
                    }
                    break;
                case "none":
                    result.push(item);
                }
            });

            return result;
        };
    });