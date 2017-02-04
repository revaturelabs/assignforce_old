
var assignforce = angular.module( "batchApp" );

assignforce.filter("trainerSelection", function() {
	//returns list of available trainers based on dates of batch
	return function(trainers, batchStart, batchEnd) {
		if(angular.isUndefined(trainers) || trainers == null || angular.isUndefined(batchStart) || angular.isUndefined(batchEnd) || batchStart == null || batchEnd == null){
			return trainers;
		}
		if(batchStart && batchEnd){
			batchStart = new Date(batchStart.getYear(), batchStart.getMonth(), batchStart.getDay(), 0, 0, 0, 0);
			batchEnd = new Date(batchEnd.getYear(), batchEnd.getMonth(), batchStart.getDay(), 0, 0, 0, 0);
		}
		else { // This should be deprecated from the big if statement above
			batchStart = new Date(0,0,0,0,0,0,0);
			batchEnd = new Date(0,0,0,0,0,0,0);
		}

		var dayCount;
		var trainerCount = 0;
		var availableTrainers = [];
		
		//These functions are valid:
		//availableTrainers.push(trainers[0]);
		//availableTrainers.push(trainers[1]);
		//return availableTrainers;
		//console.log(trainers[0].unavailable[0].startDate);
		trainers.forEach(function(trainer){
		//for(var trainer in trainers){
			//Iterates through trainer unavailable dates.
			trainer.unavailable.forEach(function(unavailable){
			//for (var unavailable in trainer.unavailable) {//No statement is passing here, but I know trainer1 has an unavailability, tested.
				//console.log(unavailable[0].startDate);
				//if (trainer.hasOwnProperty(unavailable)) {				
					console.log(unavailable);
					console.log(unavailable.endDate);
					console.log(unavailable.startDate);
					var tempdate = new Date(unavailable.startDate);
					console.log(tempdate);//output Sun Feb 19 2017 18:31:53 GMT-0500
					tempdate = new Date(tempdate.getYear(), tempdate.getMonth(), tempdate.getDay(), 0, 0, 0,0);
					console.log(tempdate);//after conversion Sun Jan 31  117 00:00:00 GMT-0500.....  wtf
					var tempdate2 = new Date();
					unavailable.startDate = new Date(unavailable.startDate.year, unavailable.startDate.month, unavailable.startDate.day, 0, 0, 0, 0);
					unavailable.endDate = new Date(unavailable.endDate.year, unavailable.endDate.month, unavailable.endDate.day, 0, 0, 0, 0);
					console.log(unavailable.startDate);
					console.log(unavailable.endDate);
					//Iterates current unavailable date range by day
					for (var i = unavailable.startDate; i <= unavailable.endDate; i.setDate(i.getDate() + 1)) {
						//Iterates batch dates by day
						for (var j = batchStart; j <= batchEnd.getDate + 14 && count < 10; j.setDate) { //14 can be replaced by a config value.
							if (i == j)
								dayCount = dayCount + 1;
						}
					}
					if (dayCount == 10) { //If overlapped dates are 10 or greater, trainer is unavailable for this batch.
						trainerCount = trainerCount +1;
						availableTrainers.push(trainers[trainerCount]);
						return;
					}
					availableTrainers.push(trainers[trainerCount]);
					trainerCount = trainerCount +1;
				//}
				//}
			});
		//}
		return availableTrainers;
		});
	}
});