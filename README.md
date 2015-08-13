React Masonry Mixin
===================

[![npm version](https://badge.fury.io/js/react-masonry-mixin.svg)](http://badge.fury.io/js/react-masonry-mixin)

#### Introduction:
A React.js Masonry mixin. (Also available as a [component](https://github.com/eiriklv/react-masonry-component) - you should use that instead!)

#### Live demo:
[hearsay.me (web)](http://www.hearsay.me)
[hearsay.me (github)](https://github.com/eiriklv/hearsay-frontend)

#### Usage:

* The mixin is now bundled with Masonry, so no additional dependencies needed!
* ~~You will have to use Masonry as a script dependency, as there is no complete npm module available at the moment.~~
* You can optionally include Masonry as a script tag
`<script src='//cdnjs.cloudflare.com/ajax/libs/masonry/3.1.5/masonry.pkgd.min.js' />`

* To use the mixin
 * require the mixin and inject `React`
 * pass a reference and a masonry options object
 * make sure you use the same reference as `ref` in your component
 * if you need to - access the masonry object through `this.masonry` in your component

* example code

```js 
var React = require('react');
var MasonryMixin = require('react-masonry-mixin')(React);
 
var masonryOptions = {
    transitionDuration: 0
};
 
var SomeComponent = React.createClass({

    mixins: [MasonryMixin('masonryContainer', masonryOptions)],
 
    render: function () {
        var childElements = this.props.elements.map(function(element){
           return (
                <div className="someclass">
                    {element.name}
                </div>
            );
        });
        
        return (
            <div ref="masonryContainer">
                {childElements}
            </div>
        );
    }
});

module.exports = SomeComponent;
```
