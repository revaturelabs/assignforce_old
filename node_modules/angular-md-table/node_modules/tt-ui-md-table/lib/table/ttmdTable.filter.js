export default (ngModule) => {

    ngModule.filter('exclude', function () {
        /*@ngInject*/
        return function (inputs, filterValues) {

            let wordsToFilter = filterValues || [''];
            let keys = Object.keys(inputs);

            return keys.reduce((acc, curr) => {
                if (wordsToFilter.indexOf(curr) > -1) {
                    return acc;
                } else {
                    acc[curr] = inputs[curr];
                    return acc;
                }
            }, {});
        };
    });

    ngModule.filter('pipes', function ($filter) {
        /*@ngInject*/
        return function (inputs, filterValues) {
            return Object.keys(filterValues).reduce((acc, curr) => {

                let filterKey, targetKeys, inputValue, symbolValue, filteredValue;
                filterKey = curr;  //currency filter
                targetKeys = filterValues[filterKey].targets; // amount on the inputs

                if(!targetKeys){
                    return acc;
                }

                targetKeys.forEach( (targetKey)=>{
                    inputValue = acc[targetKey]; //  amount value
                    symbolValue = filterValues[filterKey].format;
                    if (symbolValue && symbolValue !== "") {
                        filteredValue = $filter(filterKey)(inputValue, symbolValue);
                    } else {
                        filteredValue = $filter(filterKey)(inputValue);
                    }

                    if(filteredValue){
                        acc[targetKey] = filteredValue;
                    }
                });

                return acc;
            }, inputs);
        };
    });
}
