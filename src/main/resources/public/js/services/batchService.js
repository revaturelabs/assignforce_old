var app = angular.module("batchApp");

app.service('batchService', function($resource) {
    var Batch = $resource('api/v2/batch/:id',{id: '@id'},{ save:{method:"POST",url:"api/v2/batch"}, update:{method:'PUT',url:'api/v2/batch'} });
    var bs = this;

    bs.getEmptyBatch = function(){
    	return new Batch();
    };
    
    bs.create = function(batch, success, error){
        return batch.$save(success, error);
    };

    bs.getAll = function(success, error) {
        return Batch.query(success, error);
    };

    bs.getById = function(id, success, error){
        return Batch.get({id: id}, success, error);
    };

    bs.update = function(batch, success, error){
        return batch.$update(success, error);
    };

    bs.delete = function(batch, success, error){
        batch.$remove(success, error);
    }

});