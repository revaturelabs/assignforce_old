
var assignforce = angular.module( "batchApp" );

assignforce.filter("trainerSelection", function() {
	//returns list of available trainers based on selected dates of batch
	return function(trainers, batchStart, batchEnd) {
		if(angular.isUndefined(trainers) || trainers == null || angular.isUndefined(batchStart) || angular.isUndefined(batchEnd) || batchStart == null || batchEnd == null){
			return trainers;
		}

		var dayCount;
		var availableTrainers = [];
		var tempDate = new Date(batchStart);
		
		trainers.forEach(function(trainer){ //for CANNOT be used here, must be forEach
			dayCount = 0;
			
			//Iterates through trainer unavailable dates.
			trainer.unavailable.forEach(function(unavailable){
				batchStart = tempDate;
				
				if (dayCount < 10){
					
					var startDate = new Date(unavailable.startDate); //cannot access day, month, or year from unavailable.startDate directly for some reason...
					var endDate = new Date(unavailable.endDate);
					
					//Iterates current unavailable date range by day
					for (var i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
						
						//Iterates batch dates by day
						for (var j = new Date(batchStart); j.getFullYear() <= batchEnd.getFullYear() && j.getMonth() <= batchEnd.getMonth() && j.getDate() <= batchEnd.getDate() + 14; j.setDate(j.getDate() + 1)){//14 can be replaced by a config value.
							
							if (i.getDate() == j.getDate() && i.getMonth() == j.getMonth() && i.getFullYear() == j.getFullYear()){
								j.setDate(j.getDate() + 1);
								dayCount = dayCount + 1;
								batchStart = j;
								break;
							}
						}
						//If overlapped dates are 10 or greater, trainer is unavailable for this batch.
						//This is a predetermined number set by the client
						if (dayCount == 10) {
							break;
						}
					}
				}
			});
			//If made it through all date checks, trainer is available for this batch
			if(dayCount < 10){
				availableTrainers.push(trainer);
			}
		});
		return availableTrainers;
	}
});