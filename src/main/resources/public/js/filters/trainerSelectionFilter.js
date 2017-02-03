
var assignforce = angular.module( "batchApp" );

assignforce.filter("trainerSelection", function() {
	//returns list of available trainers based on dates of batch
	return function(trainer, batchStart, batchEnd) { //note to self - maybe try just passing the batch (as single argument)
		if(batchStart && batchEnd){
		batchStart = new Date(batchStart.getYear(), batchStart.getMonth(), batchStart.getDay(), 0, 0, 0, 0);
		batchEnd = new Date(batchEnd.getYear(), batchEnd.getMonth(), batchStart.getDay(), 0, 0, 0, 0);
		}
		else {
			batchStart = new Date(0,0,0,0,0,0,0);
			batchEnd = new Date(0,0,0,0,0,0,0);
		}

		var filtered = [];

		var count;
		console.log(trainer);

		//Iterates through trainer unavailable dates.
		for (var unavailable in trainer.unavailable) {			
			if (trainer.hasOwnProperty(unavailable)) {
				count = 0;
				unavailable.startDate = new Date(unavailable.startDate.getYear(), unavailable.startDate.getMonth(), unavailable.startDate.getDay(), 0, 0, 0, 0);
				unavailable.endDate = new Date(unavailable.endDate.getYear(), unavailabe.endDate.getMonth(), unavailable.endDate.getDay(), 0, 0, 0, 0);

				//Iterates current unavailable date range by day
				for (var i = trainer.unavailable.startDate; i <= trainer.unavailable.endDate; i.setDate(i.getDate() + 1)) {
					//Iterates batch dates by day
					for (var j = batchStart; j <= batchEnd.getDate() + 14 && count < 10; j.setDate()) { //14 can be replaced by a config value.
						if (i == j)
							count = count + 1;
					}
				}
				if (count == 10) { //If overlapped dates are 10 or greater, trainer is unavailable for this batch.
					break;
				}
				filtered.push(item);
			}
		}
		return filtered;
	}
});