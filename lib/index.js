var isBrowser = (typeof window !== 'undefined');
var Masonry = isBrowser ? window.Masonry || require('masonry') : null;
var imagesloaded = isBrowser ? require('imagesloaded') : null;

function MasonryMixin () {
    return function (reference, options) {
        return {
            masonry: false,

            domChildren: [],

            initializeMasonry: function (force) {
                if (!this.masonry || force) {
                    this.masonry = new Masonry(this.refs[reference].getDOMNode(), options);
                    this.domChildren = this.getNewDomChildren();

                }
            },
            getNewDomChildren: function () {
                var node = this.refs[reference].getDOMNode();
                var children = options.itemSelector ? node.querySelectorAll(options.itemSelector) : node.children;
                return Array.prototype.slice.call(children);
            },

            diffDomChildren: function () {
                //todo do not scan the whole of the body
                var oldChildren = this.domChildren.filter(function (element) {
                    return document.body.contains(element);
                });

                var newChildren = this.getNewDomChildren();

                var removed = oldChildren.filter(function (oldChild) {
                    return !~newChildren.indexOf(oldChild);
                });

                var domDiff = newChildren.filter(function (newChild) {
                    return !~oldChildren.indexOf(newChild);
                });

                var prepended = [];
                var appended = [];
                var beginningIndex = 0;

                //get everything added to the beginning of the DOMNode list
                prepended = domDiff.filter(function (newChild, i) {
                    var prepend = beginningIndex == newChildren.indexOf(newChild);
                    if (prepend) {
                        //increase the index
                        beginningIndex++;
                    }
                    return prepend;
                })

                // we assume that everything else is appended
                appended = domDiff.filter(function (el) {
                    return prepended.indexOf(el) === -1;
                });

                // otherwise we reverse it because so we're going through the list picking off the items that
                // have been added at the end of the list. this complex logic is preserved in case it needs to be
                // invoked var endingIndex = newChildren.length - 1; domDiff.reverse().filter(function(newChild, i ){
                // var append = endingIndex == newChildren.indexOf(newChild); if (append) { endingIndex--; } return
                // append; })

                //get everything added to the end of the DOMNode list
                var moved = [];

                if (removed.length === 0) {
                    moved = oldChildren.filter(function (child, index) {
                        return index !== newChildren.indexOf(child);
                    });
                }

                this.domChildren = newChildren;

                return {
                    old: oldChildren,
                    new: newChildren,
                    removed: removed,
                    appended: appended,
                    prepended: prepended,
                    moved: moved
                };
            },

            performLayout: function () {
                var diff = this.diffDomChildren();

                if (diff.removed.length > 0) {
                    this.masonry.remove(diff.removed);
                    this.masonry.reloadItems();
                }

                if (diff.appended.length > 0) {
                    this.masonry.appended(diff.appended);
                }

                if (diff.prepended.length > 0) {
                    this.masonry.prepended(diff.prepended);
                }

                if (diff.moved.length > 0) {
                    this.masonry.reloadItems();
                }

                this.masonry.layout();
            },

            imagesLoaded: function () {
                imagesloaded(this.refs[reference].getDOMNode(), function (instance) {
                    this.masonry.layout();
                }.bind(this));
            },

            componentDidMount: function () {
                if (!isBrowser) return;

                this.initializeMasonry();
                //this.performLayout();
                //this.imagesLoaded();
            },

            componentDidUpdate: function () {
                if (!isBrowser) return;

                this.performLayout();
                this.imagesLoaded();
            },

            componentWillReceiveProps: function () {
                this._timer = setTimeout(function () {
                    this.masonry.reloadItems();
                    this.forceUpdate();
                }.bind(this), 0);
            },
            componentWillUnmount: function () {
                clearTimeout(this._timer);
            }

        };
    };
}

module.exports = MasonryMixin();
