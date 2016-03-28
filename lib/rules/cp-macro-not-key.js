/**
 * @fileoverview Checks arguments for computed macros to not be dependent keys
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";
var o = require("object-path");
var n = require("../utils/node.js");
var ember = require("../utils/ember.js");
var m = "{{num}} argument for `computed.{{macro}}` should be raw-value and not a dependent key";

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

  var toCheck = context.options[0] || {};
  var names = Object.keys(toCheck);

  /**
   * Get list of all properties in the Object Expression node
   * Object - is a "grand parent" for the provided node
   * Result doesn't contain name of the `node` property
   *
   * @param {ASTNode} node
   * @returns {string[]}
   */
  function getPropertyNamesInParentObjectExpression(node) {
    var objectExpression = o.get(node, "parent.parent");
    var ret = [];
    if (!objectExpression) {
      return ret;
    }
    objectExpression.properties.forEach(function (p) {
      if (p.value !== node) {
        ret.push(p.key.name);
      }
    });
    return ret;
  }

  /**
   * Checks if node is Literal with string value
   *
   * @param {ASTNode} node
   * @returns {*|boolean}
   */
  function nodeIsString(node) {
    return node && node.type === "Literal" && typeof node.value === "string";
  }

  return {

    "CallExpression": function (node) {
      var fName = o.get(node, "callee.name");
      if ((ember.isComputedMacro(node) || names.indexOf(fName) !== -1) && n.isPropertyValueDeclaration(node)) {
        var propertiesInTheScope = getPropertyNamesInParentObjectExpression(node);
        var keys = node.arguments;
        var name = ember.getComputedMacroName(node) || fName;
        if (toCheck.hasOwnProperty(name)) {
          var positionsToCheck = toCheck[name];
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
    }
  }

};

module.exports.schema = [
  {
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
  }
];