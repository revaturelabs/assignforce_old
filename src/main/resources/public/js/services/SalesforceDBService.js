var app = angular.module("batchApp");

app.service('SFService', function($resource, $rootScope, $http) {
    var sfs = this;

    sfs.SaveSF = function(batch,succ,err){
        //send to sf
    
    sfs.reformatData= function(batch){
        //reformat af batch info to match sf
        var course;
        if(batch.curriculum){
            switch (batch.curriculum.name){
                case ".NET":
                    course = ".NET";
                    break;
                case "Java":
                    course = "J2EE";
                    break;
                case "SDET":
                    course = "JTA";
                    break;
                default:
                    course = batch.curriculum.name;
            };
        }

        var sfBatch = {
            "Name" : batch.name,
            "Batch_Trainer_c":batch.trainer, //may need .trainerId
            "Batch_Start_Date_c": batch.startDate,
            "Batch_End_Date_c": batch.endDate,
            "Skill_Type_c": course
        };

        bsc.strData = JSON.stringify(sfBatch);
        return sfBatch;
    };

    sfs.salesforceToAssignforce = function(sfBatch,trainers,curricula){
        var cur = null;
        var cname;
        switch(sfBatch.Skill_Type_c){
            case ".NET":
                cname = ".NET";
                break;
            case "J2EE":
                cname = "Java";
                break;
            case "JTA":
                cname = "SDET";
                break;
            default:
                cname = sfBatch.Skill_Type_c;
        }
        for(var i=0;i<curricula.length;i++){
            if(curricula[i].name === cname){
                cur = curricula[i];
                break;
            }
        }
        var trainer = null;
        if(sfBatch.Batch_Trainer_c){
            var tname = curricula.Batch_Trainer_c.split(" ");
            if(tname.length>=2){
                for(i=0;i<trainers.length;i++){
                    if(trainers[i].firstName === tname[0] && trainers[i].lastName === tname[1]){
                        trainer = trainers[i];
                        break;
                    }
                }
            }
        }

        var afBatch = {
            "name":sfBatch.Name,
            "trainer":trainer,
            "startDate":sfBatch.Batch_Start_Date_c,
            "endDate":sfBatch.Batch_End_Date_c,
            "curriculum":cur
        };

        return afBatch;
    }

    sfs.getSFdata = function(succ,err){
        sfs.afBatchs = [];
        $http({
            method: "GET",
            url: "https://revature--int1.cs17.my.salesforce.com/services/data/v40.0/sobjects/Training__c",
            headers:{
                "Authorization" : "Bearer" + $rootScope.token
            },

        }).success(function(response){
            succ(response);

        }).error(function (response){
            err(response);
        })
    };
});