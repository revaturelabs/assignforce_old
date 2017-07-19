/**
 * @param $mdMedia
 * @param ttMdTable
 * @param TableConstant
 * @returns {PaginationModel}
 * @constructor
 */
let PaginationModel = function ($mdMedia, ttMdTable, TableConstant) {
    /*@ngInject*/
    function PaginationModel({listType, offset, limits, total, breakpoint, forceMobile}) {
        this.listType = listType || "";
        this.offset = offset || 1;
        this.limits = limits || null;
        this.total = total || null;
        this.forceMobile = forceMobile || null;
        this.breakpoint = breakpoint || null;
        this.limit = this.getLimit();
        this.pages = this.getPages(total);

        this.forceDesktop = false;
    }

    /**
     * Calculate the total number of page, according to the total number of items
     * @param total
     * @returns {number}
     */
    PaginationModel.prototype.getPages = function (total) {
        if (total) {
            return total % this.getLimit() > 0 ? Math.floor(total / this.getLimit()) + 1 : Math.floor(total / this.getLimit());
        }
    };

    /**
     * Set offset
     * @param offset
     */
    PaginationModel.prototype.setOffset = function (offset) {
        this.offset = offset;
    };

    /**
     * Get offset
     * @returns {*|number}
     */
    PaginationModel.prototype.getOffset = function () {
        return this.offset;
    };

    /**
     * Get Limit for device type
     * @returns {*}
     */
    PaginationModel.prototype.getLimit = function () {

        let type;

        if (this.forceMobile) {
            type = TableConstant.limits.mobile;
        } else {
            type = this.goMobile()
                ? TableConstant.limits.mobile
                : TableConstant.limits.desktop;
        }

        if(this.limits) {
            return (this.limits[type] || ttMdTable.getLimits(type)) ;
        } else {
            return ttMdTable.getLimits(type);
        }
    };

    /**
     * Check whether should go to the mobile view
     * @returns {boolean}
     */
    PaginationModel.prototype.goMobile = function () {

        if (this.forceMobile) {
            return true;
        }

        if(this.forceDesktop){
            return false;
        }

        if (this.breakpoint) {
            return !$mdMedia('gt-' + this.breakpoint);
        }

        if (ttMdTable.isForceMobile()) {
            return true;
        } else {
            let goMobile = ttMdTable.getMobile();
            return !$mdMedia(goMobile);
        }
    };

    return PaginationModel;
};

export default (ngModule) => {
    ngModule.factory('PaginationModel', PaginationModel);
}
