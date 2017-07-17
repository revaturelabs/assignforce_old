class PaginationDesktopController {
    constructor() {

    }

    /**
     * Print the pagination to the interface
     * @param curr
     */
    printPagination(curr = 1) {
        this.pages =  this.paginationCtrl.printPagination(curr);
    }

    /**
     * GO to the page number
     * @param pageNumber
     */
    goToPage(pageNumber) {
        if(_.isNumber(pageNumber)){
            this.paginationCtrl.goToPage(pageNumber);
            this.printPagination(pageNumber);
        }
    }

    /**
     * Go next page
     */
    next() {
        this.paginationCtrl.next();
    }

    /**
     * Go previous page
     */
    previous() {
        this.paginationCtrl.previous();
    }
}

const PaginationDesktopComponent = {
    bindings: {
        offset: '='
    },
    controller: PaginationDesktopController,
    controllerAs: 'vm',
    require: {
        paginationCtrl: '^ttmdPagination'
    },
    template: require('./pagination-desktop.html')
};

export default (ngModule) => {
    ngModule.component('ttmdPaginationDesktop', PaginationDesktopComponent);
}
