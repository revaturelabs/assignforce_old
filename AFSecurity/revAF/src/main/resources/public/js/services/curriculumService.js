var app = angular.module("batchApp");

app.service('curriculumService', function($resource) {
    var Curriculum = $resource('api/v2/curriculum/:id',{id:'@id'},{update:{method:'PUT'}});
    var cus = this;
    
    cus.create = function(curriculum, success, error){
        var newCurriculum = new Curriculum(curriculum);
        newCurriculum.$save(success, error);
    };

    cus.getAll = function(success, error) {
        Curriculum.query(success, error);
    };

    cus.getById = function(id, success, error){
        Curriculum.get({id: id}, success, error);
    };

    cus.update = function(curriculum, success, error){
        curriculum.$update(success, error);
    };

    cus.delete = function(curriculum, success, error){
        curriculum.$remove(success, error);
    };
});