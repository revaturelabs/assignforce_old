var app = angular.module("batchApp");

app.service('trainerService', function($resource) {
    var Trainer = $resource('api/v2/trainer/:trainerId',{trainerId:'@trainerId'},{update:{method:'PUT', url:'api/v2/trainer'}});     
    var Trainer2 = $resource('api/v2/trainer/:firstName/:lastName',{firstName: '@firstName', lastName: '@lastName'})
    //remove url in the put method
    var ts = this;

    //created an empty Trainer
    ts.getEmptyTrainer = function () {
        return new Trainer();
    };

    //Gets all trainers in the database
    ts.getAll = function(success, error) {
        return Trainer.query(success, error);
    };

    ts.getById = function(id, success, error){
        return Trainer.get({trainerId: id}, success, error);
    };

    ts.getByFirstNameAndLastName = function(fName, lName, success, error){
        return Trainer2.get({firstName: fName, lastName: lName}, success, error);
    }

    ts.create = function (trainer, success, error) {
        return trainer.$save(success, error);
    };

    ts.update = function (trainer, success, error) {
        return Trainer.update(trainer, success, error);
    };

    ts.delete = function (id, success, error) {
        Trainer.delete({trainerId: id}, success, error);
    }
});
