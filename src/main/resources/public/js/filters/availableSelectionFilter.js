
var assignforce = angular.module( "batchApp" );

assignforce.filter("availableSelection", function() {
	//returns list of available items based on selected dates of batch
	return function(items, batchStart, batchEnd) {
		if(angular.isUndefined(items) || items == null || angular.isUndefined(batchStart) || angular.isUndefined(batchEnd) || batchStart == null || batchEnd == null){
			return items;
		}

		var dayCount;
		var availableitems = [];
		var tempDate = new Date(batchStart);
		
		items.forEach(function(item){ //for CANNOT be used here, must be forEach
			dayCount = 0;
			
			//Iterates through item unavailable dates.
			item.unavailabilities.forEach(function(unavailability){
				batchStart = tempDate;
				
				if (dayCount < 10){
					
					var startDate = new Date(unavailability.startDate); //cannot access day, month, or year from unavailable.startDate directly for some reason...
					var endDate = new Date(unavailability.endDate);
					
					//Iterates current unavailable date range by day
					for (var i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
						if (i.getDay() == 6 || i.getDay() == 0) //if we are looking at a Saturday or Sunday, go to the next day
							continue;
						
						//Iterates batch dates by day
						for (var j = new Date(batchStart); j.getFullYear() <= batchEnd.getFullYear() && j.getMonth() <= batchEnd.getMonth() && j.getDate() <= batchEnd.getDate(); j.setDate(j.getDate() + 1)){						
							if (i.getDate() == j.getDate() && i.getMonth() == j.getMonth() && i.getFullYear() == j.getFullYear()){
								j.setDate(j.getDate() + 1);
								dayCount = dayCount + 1;
								batchStart = j;
								break;
							}
						}
						//If overlapped dates are 10 or greater, item is unavailable for this batch.
						//This is a predetermined number set by the client
						if (dayCount == 10) {
							break;
						}
					}
				}
			});
			//If made it through all date checks, item is available for this batch
			if(dayCount < 10){
				availableitems.push(item);
			}
		});
		return availableitems;
	}
});