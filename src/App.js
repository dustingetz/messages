import React from 'react';
import _ from 'lodash';

var App = React.createClass({
  render: function () {
    return (
        <div>
         Hello {_.map([1, 2 ,3], (i) => {return "world";})}
        </div>
    );
  }
});

module.exports = App;
