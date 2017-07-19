/**
 * Created by Zach Nelson on 2/2/2017.
 * Modified by Lazaro Perez
 */

var assignforce = angular.module( "batchApp" );

assignforce.controller( "profileCtrl", function( $scope,$resource, $http, $mdDialog, $mdToast, trainerService, roomService, skillService, s3Service, $routeParams) {
    var pc = this;
    pc.tId = $routeParams.id; //grabs the trainer id from the url to load the page with the trainer specified
    // pc.user = userSrv.getAll();
    // functions

    // calls showToast method of aCtrl
    pc.showToast = function( message ) {
        $scope.$parent.aCtrl.showToast( message );
    };

    pc.uploadResume = function () {
        var path = "Resumes/" + pc.trainer.trainerId + "_" + pc.myFile.name;

        //This initializes a bucket with the keys obtained from Creds rest controller
        var bucket = new AWS.S3({
            apiVersion: '2006-03-01',
            accessKeyId: pc.creds.ID,
            secretAccessKey: pc.creds.SecretKey,
            region: 'us-east-1',
            httpOptions:{
                proxy: 'http://dev.assignforce.revature.pro/'
            }
        });

        //set the parameters needed to put an object in the aws s3 bucket
        var params = {
            Bucket: pc.creds.BucketName,
            Key: path,
            Body: pc.myFile
        };

        //putting an object in the s3 bucket
        bucket.putObject(params, function (err) {
            if (err){
                pc.showToast("could not upload file.");
                return;
            }
        });

        pc.trainer.resume = pc.myFile.name;//set the trainer resume to the file name(s3 file key to grab that object)

        //save the modified trainer resume field
        trainerService.update(pc.trainer, function () {
            pc.showToast("Resume upload finished");
        }, function () {
            pc.showToast("Failed to upload resume");

        });

        //set my file to undefined so that update and label will be hidden in the html
        pc.myFile = undefined;
    };

    //called to save the current state of the trainers skills
    pc.saveTSkills = function () {
        trainerService.update(pc.trainer, function () {
            pc.showToast("Skills have been saved!");
        }, function () {
            pc.showToast("Could not save your skills.")
        })
    };

    //add a skill to the current trainer
    pc.addSkill = function (skill) {
        //add the skill to the trainer skill array
        for(var i = 0; i < pc.skills.length; i++){
            if(pc.skills[i].name == skill){
                pc.trainer.skills.push(pc.skills[i]);
                break;
            }
        }

        //remove the same skill from the skill list array
        for(var index = 0; index < pc.skillsList.length; index++){
            if(pc.skillsList[index] == skill){
                pc.skillsList.splice(index, 1);
                break;
            }
        }
    };

    //remove a trainer skill on the bottom
    pc.removeSkill = function (skill) {
        for(var i = 0; i < pc.trainer.skills.length; i++){
            if(pc.trainer.skills[i] == skill){
                pc.skillsList.push(skill.name);
                pc.trainer.skills.splice(i, 1);
                break;
            }
        }
    };

    //func to upload a resume to the s3 bucket
    pc.uploadCertification = function () {
        //set the path to certifications folder and use trainer id with the file name
        var path = "Certifications/" + pc.trainer.trainerId + "_" + pc.certFile.name;

        //create a certification object to save in the database
        var certification = {
            file: path,
            name: pc.certName,
            trainer: pc.trainer.trainerId
        };

        pc.trainer.certifications.push(certification); //add the certification to the trainer

        //update trainer
        trainerService.update(pc.trainer, function () {
            pc.showToast("Certification has been saved.");
        }, function () {
            pc.showToast("Failed saving Certification.");

        });

        //create a aws s3 bucket
        var bucket = new AWS.S3({
            apiVersion: '2006-03-01',
            accessKeyId: pc.creds.ID,
            secretAccessKey: pc.creds.SecretKey,
            region: 'us-east-1',
            sslEnabled: false,
            httpOptions:{
                proxy: 'http://dev.assignforce.revature.pro/'
            }
        });

        //set the parameters needed to put an object in the aws s3 bucket
        var params = {
            Bucket: pc.creds.BucketName,
            Key: path,
            Body: pc.certFile
        };

        //putting an object in the s3 bucket
        bucket.putObject(params, function (err) {
            if (err) {
                pc.showToast("File could not be uploaded.")
            }
        });

        pc.certFile = undefined;
        pc.certName = undefined;
    };

    //remove a certification from a trainer(need to remove the certification from the certification Table)
    pc.removeCertification = function (cert) {
        for (var i = 0; i < pc.trainer.certifications.length; i++){
            if(cert.name == pc.trainer.certifications[i].name){
                pc.trainer.certifications.splice(i,1);
            }
        }
        trainerService.update(pc.trainer, function () {
            pc.showToast("Removed Certification Successfully");
        }, function (err) {
            pc.showToast(err);
        });
    };

    //queries the database for skills. to be called after a change to the skills array
    pc.rePullSkills = function(){
        pc.skillsList = undefined;
        skillService.getAll( function(response) {
            pc.skillsList = response;
        }, function() {
            pc.showToast("Could not fetch skills.");
        });
    };

    //queries the database for the trainer. to be called after a change to the trainer's properties
    pc.rePullTrainer = function(){
        pc.trainer = undefined;
        trainerService.getById(pc.tId, function (response) {
            pc.trainer = response;
        }, function () {
            pc.showToast("Could not fetch trainer.");
        });
    };

    // data gathering

    // id is hard coded for testing. unless you click on a trainer in the trainer page.
    if(pc.tId){
        trainerService.getById(pc.tId, function (response) {
            pc.trainer = response;
            pc.getAllSkills();
        }, function () {
            pc.showToast("Could not fetch trainer.");
        });
    } else {
        //D1
        // var names = name.split(" ");
        // var fname = names[0];
        // var lname = names[1];
        // trainerService.getByFirstNameAndLastName(fname, lname, function(response){
        //     pc.trainer = response;
        //     pc.getAllSkills();

        trainerService.getById(1, function (response) {
            pc.trainer = response;
            pc.getAllSkills();
        }, function () {
            pc.showToast("Could not fetch trainer.");
        });
    }

    //grab credentials for s3
    s3Service.getCreds(function (response) {
        pc.creds = response;
    }, function () {
        pc.showToast("Failed to fetch Credentials")
    });

    //grab all the skills and create a skill list
    pc.getAllSkills = function(){
        skillService.getAll( function(response) {
            pc.skills = response;
            var status = true;
            for(var i = 0; i < pc.skills.length; i++) {
                for(var j = 0; j < pc.trainer.skills.length; j++) {
                    if (pc.trainer.skills[j].skillId == pc.skills[i].skillId){
                        status = false;
                        break;
                    }
                }
                if(status){
                    pc.skillsList.push(pc.skills[i].name);
                }
                status = true;
            }
        }, function () {
            pc.showToast("Could not fetch skills.");
        });
    };

    //data
    pc.skills;
    pc.myFile;
    pc.creds;
    pc.certFile;
    pc.certName;
    pc.skillsList = [];
    pc.trainer;
});
