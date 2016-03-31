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
var m = "{{position}} argument for `{{macro}}` should be raw-value and not a dependent key";

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
  var macrosMap = options.hasOwnProperty("check") ? options.check : {};
  var macroNames = a.combine(namespaces, Object.keys(macrosMap));

  /**
   * Checks if node is Literal with string value
   *
   * @param {ASTNode} node
   * @returns {*|boolean}
   */
  function nodeIsString(node) {
    return node && node.type === "Literal" && typeof node.value === "string";
  }

  /**
   *
   * @param {ASTNode} node
   * @param {string} macroName
   */
  function checkMacroName(node, macroName) {
    if (macrosMap.hasOwnProperty(macroName)) {
      var dependentKeys = node.arguments;
      var objectProperties = n.getPropertyNamesInParentObjectExpression(node);
      var positionsToCheck = macrosMap[macroName];
      for (var i = 0; i < dependentKeys.length; i++) {
        if (positionsToCheck.indexOf(i) !== -1) {
          var dependentKey = dependentKeys[i];
          if (!nodeIsString(dependentKey)) {
            continue;
          }
          var possiblePropertyName = dependentKey.value.split(".").shift(); // take "a" from strings like "a.b.c"
          if (objectProperties.indexOf(possiblePropertyName) !== -1) {
            context.report(node, m, {macro: macroName, position: num(i + 1)});
          }
        }
      }
    }
  }

  return {

    "CallExpression": function (node) {
      var fullMacroName = o.get(node, "callee.name") || n.getCaller(node);
      if ((ember.isComputedMacro(node) || macroNames.indexOf(fullMacroName) !== -1) && n.isPropertyValueDeclaration(node)) {
        var shortMacroName = n.getFunctionName(node);

        if (shortMacroName === fullMacroName) {
          checkMacroName(node, shortMacroName);
        }
        else {
          checkMacroName(node, shortMacroName);
          checkMacroName(node, fullMacroName);
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