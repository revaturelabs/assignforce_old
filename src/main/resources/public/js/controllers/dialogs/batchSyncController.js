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
<<<<<<< HEAD

    bsc.getAssignForceBatch = function(){
        return bsc.assignForceBatch;
=======
    bsc.batchInfo = [];
    bsc.sfb = batchService.getEmptyBatch();
    //console.log(bsc.sfbatches);
    if(bsc.sfbatches){
        for(i=0;i<bsc.sfbatches.length; i++){
            if(bsc.sfbatches[i].Name == bsc.afb.name){
                console.log(bsc.sfbatches[i]);
                bsc.sfb = SFService.salesforceToAssignforce(bsc.sfbatches[i],bsc.trainers,bsc.curricula);
                console.log(bsc.sfb);
                break;
            }
        }
>>>>>>> 6f759717473cdd5967d1e55cdea12c0bc9e5582b
    }

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
    bsc.refresh();

    bsc.isSynced = function(data1, data2){
        return (data1 === data2)? "" : "nonsynced";
    }

<<<<<<< HEAD
    bsc.isSameTrainer = function(trainer1, trainer2){
        if(trainer1 == null && trainer2 == null){
            return "";
        }
        if(trainer1.firstName == null && trainer1.lastName == null && trainer2.Name){
            return ((trainer1.firstName + " " + trainer1.lastName) == trainer2.Name)? "" : "nonsynced";
        }
        return (trainer1.firstName == null && trainer1.lastName == null && trainer2.Name == null)? "" : "nonsynced";
=======
    //Pushes SalesForce information to AssignForce
    bsc.syncAF = function(){
        bsc.batchInfo.map(function(e){
            if(e.salesSelect){
                e.sfunc(bsc.afb,e.vfunc(bsc.sfb));
            }
            return null;
        });
        bsc.refresh();
    }

    //Pushes changes to SalesForce
    bsc.syncSF = function(){
        bsc.batchInfo.map(function(e){
            if(e.assignSelect){
                e.sfunc(bsc.sfb,e.vfunc(bsc.afb));
            }
            return null;
        });
        bsc.refresh();
>>>>>>> 6f759717473cdd5967d1e55cdea12c0bc9e5582b
    }

    //saves changes to AssignForce & Salesforce
    bsc.save = function() {
<<<<<<< HEAD
        var batch = SFBatchService.replicateBatch(bsc.sfb, bsc.afb);

        console.log("After");
        SFBatchService.update(batch,
            function(response){
                if(bsc.sfb.Id && bsc.sfb.Id != null) {
                    SFBatchService.get(bsc.sfb.Id,
                        function(response){
                            console.log(response);
                        },
                        function(){
                            console.error("failed to fetch batch with Id " + bsc.sfb.Id);
                        });
                }else{
                    SFBatchService.get(response.id,
                        function(response){
                            console.log(response);
                        },
                        function(){
                            console.error("Failed to fetch newly created batch with id " + response.id);
                        });
                }
                bsc.afb.id = bsc.sfb.id;
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
=======
        //console.log(bsc.afb);
        //console.log(batchService.sfSyncUpdate);
        /*
        batchService.sfSyncUpdate(bsc.sfb, bsc.afb, function () {
                $mdDialog.hide();
            },
            function () {
                $mdDialog.cancel();
            });
        */
>>>>>>> 6f759717473cdd5967d1e55cdea12c0bc9e5582b
    }
});