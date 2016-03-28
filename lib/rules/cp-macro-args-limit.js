/**
 * @fileoverview Checks number of the dependent keys for computed macros
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";
var ember = require("../utils/ember.js");
var mAtLeast = "`computed.{{name}}` is called with {{num}} dependent key(s). Must be at least {{min}} dependent key(s)";
var mAtMost = "`computed.{{name}}` is called with {{num}} dependent key(s). Must be at most {{max}} dependent key(s)";
var mEq = "`computed.{{name}}` is called with {{num}} dependent key(s). Must be only {{eq}} dependent key(s)";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var options = context.options[0] || {
    and: {min: 2},
    or: {min: 2}
  };
  return {

    "CallExpression": function (node) {
      if (ember.isComputedMacro(node)) {
        var keys = node.arguments;
        var name = ember.getComputedMacroName(node);
        if (options.hasOwnProperty(name)) {
          var opts = options[name];
          if (opts.hasOwnProperty("eq") && keys.length !== opts.eq) {
            return context.report(node, mEq, {name: name, num: keys.length, eq: opts.eq});
          }
          if (opts.hasOwnProperty("min") && keys.length < opts.min) {
            return context.report(node, mAtLeast, {name: name, num: keys.length, min: opts.min});
          }
          if (opts.hasOwnProperty("max") && keys.length > opts.max) {
            return context.report(node, mAtMost, {name: name, num: keys.length, max: opts.max});
          }
        }
      }
    }
  }

};

module.exports.schema = [
  {
    "type": "object",
    "minProperties": 1,
    "patternProperties": {
      ".*": {
        "type": "object",
        "properties": {
          "min": {
            "type": "number"
          },
          "max": {
            "type": "number",
            "minimum": 1
          },
          "eq": {
            "type": "number"
          }
        }
      }
    }
  }
];