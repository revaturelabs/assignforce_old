var app = angular.module("batchApp");

app.service('curriculumService', function($resource) {
    var Curriculum = $resource('api/v2/curriculum/:id',{id:'@id'},{update:{method:'PUT'}});
    var cus = this;
    
    cus.create = function(curriculum, success, error){
        var newCurriculum = new Curriculum(curriculum);
        return newCurriculum.$save(success, error);
    };

    cus.getAll = function(success, error) {
        return Curriculum.query(success, error);
    };

    cus.getById = function(id, success, error){
        return Curriculum.get({id: id}, success, error);
    };

    cus.update = function(curriculum, success, error){
        return curriculum.$update(success, error);
    };

    cus.delete = function(curriculum, success, error){
        return curriculum.$remove(success, error);
    };
});