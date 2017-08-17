var app = angular.module("batchApp");

app.service('SFBatchService', function($resource, locationService) {
    var SFBatchService = this;
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var SalesforceBatch = $resource("/api/v2/sfSync/batch:id",
        {id: '@id'},
        {
           save:{method:"POST", url:"/api/v2/sfSync/batch"},
           update:{method:'PATCH',url:"/api/v2/sfSync/batch"}
        });

    SFBatchService.getEmptyBatch = function(){
        return new SalesforceBatch();
    }

    SFBatchService.getBatchById = function(anId, success, error){
        SalesforceBatch.get({id: anId}, success, error)
    }

    SFBatchService.getAll = function(success, error) {
        SalesforceBatch.get(success, error);
    };

    SFBatchService.get = function(anId, success, error){
        SalesforceBatch.get({id: anId}, success, error);
    }

    SFBatchService.update = function(batch, success, error){
        batch.$update(success, error);
    }

    SFBatchService.create = function(batch, success, error){
        batch.$save(success, error);
    }

    SFBatchService.replicateBatch = function(salesforceBatch, assignforceBatch){
        console.log(assignforceBatch);
        var batch = SFBatchService.getEmptyBatch();
        batch.batch_End_Date__c = assignforceBatch.endDate;
        batch.batch_Start_Date__c = assignforceBatch.startDate;
        batch.batch_Trainer__c = (salesforceBatch.Batch_Trainer__c)? salesforceBatch.Batch_Trainer__c.Id : undefined ;
        //TODO Fix location
        batch.location = (salesforceBatch.Location && salesforceBatch.Location.includes(assignforceBatch.batchLocation.locationName))?
                salesforceBatch.Location :
            (assignforceBatch.batchLocation)? assignforceBatch.batchLocation.location
                : locationService.getById(assignforceBatch.batchLocation,
                function(response){
                    console.log(response);
                    batch.location = response.locationName;
                },
                function(){
                    console.error("failed to retrieve batch location");
                    batch.location = null;
                });
        batch.name = assignforceBatch.name;
        batch.skill_Type__c = assignforceBatch.curriculum.name;
        batch.attributes = (salesforceBatch.attributes)? salesforceBatch.attributes: undefined;
        return batch;
    }

    SFBatchService.getDateFromTimestamp = function(timestamp){
        if(timestamp) {
            var aDate = new Date(timestamp);
            return months[aDate.getDate()] + " " + aDate.getDay() + ", " + aDate.getFullYear();
        }
        return "";
    }
});