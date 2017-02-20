/**
 * Created by lazar on 2/20/2017.
 */
var assignforce = angular.module( "batchApp" );

assignforce.filter( "inactiveItem", function(){
    return function(items){

        if (items == undefined) {
            return items;
        }

        var result = [];
        items.forEach( function(item){
            if (item.active == false) {
                result.push(item);
            }
        });

        return result;
        // return items;
    }
});