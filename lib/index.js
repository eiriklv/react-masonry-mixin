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
                }
            },

            diffDomChildren: function() {
                var oldChildren = this.domChildren;
                var newChildren = Array.prototype.slice.call(this.refs[reference].getDOMNode().children);

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
                    new: newChildren,
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
                this.initializeMasonry(true);
                this.masonry.reloadItems();

                setTimeout(function() {
                    window.dispatchEvent(new Event('resize'));
                }, 1);
            }
        };
    };
}

module.exports = MasonryMixin();
