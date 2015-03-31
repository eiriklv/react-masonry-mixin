var isBrowser = (typeof window !== 'undefined');
var Masonry = isBrowser ? window.Masonry || require('masonry') : null;
var imagesloaded = isBrowser ? require('imagesloaded') : null;

function MasonryMixin() {
    return function(reference, options) {
        return {
            masonry: false,

            domChildren: [],

            initializeMasonry: function(force) {
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

            diffDomChildren: function() {
                var oldChildren = this.domChildren;
                var newChildren = this.getNewDomChildren();

                var removed = oldChildren.filter(function(oldChild) {
                    return !~newChildren.indexOf(oldChild);
                });

                var added = newChildren.filter(function(newChild) {
                    return !~oldChildren.indexOf(newChild);
                });

                var moved = [];

                if (removed.length === 0) {
                    moved = oldChildren.filter(function(child, index) {
                        return index !== newChildren.indexOf(child);
                    });
                }

                this.domChildren = newChildren;

                return {
                    old: oldChildren,
                    'new': newChildren, // fix for ie8
                    removed: removed,
                    added: added,
                    moved: moved
                };
            },

            performLayout: function() {
                var diff = this.diffDomChildren();

                if (diff.removed.length > 0) {
                    this.masonry.remove(diff.removed);
                    this.masonry.reloadItems();
                }

                if (diff.added.length > 0) {
                    this.masonry.appended(diff.added);
                }

                if (diff.moved.length > 0) {
                    this.masonry.reloadItems();
                }

                this.masonry.layout();
            },

            imagesLoaded: function() {
                imagesloaded(this.refs[reference].getDOMNode(), function(instance) {
                    this.masonry.layout();
                }.bind(this));
            },

            componentDidMount: function() {
                if (!isBrowser) return;

                this.initializeMasonry();
                this.performLayout();
                this.imagesLoaded();
            },

            componentDidUpdate: function() {
                if (!isBrowser) return;

                this.performLayout();
                this.imagesLoaded();
            },

            componentWillReceiveProps: function() {
                this._timer = setTimeout(function() {
                    this.masonry.reloadItems();
                    this.forceUpdate();
                }.bind(this), 0);
            },

            componentWillUnmount: function() {
                clearTimeout(this._timer);
            }
        };
    };
}

module.exports = MasonryMixin();
