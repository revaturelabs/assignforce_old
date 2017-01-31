    
    var assignforce = angular.module( "batchApp" );

    assignforce.service( "skillService", function($resource) {
        var Skill = $resource('api/v2/skill/:id',{id:'@id'},{update:{method:'PUT'}});
        var ss = this;
        
        ss.create = function(skill, success, error){
            var newSkill = new Skill(skill);
            newSkill.$save(success, error);
        };

        ss.getAll = function(success, error) {
            Skill.query(success, error);
        };

        ss.getById = function(id, success, error){
            Skill.get({id: id}, success, error);
        };

        ss.update = function(skill, success, error){
            skill.$update(success, error);
        };

        ss.delete = function(skill, success, error){
            skill.$remove(success, error);
        };
    });