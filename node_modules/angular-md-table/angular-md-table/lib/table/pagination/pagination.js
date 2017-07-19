class PaginationController {
    /*@ngInject*/
    constructor(ttMdTable) {
        this.ttMdTable = ttMdTable;
    }

    /**
     * Print the pagination in array
     * @param curr
     * @returns {*[]}
     */
    printPagination(curr = 1) {

        let max = this.model.getPages(this.totalNumber);
        if (max <= 6)
            return _.range(1, max+1);
        if (curr - 3 <= 0)
            return [..._.range(1, 5), '...', max];
        else if (curr + 3 > max)
            return [1, '...', ..._.range(max - 3, max + 1)];
        else if (curr - 3 > 0 && curr + 3 <= max)
            return [1, '...', curr - 1, curr, curr + 1, '...', max];
    }

    /**
     * Move to next page
     */
    next() {
        if (this.model.getOffset() + 1 <= this.model.getPages(this.totalNumber)) {
            this.goToPage(this.model.getOffset() + 1);
        }else{
            //Handle the error call back
            console.log("Cannot go next");
        }
    }

    /**
     * Move to previous page
     */
    previous() {
        if (this.model.getOffset() - 1 > 0) {
            this.goToPage(this.model.getOffset() - 1);
        }else{
            //Handle the error call back
            console.log("Cannot go previous");
        }
    }

    /**
     * Go the the page number
     * @param pageNumber
     */
    goToPage(pageNumber) {
        this.model.setOffset(pageNumber);
        this.cb({model: this.model});
    }

    /**
     * Serve Mobile View Only
     */
    more() {
        this.next();
    }
}

const ttmdPaginationComponent = {
    bindings: {
        list: '@',
        model: '=',
        limits: '<',
        cb: '&',
        totalNumber: '='
    },
    controller: PaginationController,
    controllerAs: 'vm',
    require: {
        'listCtrl': '^ttmdTable'
    },
    template: require('./pagination.html')
};

export default (ngModule) => {
    ngModule.component('ttmdPagination', ttmdPaginationComponent);
}
