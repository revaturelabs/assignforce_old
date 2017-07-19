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

    /**
     * Show the 'button' or 'text'
     * @returns {*}
     */
    showButtonOrText() {

        const ary = ['button', 'text'];

        if (this.showAs) {
            if (ary.indexOf(this.showAs) > -1) {
                return this.showAs;
            } else {
                return ary[0];
            }
        } else {
            return ary[0];
        }
    }
}

const ttmdActionComponent = {
    bindings: {
        text: '@',                  // The text to display
        onClick: '&',               // The on-click handler
        if: '@',                    // Based on the expression to control the item show or hide
        showAs: '@'                 // Show as 'button' or 'text'
    },
    require: {
        'ItemCtrl': '?^^ttmdTableItem'
    },
    controller: ActionController,
    controllerAs: 'vm',
    replace: true,
    template: require('./action.html')
};

export default (ngModule) => {
    ngModule.component('ttmdAction', ttmdActionComponent);
}
