/**
 * @fileoverview Checks arguments for computed macros to not be dependent keys
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";
var a = require("../utils/array.js");
var o = require("object-path");
var n = require("../utils/node.js");
var ember = require("../utils/ember.js");
var m = "{{num}} argument for `{{macro}}` should be raw-value and not a dependent key";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function num(n) {
  var map = {
    1: "1st",
    2: "2nd",
    3: "3rd"
  };
  return map[n] || n + "th";
}

module.exports = function (context) {

  var options = context.options[0] || {};
  var namespaces = Array.isArray(options.namespaces) ? options.namespaces : [];
  var check = options.hasOwnProperty("check") ? options.check : {};
  var names = Object.keys(options.check || {});
  names = a.combine(namespaces, names);

  /**
   * Checks if node is Literal with string value
   *
   * @param {ASTNode} node
   * @returns {*|boolean}
   */
  function nodeIsString(node) {
    return node && node.type === "Literal" && typeof node.value === "string";
  }

  function checkName(node, name) {
    if (check.hasOwnProperty(name)) {
      var keys = node.arguments;
      var propertiesInTheScope = n.getPropertyNamesInParentObjectExpression(node);
      var positionsToCheck = check[name];
      for (var i = 0; i < keys.length; i++) {
        if (positionsToCheck.indexOf(i) !== -1) {
          var key = keys[i];
          if (!nodeIsString(key)) {
            continue;
          }
          var _value = key.value.split(".").shift();
          if (propertiesInTheScope.indexOf(_value) !== -1) {
            context.report(node, m, {macro: name, num: num(i + 1)});
          }
        }
      }
    }
  }

  return {

    "CallExpression": function (node) {
      var fullName = o.get(node, "callee.name") || n.getCaller(node);
      if ((ember.isComputedMacro(node) || names.indexOf(fullName) !== -1) && n.isPropertyValueDeclaration(node)) {
        var functionName = n.getFunctionName(node);

        if (functionName === fullName) {
          checkName(node, functionName);
        }
        else {
          checkName(node, functionName);
          checkName(node, fullName);
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
            "type": "array",
            "items": {
              "type": "number",
              "minimum": 0
            },
            "minItems": 1,
            "uniqueItems": true
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