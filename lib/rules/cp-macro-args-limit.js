/**
 * @fileoverview Checks number of the dependent keys for computed macros
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";
var o = require("object-path");
var n = require("../utils/node.js");
var a = require("../utils/array.js");
var ember = require("../utils/ember.js");
var mAtLeast = "`{{name}}` is called with {{num}} dependent key(s). Must be at least {{min}} dependent key(s)";
var mAtMost = "`{{name}}` is called with {{num}} dependent key(s). Must be at most {{max}} dependent key(s)";
var mEq = "`{{name}}` is called with {{num}} dependent key(s). Must be only {{eq}} dependent key(s)";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var options = context.options[0] || {
      check: {
        and: {min: 2},
        or: {min: 2}
      }
    };
  var namespaces = Array.isArray(options.namespaces) ? options.namespaces : [];
  var macrosMap = options.hasOwnProperty("check") ? options.check : {};
  var macroNames = a.combine(namespaces, Object.keys(macrosMap));

  return {

    "CallExpression": function (node) {
      var fullMacroName = o.get(node, "callee.name") || n.getCaller(node);
      if ((ember.isComputedMacro(node) || macroNames.indexOf(fullMacroName) !== -1) && n.isPropertyValueDeclaration(node)) {
        var dependentKeys = node.arguments;
        var shortMacroName = n.getFunctionName(node);
        if (macrosMap.hasOwnProperty(shortMacroName)) {
          var opts = macrosMap[shortMacroName];
          var reportArgs = {name: shortMacroName, num: dependentKeys.length};

          if (opts.hasOwnProperty("eq") && dependentKeys.length !== opts.eq) {
            reportArgs.eq = opts.eq;
            return context.report(node, mEq, reportArgs);
          }

          if (opts.hasOwnProperty("min") && dependentKeys.length < opts.min) {
            reportArgs.min = opts.min;
            return context.report(node, mAtLeast, reportArgs);
          }

          if (opts.hasOwnProperty("max") && dependentKeys.length > opts.max) {
            reportArgs.max = opts.max;
            return context.report(node, mAtMost, reportArgs);
          }

        }
      }
    }
  }

};

module.exports.schema = [
  {
    "type": "object",
    "properties": {
      "check": {
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
      },
      "namespaces": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "minItems": 1,
        "uniqueItems": true
      }
    }
  }
];