/**
 * @fileoverview Propose to use `Ember.typeOf` instead of  built-in `typeof` for some types check
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

var o = require("object-path");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  var options = context.options[0];
  var disallowed = options.disallowed;

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {

    "UnaryExpression": function(node) {
      if (node.operator === "typeof") {
        var expression = node.parent;
        var needed = o.get(expression, "left.operator") === "typeof" ? o.get(expression, "right") : o.get(expression, "left");
        if (o.get(needed, "type") === "Literal") {
          var type = o.get(needed, "value");
          if (disallowed.indexOf(type) !== -1) {
            context.report(node, "`Ember.typeOf` can give more accurate result.");
          }
        }
      }
    }

  };

};

module.exports.schema = [
  {
    type: "object",
    properties: {
      disallowed: {
        type: "array",
        "items": {
          "type": "string"
        },
        "minItems": 1,
        "uniqueItems": true
      }
    },
    additionalProperties: false
  }
];