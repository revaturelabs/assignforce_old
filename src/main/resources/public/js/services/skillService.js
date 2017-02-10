    
    var assignforce = angular.module( "batchApp" );

    assignforce.service( "skillService", function($resource) {
        var Skill = $resource('api/v2/skill/:id',{id:'@id'},{update:{method:'PUT', url:'api/v2/skill'}});
        var ss = this;

        ss.getEmptySkill = function() {
            return new Skill();
        };

        ss.create = function (skill, success, error) {
            skill.$save(success, error);
        }

        ss.getAll = function(success, error) {
            Skill.query(success, error);
        };

        ss.getById = function(id, success, error){
            Skill.get({id: id}, success, error);
        };

        ss.update = function(skill, success, error){
            Skill.update(skill, success, error);
        };

        ss.delete = function(skill, success, error){
            skill.$remove(success, error);
        };
    });