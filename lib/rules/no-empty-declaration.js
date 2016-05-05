/**
 * @fileoverview Disallow empty `extend` for Ember Objects
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

var n = require("../utils/node.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var message = "Empty `extend` is redundant.";

module.exports = function(context) {

  var options = context.options[0] || {};
  var allowedFor = options.allowedFor || [];
  var allowedForL = allowedFor.length;

  return {

    "CallExpression": function (node) {
      var caller = n.getCaller(node);
      if (n.getFunctionName(node) !== "extend") {
        return;
      }
      for (var i = 0; i < allowedForL; i++) {
        if (caller.indexOf(allowedFor[i]) !== -1) {
          return;
        }
      }
      var args = node.arguments;
      if (args.length) {
        if (args[0].type !== "ObjectExpression") {
          return;
        }
        if(!args[0].properties.length) {
          context.report(node, message);
        }
      }
      else {
        context.report(node, message);
      }
    }

  };

};

module.exports.schema = [
  {
    type: "object",
    properties: {
      allowedFor: {
        type: "array",
        items: {
          type: "string"
        },
        minItems: 1,
        uniqueItems: true
      }
    },
    additionalProperties: false
  }
];