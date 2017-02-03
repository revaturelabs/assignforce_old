
var assignforce = angular.module( "batchApp" );

assignforce.filter("trainerSelectionFilter", function() {
	//returns true if too much overlap in unavailable dates and batch range(/config padding)
	return function(trainer, batchStart, batchEnd) {

		batchStart = new Date(batchStart.getYear(), batchStart.getMonth(), batchStart.getDay(), 0, 0, 0, 0);
		batchEnd = new Date(batchEnd.getYear(), batchEnd.getMonth(), batchStart.getDay(), 0, 0, 0, 0);

		var filtered = [];

		var count = 0;
		//Iterates through trainer unavailable dates.
		for (var unavailable in trainer.unavailable) {
			unavailable[0] = new Date(unavailable[0].getYear(), unavailable[0].getMonth(), unavailable[0].getDay(), 0, 0, 0, 0);
			unavailable[1] = new Date(unavailable[1].getYear(), unavailable[1].getMonth(), unavailable[1].getDay(), 0, 0, 0, 0);

			for (var i = trainer.unavailable[0]; i <= trainer.unavailable[1]; i.setDate(i.getDate() + 1)) {
				for (var j = batchStart; j <= batchEnd.getDate() + 14; j.setDate()) { //14 can be replaced by a config value.
					if (i == j) {
						count = count+1;
						if (count == 10)
							break;
					}
					filtered.push(item);
				}
			}

			return filtered;

		}
	}
});
