/**
 * @fileoverview Checks dependent keys for possibility to do brace expansion
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";
var ember = require("../utils/ember.js");
var a = require("../utils/array.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  function hasCommonSequence(str1, str2) {
    var parts1 = str1.split(".");
    var parts2 = str2.split(".");
    var shortParts = parts1.length > parts2.length ? parts2 : parts1;
    var commonPart = [];
    for (var i = 0; i < shortParts.length; i++) {
      var _p1 = parts1[i];
      var _p2 = parts2[i];
      if (_p1 === _p2) {
        commonPart.push(_p1[i]);
      }
      else {
        break;
      }
    }
    if (commonPart.length) {
      commonPart = commonPart.join(".");
      if (shortParts.join(".") === commonPart) {
        return false;
      }
      return !!commonPart;
    }
    return false;
  }

  return {

    "CallExpression": function (node) {
      if (ember.isEmberField(node)) {
        var dependentKeys = ember.getDependentKeys(node);
        var keyCombinations = a.getCombinations(dependentKeys, 2);
        keyCombinations = keyCombinations.filter(function (combo) {
          return combo[0] !== combo[1];
        });
        for (var i = 0; i < keyCombinations.length; i++) {
          var combo = keyCombinations[i];
          var invertedItem0 = combo[0].split(".").reverse().join(".");
          var invertedItem1 = combo[1].split(".").reverse().join(".");
          if (hasCommonSequence(combo[0], combo[1]) || hasCommonSequence(invertedItem0, invertedItem1)) {
            return context.report(node, "Some dependent keys may be grouped with Brace Expansion.");
          }
        }
      }
    }
  }

};

module.exports.schema = [];