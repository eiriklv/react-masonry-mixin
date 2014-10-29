/** @jsx React.DOM */

var isBrowser = (typeof window !== 'undefined');
var imagesloaded = isBrowser ? require('imagesloaded') : null;

function MasonryMixin(React) {
    return function(options) {
        return {
            masonry: false,

            imagesLoaded: function() {
                if (!isBrowser) return;

                imagesloaded(this.refs.masonryContainer.getDOMNode(), function(instance) {
                    this.masonry.layout();
                }.bind(this));
            },

            componentDidMount: function(domNode) {
                if (this.masonry || !isBrowser) return;

                this.masonry = new Masonry(this.refs.masonryContainer.getDOMNode(), options);
                this.refs.masonryContainer.getDOMNode().focus();
                this.imagesLoaded();
            },

            componentDidUpdate: function() {
                if (!isBrowser) return;

                this.masonry.reloadItems();
                this.masonry.layout();
                this.imagesLoaded();

                setTimeout(function() {
                    window.dispatchEvent(new Event('resize'));
                }, 1);
            }
        };
    };
}

module.exports = MasonryMixin;
