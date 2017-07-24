var assignforce = angular.module( "batchApp" );

assignforce.controller( "batchSyncCtrl", function( $scope, $mdDialog, batchService, SFService){
    var bsc = this;
    bsc.exitbdg = function(){
        $mdDialog.cancel();
    }
    bsc.batchInfo = [];
    bsc.sfb = batchService.getEmptyBatch();

    SFService.getSFdata(
        function(resp){
            console.log("AAA");
            console.log(resp);
        },
        function(resp){
            console.log("BBB");
            console.log(resp);
        }
    );

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
    }

    bsc.refresh();
});