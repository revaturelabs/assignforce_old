/**
 * Created by AwgyD on 4/6/2017.
 */

angular.module('batchApp').filter('capitalize', function(){
    return function(input){
        if(!angular.isString(input)){
            return input;
        }
        return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
    }
})
