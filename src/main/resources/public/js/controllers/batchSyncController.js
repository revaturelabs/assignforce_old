var assignforce = angular.module( "batchApp" );

assignforce.controller( "batchSyncCtrl", function( $scope, $mdDialog, batchService, $http){
    var bsc = this;
    bsc.exitbdg = function(){
        $mdDialog.cancel();
    }
    bsc.batchInfo = [];
    bsc.sfb = batchService.getEmptyBatch();
    bsc.sfb.sinked = bsc.afb.sinked;
    bsc.refresh = function(){
        //vfunc - function that returns the field's value, dfunc - formats value for display, sfunc - sets field's value
        bsc.batchInfo = [
            {name:"Name",vfunc:function(b){return b.name;},dfunc:function(str){return str;},sfunc:function(b,v){b.name = v;}},
            {name:"Start Date",vfunc:function(b){return b.startDate;},dfunc:function(time){return new Date(time).toDateString();},sfunc:function(b,v){b.startDate = v;}},
            {name:"End Date",vfunc:function(b){return b.endDate;},dfunc:function(time){return new Date(time).toDateString();},sfunc:function(b,v){b.endDate = v;}},
            {name:"Curriculum",vfunc:function(b){return b.curriculum;},dfunc:function(c){return c.name;},sfunc:function(b,v){b.curriculum = v;}},
            {name:"Batch Status",vfunc:function(b){return b.batchStatus;},dfunc:function(bs){return bs.batchStatusName;},sfunc:function(b,v){b.batchStatus = v;}},
            {
                name:"Trainer",
                vfunc:function(b){return b.trainer;},
                dfunc:function(t){
                    return t.firstName+" "+t.lastName;
                },
                sfunc:function(b,v){b.trainer = v;}
            },
            {
                name:"Co-Trainer",
                vfunc:function(b){return b.coTrainer;},
                dfunc:function(t){
                    return t.firstName+" "+t.lastName;
                },
                sfunc:function(b,v){b.coTrainer = v;}
            },
            {
                name:"Skills",
                vfunc:function(b){return b.skills;},
                dfunc:function(s){
                    var out;
                    if(s.length>0){
                        out = s[0].name;
                    }else{
                        out = "";
                    }
                    for(var i = 1; i<s.length;i++){
                        out = out +", "+ s[i].name;
                    }
                    return out;
                },
                sfunc:function(b,v){b.skills = v;}
            },
            {name:"Focus",vfunc:function(b){return b.focus;},dfunc:function(f){return f.name;},sfunc:function(b,v){b.focus = v;}},
            {
                name:"Batch Location",
                vfunc:function(b){return b.batchLocation;},
                dfunc:function(l){
                    if(l.buildingName && l.locationName){
                        return l.buildingName+", "+l.locationName;
                    }else if(l.buildingName){
                        return l.buildingName;
                    }else if(l.locationName){
                        return l.locationName;
                    }else{
                        return "";
                    }
                },
                sfunc:function(b,v){b.batchLocation = v;}
            }
        ];

        bsc.batchInfo.map(function(b){
            b.style = {"background-color":(b.vfunc(bsc.afb) == b.vfunc(bsc.sfb)?"white":"lightpink")}
        });
    }

    bsc.nullCheck = function(f,arg){
        if(arg){
            return f(arg);
        }else{
            return null;
        }
    }

    bsc.syncAF = function(){
        bsc.batchInfo.map(function(e){
            if(e.salesSelect){
                e.sfunc(bsc.afb,e.vfunc(bsc.sfb));
            }
            return null;
        });
        bsc.refresh();
        //batchService.afSyncUpdate(bsc.afb,bsc.sfb,function(){
        //},function(){
        //})
    }

    bsc.syncSF = function(){
        bsc.batchInfo.map(function(e){
            if(e.assignSelect){
                e.sfunc(bsc.sfb,e.vfunc(bsc.afb));
            }
            return null;
        });
        bsc.refresh();
    }

    bsc.save = function(){
        //console.log(batchService.sfSyncUpdate);
        batchService.sfSyncUpdate(bsc.sfb,function(){
            batchService.afSyncUpdate(bsc.afb,bsc.sfb,function(){
                $mdDialog.hide();
            },function(){
                $mdDialog.cancel();
            });
        },function(){
            $mdDialog.cancel();
        });

        //send to sf
        if (bsc.afb.id == 18) { //already has a sf id number
            var fun = function(){
                $http({
                    method: "PATCH",
                    url: "https://revature--int1.cs17.my.salesforce.com/services/data/v40.0/sobjects/Training__c/{bsc.afb.ID}"
                }).success(function(data){
                    bsc.afb.sinked = 1;
                    batchService.update(bsc.afb);
                })
            }
        }else{ //has not been updated in sf
            var fun = function sendData(){
                $http({
                    method: "POST",
                    url: "https://revature--int1.cs17.my.salesforce.com/services/data/v40.0/sobjects/Training__c",
                    data: reformatData(bsc.afb)
                }).success(function (data) {
                    //need to setup method to get sf ID by course name.
                    bsc.afb.sinked = 1;
                    batchService.update(bsc.afb);
                });
            }();
        };
    };

    bsc.reformatData= function(batch){
        //reformat af batch info to match sf
        var course;
        switch (batch.curriculum){
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

    bsc.getSFdata = function(){
        var sfBatchs = [];
        $http({
            method: "GET",
            url: "https://revature--int1.cs17.my.salesforce.com/services/data/v40.0/sobjects/Training__c",

        }).success(function(response){
            sfBatchs = response;

        }).error(function (response){
            console.log("error getting data");
        }) 
        return sfBatchs;
    };

    bsc.refresh();
});
