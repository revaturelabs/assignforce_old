
    var assignforce = angular.module( "batchApp" );

    assignforce.service( "unavailableService", function($resource) {
        var Unavailable = $resource('/api/v2/unavailable/:ID',{ID: '@ID'},{update:{method:'PUT'}});
        var us = this;

        us.getEmptyUnavailable = function(){
    	    return new Unavailable();
        };

        us.create = function(unavailable, success, error){
            var newUnavailable = new Unavailable(unavailable);
            newUnavailable.$save(success, error);
        };

        us.getAll = function(success, error) {
            return Unavailable.query(success, error);
        };

        us.getById = function(id, success, error){
            return Unavailable.get({id: id}, success, error);
        };

        us.update = function(unavailable, success, error){
            unavailable.$update(success, error);
        };

        us.delete = function(unavailable, success, error){
            unavailable.$remove(success, error);
        };

    });