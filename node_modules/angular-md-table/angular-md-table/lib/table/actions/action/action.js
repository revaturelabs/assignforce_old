class ActionController {
    /*@ngInject*/
    constructor($parse) {
        this.$parse = $parse;
    }

    /**
     * Callback, return the payload
     * @param ev
     */
    action(ev) {
        ev.stopPropagation();
        let payload = this.ItemCtrl.getSelectedItem();
        this.onClick({payload: payload});
    }

    /**
     * Check whether the action item should be displayed
     * @returns {*}
     */
    shouldDisplay() {

        if (!this.if) {
            return true;
        }

        let getter = this.$parse(this.if);
        let context = this.ItemCtrl.getSelectedItem();
        return getter(context);
    }
}

const ttmdActionComponent = {
    bindings: {
        onClick: '&',               // The on-click handler
        if: '@',                    // Based on the expression to control the item show or hide
    },
    require: {
        'ItemCtrl': '?^^ttmdTableItem'
    },
    controller: ActionController,
    controllerAs: 'vm',
    transclude: true,
    template: require('./action.html')
};

export default (ngModule) => {
    ngModule.component('ttmdAction', ttmdActionComponent);
}
