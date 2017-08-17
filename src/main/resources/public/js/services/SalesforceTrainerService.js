app.service('SFTrainerService', function($resource){
    var SFTrainerService = this;
    var Trainer = $resource("/api/v2/sfSync/trainer/:id",
        {id: '@id'},
        {
        });

    SFTrainerService.getTrainerById = function(anId, success, error){
        Trainer.get({id: anId}, success, error);
    }
});
