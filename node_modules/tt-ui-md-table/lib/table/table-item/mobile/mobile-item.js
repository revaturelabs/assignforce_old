class MobileItemController{
    constructor(){

    }

    /**
     * Call the parent List component to get the exclude items
     * @returns {RegExp|Array|string|*}
     */
    getExcludedKeys(){
        return this.ListCtrl.exclude;
    }

    getPipes(){
        return this.ListCtrl.getPipes();
    }
}

const ttmMobileItemComponent = {
    bindings: {
        item: '=',
        headers: '<'
    },
    transclude: true,
    require: {
        'ItemCtrl': '^ttmdTableItem',
        'ListCtrl': '^^ttmdTable'
    },
    replace: true,
    controller: MobileItemController,
    controllerAs: 'vm',
    template: require('./mobile-item.html')
};

export default (ngModule) => {
    "use strict";
    ngModule.component('ttmdMobileItem', ttmMobileItemComponent);
}
