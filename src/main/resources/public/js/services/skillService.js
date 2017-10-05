    
    var assignforce = angular.module( "batchApp" );

    assignforce.service( "skillService", function($resource) {
        var Skill = $resource('api/v2/skill/:skillId',{skillId:'@skillId'},{update:{method:'PUT', url:'api/v2/skill'}});
        var ss = this;

        ss.getEmptySkill = function() {
            return new Skill();
        };

        ss.create = function (skill, success, error) {
            var newSkill = new Skill(skill);
            return newSkill.$save(success, error);
        };

        ss.getAll = function(success, error) {
            return Skill.query(success, error);
        };

        ss.getById = function(skillId, success, error){
            return Skill.get({skillId: skillId}, success, error);
        };

        ss.update = function(skill, success, error){
            return Skill.update(skill, success, error);
        };

        ss.delete = function(skill, success, error){
            skill.$remove(success, error);
        };
    });