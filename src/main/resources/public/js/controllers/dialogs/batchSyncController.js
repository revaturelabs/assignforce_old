var assignforce = angular.module( "batchApp" );

assignforce.controller( "batchSyncCtrl", function( $scope, $mdDialog, batchService, SFBatchService){
    var bsc = this;
    bsc.sfb.Co_Trainer__c = null;
    console.log(bsc.afb);
    console.log(bsc.sfb);
    console.log(bsc.afb.cotrainer == bsc.sfb.Co_Trainer__c);
    bsc.exitbdg = function(){
        $mdDialog.cancel();
    }

    bsc.showToast = function(message) {
        $scope.$parent.showToast(message);
    };

    function createSerializableBatch(incomingAssignforceBatch){
        var batch = batchService.getEmptyBatch();
        batch = batchService.getEmptyBatch();

        batch.name = incomingAssignforceBatch.name;
        batch.startDate = (incomingAssignforceBatch.startDate) ? new Date(incomingAssignforceBatch.startDate) : undefined;
        batch.endDate = (incomingAssignforceBatch.endDate) ? new Date(incomingAssignforceBatch.endDate) : undefined;
        batch.curriculum = (incomingAssignforceBatch.curriculum) ? incomingAssignforceBatch.curriculum.currId : undefined;
        batch.focus = (incomingAssignforceBatch.focus) ? incomingAssignforceBatch.focus.currId : undefined;
        batch.trainer = incomingAssignforceBatch.trainer ? incomingAssignforceBatch.trainer.trainerId : undefined;
        batch.cotrainer = (incomingAssignforceBatch.cotrainer) ? incomingAssignforceBatch.cotrainer.trainerId : undefined;
        batch.id = (incomingAssignforceBatch.id)? incomingAssignforceBatch.id : undefined;
        batch.location = incomingAssignforceBatch.batchLocation ? incomingAssignforceBatch.batchLocation.locationId : undefined;
        batch.building = incomingAssignforceBatch.batchLocation ? incomingAssignforceBatch.batchLocation.buildingId : undefined;
        batch.room = incomingAssignforceBatch.batchLocation ? incomingAssignforceBatch.batchLocation.roomId : undefined;
        return batch;
    }

    bsc.isSynced = function(data1, data2){
        return (data1 === data2)? "" : "nonsynced";
    }

    bsc.isSameTrainer = function(trainer1, trainer2){
        if(trainer1 == null && trainer2 == null){
            return "";
        }
        if(trainer1.firstName == null && trainer1.lastName == null && trainer2.Name){
            return ((trainer1.firstName + " " + trainer1.lastName) == trainer2.Name)? "" : "nonsynced";
        }
        return (trainer1.firstName == null && trainer1.lastName == null && trainer2.Name == null)? "" : "nonsynced";
    }

    //saves changes to AssignForce & Salesforce
    bsc.save = function() {
        var batch = SFBatchService.replicateBatch(bsc.sfb, bsc.afb);
        SFBatchService.update(batch,
            function(response){
                if(bsc.sfb.Id && bsc.sfb.Id != null) {
                    SFBatchService.get(bsc.sfb.Id,
                        function(response){
                            bsc.showToast("Successfuly saved changes.");
                            mdDialog.cancel();
                        },
                        function(){
                            bsc.showToast("failed to fetch batch with Id " + bsc.sfb.Id);
                        });
                }else{
                    SFBatchService.get(response.id,
                        function(response){
                            bsc.showToast("Successfuly updated batch");
                            mdDialog.dismiss();
                        },
                        function(){
                            bsc.showToast("Failed to fetch updated batch with id " + response.id);
                        });
                }
                // bsc.afb.id = bsc.sfb.id;
                bsc.stash();
            },
            function(){
                console.error("failed to sync");
            })
    }

    bsc.stash = function(){
        batchService.update(createSerializableBatch(bsc.afb), function(response){
        },
        function(){
            console.error("failed to sync");
        })
    }

    bsc.getDateFromTimestamp = function(timestamp){
        return SFBatchService.getDateFromTimestamp(timestamp);
    }

});