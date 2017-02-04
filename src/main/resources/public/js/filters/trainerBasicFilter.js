/**
 * 
 */
var assignforce = angular.module( "batchApp" );

assignforce.filter("trainerBasic", function() {
	return function(trainer) {
		var train = trainer;
		console.log(trainer);
		return trainer;
	}
});