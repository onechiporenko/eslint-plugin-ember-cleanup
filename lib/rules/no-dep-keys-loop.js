/**
 * @fileoverview Check for loops in the dependent keys of the computed properties
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";
var ember = require("../utils/ember.js");
var o = require("object-path");
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  var nodes = [];
  var mappedNodes = {};
  var toReport = [];

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  function mapByName(list) {
    var ret = {};
    list.forEach(function (item) {
      ret[item.name] = item;
    });
    return ret;
  }

  function waterFall(needed, current, path) {
    if (!current || !Array.isArray(current.keys)) {
      return;
    }
    if (current.keys.indexOf(needed.name) !== -1) {
      return toReport.push(path.concat([needed]));
    }
    current.keys.forEach(function (key) {
      var _node = mappedNodes[key];
      var _path = path.concat([_node]);
      if (path.indexOf(_node) === -1) {
        waterFall(needed, _node, _path)
      }
    });
  }

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {
    "Program": function () {
      nodes = [];
    },
    "CallExpression": function (node) {
      if (ember.isComputedProperty(node)) {
        var dependentKeys = ember.getDependentKeys(node);
        var name = o.get(node, "parent.key.name");
        if (name) {
          nodes.push({node: node, name: name, keys: dependentKeys.filter(onlyUnique)});
        }
      }
    },
    "Program:exit": function () {
      mappedNodes = mapByName(nodes);
      toReport = [];
      nodes.forEach(function (node) {
        waterFall(node, node, [node]);
      });
      toReport.map(function (chain) {
        chain.chainStr = chain.map(function(n){return n.name}).filter(onlyUnique).sort().join(" → ");
        return chain;
      })
      .filter(function (chain, index, self) {
        var _chain = self.filter(function (_c) {
          return _c.chainStr === chain.chainStr;
        });
        return _chain[0] === chain;
      }).forEach(function (chain) {
        var chainStr = chain.map(function(n){return n.name}).join(" → ");
        context.report(chain[0].node, "Dependent keys are in loop: " + chainStr);
      });
    }
  };

};

module.exports.schema = [];