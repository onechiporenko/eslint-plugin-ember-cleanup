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
var mAtLeast = "`computed.{{name}}` is called with {{num}} dependent key(s). Must be at least {{min}} dependent key(s)";
var mAtMost = "`computed.{{name}}` is called with {{num}} dependent key(s). Must be at most {{max}} dependent key(s)";
var mEq = "`computed.{{name}}` is called with {{num}} dependent key(s). Must be only {{eq}} dependent key(s)";

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
  var check = options.hasOwnProperty("check") ? options.check : {};
  var names = Object.keys(options.check || {});
  names = a.combine(namespaces, names);

  return {

    "CallExpression": function (node) {
      var fName = o.get(node, "callee.name") || n.getCaller(node);
      if ((ember.isComputedMacro(node) || names.indexOf(fName) !== -1) && n.isPropertyValueDeclaration(node)) {
        var keys = node.arguments;
        var name = n.getFunctionName(node);
        if (check.hasOwnProperty(name)) {
          var opts = check[name];
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