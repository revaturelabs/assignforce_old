
    var assignforce = angular.module( "batchApp" );

    assignforce.filter( "availableMode", function(secWeek) {
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
            var flag = true;

            items.forEach( function(item) {
                item.unavailable.forEach( function(span) {
                    switch (mode) {
                    case "active":
                        if ( (span.startDate <= now) && (span.endDate > now) ) {
                            flag = false;
                        }
                        break;
                    case "upcoming":
                        if ( (span.startDate > now) && (span.startDate <= offset) ) {
                            flag = false;
                        }
                        break;
                    case "none":
                        break;
                    }
                });
                if (flag) {
                    result.push(item);
                }
                flag = true;
            });

            return result;
        }
    });