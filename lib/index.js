var isBrowser = (typeof window !== 'undefined');
var Masonry = isBrowser ? window.Masonry || require('masonry') : null;
var imagesloaded = isBrowser ? require('imagesloaded') : null;

function MasonryMixin() {
    return function(reference, options) {
        return {
            masonry: false,

            imagesLoaded: function() {
                if (!isBrowser) return;

                imagesloaded(this.refs[reference].getDOMNode(), function(instance) {
                    this.masonry.layout();
                }.bind(this));
            },

            componentDidMount: function(domNode) {
                if (this.masonry || !isBrowser) return;

                this.masonry = new Masonry(this.refs[reference].getDOMNode(), options);
                this.refs[reference].getDOMNode().focus();
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

module.exports = MasonryMixin();
