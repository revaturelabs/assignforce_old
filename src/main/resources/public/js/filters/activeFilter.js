
    var assignforce = angular.module( "batchApp" );

    assignforce.filter( "activeItem", function(){
        return function(items){

            if (items == undefined) {
                return items;
            }

            var result = [];
            items.forEach( function(item){
                if (item.active == true) {
                    result.push(item);
                }
            });

            return result;
            // return items;
        }
    });