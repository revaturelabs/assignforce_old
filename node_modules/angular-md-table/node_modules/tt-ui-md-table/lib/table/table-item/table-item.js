class TtmdTableItemController {
    /*@ngInject*/
    constructor(ttMdTable) {
        this.ttMdTable = ttMdTable;
    }

    getSelectedItem() {
        return this.item;
    }
}

const ttmdTableItemComponent = {
    bindings: {
        item: '=',
        headers: '<',
        hasTransclude: '<'
    },
    transclude: true,
    replace: true,
    require: {
        'listCtrl': '^ttmdTable'
    },
    controller: TtmdTableItemController,
    controllerAs: 'vm',
    template: require('./table-item.html')
};

export default (ngModule) => {
    ngModule.component('ttmdTableItem', ttmdTableItemComponent);
}
