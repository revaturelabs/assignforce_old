class DetailViewController {
    constructor() {
    }

    /**
     * Close the detail view
     */
    closeDetailView() {
        this.ListCtrl.toggleDetail(false);
    }
}

const DetailViewComponent = {
    bindings: {},
    controller: DetailViewController,
    transclude: true,
    controllerAs: 'vm',
    require: {
        'ListCtrl': '^ttmdTable'
    },
    template: require('./detail-view.html')
};

export default (ngModule) => {
    ngModule.component('ttmdDetailView', DetailViewComponent);
}
