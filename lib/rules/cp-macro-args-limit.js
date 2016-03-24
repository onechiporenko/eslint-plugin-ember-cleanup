/**
 * @fileoverview Checks number of the dependent keys for computed macros
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";
var ember = require("../utils/ember.js");
var m = "`computed.{{name}}` is called with {{num}} dependent key(s). Minimum number should be {{min}}";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var options = context.options[0] || {};
  var toCheck = options.hasOwnProperty("check") ? options.check : ["and", "or"];
  var min = options.hasOwnProperty("min") ? options.min : 2;

  return {

    "CallExpression": function (node) {
      if (ember.isComputedMacro(node)) {
        var keys = node.arguments;
        var name = ember.getComputedMacroName(node);
        if (toCheck.indexOf(name) !== -1) {
          if (keys.length < min) {
            context.report(node, m, {name: name, num: keys.length, min: min});
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
      min: {
        type: "number",
        minimum: 2
      },
      check: {
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