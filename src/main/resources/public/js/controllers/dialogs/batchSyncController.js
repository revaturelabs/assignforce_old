var assignforce = angular.module( "batchApp" );

assignforce.controller( "batchSyncCtrl", function( $scope, $mdDialog, batchService){
    var bsc = this;
    bsc.exitbdg = function(){
        $mdDialog.cancel();
    }
    bsc.batchInfo = [];
    bsc.sfb = bsc.afb;
    bsc.refresh = function(){
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
                    return l.buildingName+", "+l.locationName;
                },
                sfunc:function(b,v){b.batchLocation = v;}
            }
        ];
    }

    bsc.nullCheck = function(f,arg){
        if(arg){
            return f(arg);
        }else{
            return null;
        }
    }

    bsc.refresh();
});