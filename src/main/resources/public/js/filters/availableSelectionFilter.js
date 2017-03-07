
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
						if (i.getDay() == 6 || i.getDay() == 0){ //if we are looking at a Saturday or Sunday, go to the next day
							continue;
						}
						
						//**MAY NEED A MINOR TWEAK**\\
						//Currently, unavailability startDate is using a different time zone than endDate, not
						//sure if that makes a difference here.  Might change the pojo to use LocalDate instead of
						//a sql Timestamp, since we don't use any of that time information anyway.
						//Iterates batch dates by day
						for (var j = new Date(batchStart); j <= batchEnd ; j.setDate(j.getDate() + 1)){
							if (i.getDate() == j.getDate() && i.getMonth() == j.getMonth() && i.getFullYear() == j.getFullYear()){
								j.setDate(j.getDate() + 1);
								dayCount = dayCount + 1;
								batchStart = j;
								break;
							}
						}
						
						//If overlapped dates are 10 or greater, item is unavailable for this batch.
						//This is a predetermined number set by the client, NOT a setting
						//(although a setting may be considered for this)
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