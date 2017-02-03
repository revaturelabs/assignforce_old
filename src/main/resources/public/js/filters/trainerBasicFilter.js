/**
 * 
 */
var assignforce = angular.module( "batchApp" );

assignforce.filter("trainerBasic", function() {
	return function(trainer, batchStart, batchEnd) {
		return trainer;
	}
});