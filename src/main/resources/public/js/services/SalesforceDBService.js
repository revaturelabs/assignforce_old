var app = angular.module("batchApp");

app.service('SFService', function($resource) {
    var sfs = this;

    sfs.SaveSF = function(batch){
        //send to sf
        if (batch.SALESFORCEID != null) { //already has a sf id number
            var fun = function(){
                $http({
                    method: "PATCH",
                    url: "https://revature--int1.cs17.my.salesforce.com/services/data/v40.0/sobjects/Training__c/{bsc.afb.ID}",
                    data: reformatData(batch)
                }).success(function(data){
                    batch.sinked = 1;
                    //batchService.afSyncUpdate(batch);
                })
            }
        }else{ //has not been updated in sf
            var fun = function sendData(){
                $http({
                    method: "POST",
                    url: "https://revature--int1.cs17.my.salesforce.com/services/data/v40.0/sobjects/Training__c",
                    data: reformatData(batch)
                }).success(function (response) {
                    batch.SALESFORCEID = response.id;
                    batch.sinked = 1;
                    //batchService.afSyncUpdate(batch);
                });
            }
        }     
    }  
    
    sfs.reformatData= function(batch){
        //reformat af batch info to match sf
        var course;
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
                course = null;
        };

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

    sfs.getSFdata = function(){
        sfs.sfBatchs = [];
        $http({
            method: "GET",
            url: "https://revature--int1.cs17.my.salesforce.com/services/data/v40.0/sobjects/Training__c",

        }).success(function(response){
            sfs.sfBatchs = response;

        }).error(function (response){
            console.log("error getting data");
        }) 
        return sfs.sfBatchs;
    };
});