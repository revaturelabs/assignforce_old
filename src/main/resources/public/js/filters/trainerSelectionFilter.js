
var assignforce = angular.module( "batchApp" );

assignforce.filter("trainerSelection", function() {
	//returns list of available trainers based on dates of batch
	return function(trainers, batchStart, batchEnd) {
		if(angular.isUndefined(trainers) || trainers == null || angular.isUndefined(batchStart) || angular.isUndefined(batchEnd) || batchStart == null || batchEnd == null){
			return trainers;
		}
		if(batchStart && batchEnd){
			console.log(batchStart.getFullYear());
			batchStart = new Date(batchStart.getFullYear(), batchStart.getMonth(), batchStart.getDate(), 0, 0, 0, 0);
			batchEnd = new Date(batchEnd.getFullYear(), batchEnd.getMonth(), batchStart.getDate(), 0, 0, 0, 0);
			console.log(batchStart.getFullYear());
			var temp = new Date(batchStart);
			console.log(temp.getFullYear());
		}
		else { // This should be deprecated from the big if statement above
			batchStart = new Date(0,0,0,0,0,0,0);
			batchEnd = new Date(0,0,0,0,0,0,0);
		}

		var dayCount;
		var availableTrainers = [];
		
		//These functions are valid:
		//availableTrainers.push(trainers[0]);
		//availableTrainers.push(trainers[1]);
		//return availableTrainers;
		//console.log(trainers[0].unavailable[0].startDate);
		trainers.forEach(function(trainer){
			dayCount = 0;
			console.log("Beginning trainer process.");
			console.log("Trainer: " + trainer.firstName + " " + trainer.lastName);
			console.log("Day Count: " + dayCount);
		//for(var trainer in trainers){
			//Iterates through trainer unavailable dates.
			trainer.unavailable.forEach(function(unavailable){//forEach works and for does not.  This is also stupid and I hate javascript
			//for (var unavailable in trainer.unavailable) {//No statement is passing here, but I know trainer1 has an unavailability, tested.
				//console.log(unavailable[0].startDate);
				//if (trainer.hasOwnProperty(unavailable)) {
				
				if (dayCount < 10){
					var startDate = new Date(unavailable.startDate); //cannot access day, month, or year from unavailable.startDate directly for some reason...
					var endDate = new Date(unavailable.endDate);
					//Iterates current unavailable date range by day
					console.log("Unavailable period's Start Date: " + startDate);
					console.log("Unavailable period's End Date: " + endDate);
					for (var i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
						//Iterates batch dates by day
						console.log("In the first FOR loop.");
						console.log("The condition for the next: ");
						console.log("j = batchStart; j.getFullYear() <= batchEnd.getFullYear() && j.getMonth() <= batchEnd.getMoth() && j.getDate() <= batchEnd.getDate() + 14; j.setDate(j.getDate() + 1");
						console.log("j = " + batchStart + " ; " + " " + "j.getFullYear() <= " + batchEnd.getFullYear() + " && " + "j.getMonth()" + " <= " + batchEnd.getMonth() + " && " + "j.getDate()" + " <= " + (batchEnd.getDate() + 14) + "; && dayCount < 10");
						for (var j = new Date(batchStart); j.getFullYear() <= batchEnd.getFullYear() && j.getMonth() <= batchEnd.getMonth() && j.getDate() <= batchEnd.getDate() + 14; j.setDate(j.getDate() + 1)){//<= batchEnd + 14 && dayCount < 10; j.setDate(j.getDate() + 1)) { //14 can be replaced by a config value.
							console.log("In the second FOR loop.");
							console.log("The next if statement's evaluations: ");
							console.log("i.getDate() == j.getDate() && i.getMonth() == j.getMonth() && i.getFullYear() == j.getFullYear()");
							console.log(i.getDate() + " == " + j.getDate() + " && " + i.getMonth() + " == " + j.getMonth() + " && " + i.getYear() + " == " + j.getYear());
							if (i.getDate() == j.getDate() && i.getMonth() == j.getMonth() && i.getFullYear() == j.getFullYear()){
								dayCount = dayCount + 1;
								break;
							}
							console.log("Unavailable iteration: " + i);
							console.log("Batch iteration: " + j);
							console.log("Day count: " + dayCount);
						}
						if (dayCount == 10) { //If overlapped dates are 10 or greater, trainer is unavailable for this batch.
							console.log("Day count is 10!  trainer: " + trainer.firstName + " " + trainer.lastName + " is unavailable.");
							break;
						}
						console.log("Should be only if dayCount is < 10 after all batch dates checked.  DayCount: " + dayCount);
					}
				}
				//}
				//}
			});
		//}
			if(dayCount < 10){
				console.log("About to push trainer: " + trainer.firstName + " " + trainer.lastName);
				console.log("dayCount: " + dayCount);
				availableTrainers.push(trainer);
			}
		});
		return availableTrainers;
	}
});