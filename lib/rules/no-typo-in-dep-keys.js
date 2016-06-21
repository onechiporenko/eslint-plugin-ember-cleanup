/**
 * @fileoverview Rule to check possible typos in the dependent keys
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

var o = require("object-path");
var s = require("../utils/string.js");
var a = require("../utils/array.js");
var ember = require("../utils/ember.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var dependentKeysTree = {};
  var nodesField = "___nodes";

  var options = context.options[0] || {};
  var ignoreExclamationMark = options.hasOwnProperty("ignoreExclamationMark") ? options.ignoreExclamationMark : false;

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  function isObj(val) {
    return {}.toString.call(val) === "[object Object]";
  }

  function _getNodesField() {
    var f = {};
    f[nodesField] = {};
    return f;
  }

  function updateKeysTree (keys, node) {
    keys.forEach(function (dependentKey) {
      var _dependentKey = ignoreExclamationMark ? dependentKey.replace("!", "") : dependentKey;
      if (!o.has(dependentKeysTree, _dependentKey)) {
        o.set(dependentKeysTree, _dependentKey, _getNodesField());
      }
      o.insert(dependentKeysTree, _dependentKey + "." + nodesField, node);
      var subPath = "";
      if (_dependentKey.indexOf(".") !== -1) {
        _dependentKey.split(".").forEach(function (subKey) {
          subPath = subPath === "" ? subKey : subPath + "." + subKey;
          var nodesSubPath = subPath + "." + nodesField;
          if (!o.has(dependentKeysTree, nodesSubPath)) {
            o.set(dependentKeysTree, nodesSubPath, _getNodesField());
          }
          o.insert(dependentKeysTree, nodesSubPath, node);
        });
      }
    });
  }

  function checkKeysTree(_keysTree) {
    var keys = Object.keys(_keysTree).filter(function (subKey) {
      return subKey.length > 5 && subKey !== nodesField;
    });
    var keyCombinations = a.getCombinations(keys, 2);
    keyCombinations = keyCombinations.filter(function (combo) {
      if (combo[0] === combo[1]) {
        return false;
      }
      return Math.abs(combo[0].length - combo[1].length) <= 1;
    });
    keyCombinations.forEach(function (combo) {
      var distance = s.getDamerauLevenshteinDistance.apply(null, combo);
      if (distance === 1) {
        var nodesForFirstKey = _keysTree[combo[0]][nodesField];
        var nodesForSecondKey = _keysTree[combo[1]][nodesField];
        var key1HasMoreKeys = nodesForFirstKey.length > nodesForSecondKey.length;
        var reportedNodes = key1HasMoreKeys ? nodesForSecondKey : nodesForFirstKey;
        var reportedKey = key1HasMoreKeys ? combo[1] : combo[0];
        var validKey = key1HasMoreKeys ? combo[0] : combo[1];
        reportedNodes.forEach(function (node) {
          context.report(node, "Key `{{k1}}` is looks like `{{k2}}`.", {k1: reportedKey, k2: validKey});
        });
      }
    });
    if (isObj(_keysTree)) {
      Object.keys(_keysTree).forEach(function (key) {
        if (isObj(_keysTree[key])) {
          checkKeysTree(_keysTree[key]);
        }
      });
    }
  }

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {

    "CallExpression": function (node) {
      if (ember.isEmberField(node)) {
        var dependentKeys = ember.getDependentKeys(node);
        dependentKeys = ember.expandDependentKeys(dependentKeys.filter(onlyUnique));
        updateKeysTree(dependentKeys, node);
      }
    },

    "Program:exit": function () {
      return checkKeysTree(dependentKeysTree);
    }

  }

};

module.exports.schema = [
  {
    "type": "object",
    "properties": {
      "ignoreExclamationMark": {
        "type": "boolean"
      }
    },
    "additionalProperties": false
  }
];