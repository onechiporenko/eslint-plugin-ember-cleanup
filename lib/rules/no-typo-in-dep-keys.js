/**
 * @fileoverview Rule to check possible typos in the dependent keys
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

var o = require("object-path");
var s = require("../utils/string.js");
var ember = require("../utils/ember.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var keysTree = {};
  var nodesField = "___nodes";

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

  /**
   * K-combinations
   * Get k-sized combinations of elements in a set
   * From https://gist.github.com/axelpale/3118596
   *
   * Example
   * <pre>
   *   var combos = getCombinations([1, 2, 3], 2);
   *   console.log(combos); // [[1,2], [1,3], [2, 3]]
   * </pre>
   *
   * @param {string[]} list Array of objects of any type. They are treated as unique
   * @param {number} k size of combinations to search for
   * @returns {string[][]} Array of found combinations, size of a combination is k
   */
  function getCombinations(list, k) {
    var i, j, combos, head, tailCombos;

    if (k > list.length || k <= 0) {
      return [];
    }

    if (k === list.length) {
      return [list];
    }

    if (k === 1) {
      combos = [];
      for (i = 0; i < list.length; i++) {
        combos.push([list[i]]);
      }
      return combos;
    }

    combos = [];
    for (i = 0; i < list.length - k + 1; i++) {
      head = list.slice(i, i + 1);
      tailCombos = getCombinations(list.slice(i + 1), k - 1);
      for (j = 0; j < tailCombos.length; j++) {
        combos.push(head.concat(tailCombos[j]));
      }
    }
    return combos;
  }

  function updateKeysTree (keys, node) {
    keys.forEach(function (key) {
      if (!o.has(keysTree, key)) {
        o.set(keysTree, key, _getNodesField());
      }
      o.insert(keysTree, key + "." + nodesField, node);
      var subPath = "";
      key.split(".").forEach(function (subKey) {
        subPath = subPath === "" ? subKey : subPath + "." + subKey;
        var nodesSubPath = subPath + "." + nodesField;
        if (!o.has(keysTree, nodesSubPath)) {
          o.set(keysTree, nodesSubPath, _getNodesField());
        }
        o.insert(keysTree, nodesSubPath, node);
      });
    });
  }

  function checkKeysTree(_keysTree) {
    var combos = getCombinations(Object.keys(_keysTree).filter(function (subKey) {return subKey.length > 5 && subKey !== nodesField;}), 2);
    combos.forEach(function (combo) {
      if (combo[0] === combo[1]) {
        return;
      }
      var distance = s.getDamerauLevenshteinDistance.apply(null, combo);
      if (distance === 1) {
        var k1Nodes = _keysTree[combo[0]][nodesField];
        var k2Nodes = _keysTree[combo[1]][nodesField];
        var _n = k1Nodes.length > k2Nodes.length;
        var reportedNodes = _n ? k2Nodes : k1Nodes;
        var reportedKey = _n ? combo[1] : combo[0];
        var validKey = _n ? combo[0] : combo[1];
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
        var keys = ember.getDependentKeys(node);
        keys = ember.expandDependentKeys(keys.filter(onlyUnique));
        updateKeysTree(keys, node);
      }
    },

    "Program:exit": function () {
      return checkKeysTree(keysTree);
    }

  }

};

module.exports.schema = [];