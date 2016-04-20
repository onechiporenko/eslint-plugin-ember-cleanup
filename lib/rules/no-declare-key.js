/**
 * @fileoverview Checks for array detection and propose to use `Ember.isArray`
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

var o = require("object-path");
var n = require("../utils/node.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var options = context.options[0] || {};
  var callersToCheck = options.callersToCheck;
  var callerNames = Object.keys(callersToCheck);
  var m = "`{{property}}` should not be declared in the 1st argument for `{{callee}}`-call.";


  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {
    "Property": function (node) {
      if (o.get(node, "parent.type") === "ObjectExpression" && o.get(node, "parent.parent.type") === "CallExpression") {
        if (o.get(node, "parent") !== o.get(node, "parent.parent.arguments.0")) {
          return;
        }
        var propertyName = o.get(node, "key.name");
        var caller = n.getCaller(o.get(node, "parent.parent"));
        if (callerNames.indexOf(caller) !== -1) {
          if (callersToCheck[caller].indexOf(propertyName) !== -1) {
            context.report(node, m, {property: propertyName, callee: caller});
          }
        }
      }
    }

  }

};

module.exports.schema = [
  {
    type: "object",
    properties: {
      callersToCheck: {
        "type": "object",
        "minProperties": 1,
        "patternProperties": {
          ".*": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "minItems": 1,
            "uniqueItems": true
          }
        }
      }
    },
    additionalProperties: false
  }
];