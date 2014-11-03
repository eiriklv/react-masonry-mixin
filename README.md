React Masonry Mixin
===================

#### TODO
* Test suite

#### Introduction:
A mixin for React.js to create masonry

#### Live demo:
[hearsay.me (web)](http://www.hearsay.me)
[hearsay.me (github)](https://github.com/eiriklv/hearsay-frontend)

#### Usage:

* The mixin is now bundled with masonry, so no additional dependencies needed!
* ~~You will have to use Masonry as a script dependency, as there is no complete npm module available at the moment.~~
* You can optionally include Masonry as a script tag
`<script src='//cdnjs.cloudflare.com/ajax/libs/masonry/3.1.5/masonry.pkgd.min.js' />`

* To use the mixin
 * require the mixin
 * pass a reference and a masonry options object
 * make sure you use the same reference as `ref` in your component
 * if you need to - access the masonry object through `this.masonry` in your component

* example use in code

```js
/** @jsx React.DOM */
 
'use strict';
 
var React = require('react');
 
var MasonryMixin = require('react-masonry-mixin');
 
var masonryOptions = {
    transitionDuration: 0
};
 
module.exports = React.createClass({
    displayName: 'SomeComponent',
 
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
```
