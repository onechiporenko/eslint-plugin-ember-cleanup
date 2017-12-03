"use strict";

const o = require("object-path");
const s = require("../utils/string.js");
const a = require("../utils/array.js");
const ember = require("../utils/ember.js");

module.exports = {
  meta: {
    docs: {
      description: "Rule uses Damerau–Levenshtein distance to check if some keys look similar but not same.",
      category: "Dependent Keys",
      recommended: true
    },
    schema: [
      {
        "type": "object",
        "properties": {
          "ignoreExclamationMark": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      }
    ],
    fixable: null
  },
  create: function (context) {
    const dependentKeysTree = {};
    const nodesField = "___nodes";

    const options = context.options[0] || {};
    const ignoreExclamationMark = options.hasOwnProperty("ignoreExclamationMark") ? options.ignoreExclamationMark : false;

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    function isObj(val) {
      return {}.toString.call(val) === "[object Object]";
    }

    function _getNodesField() {
      const f = {};
      f[nodesField] = {};
      return f;
    }

    function updateKeysTree (keys, node) {
      keys.forEach(function (dependentKey) {
        const _dependentKey = ignoreExclamationMark ? dependentKey.replace("!", "") : dependentKey;
        if (!o.has(dependentKeysTree, _dependentKey)) {
          o.set(dependentKeysTree, _dependentKey, _getNodesField());
        }
        o.insert(dependentKeysTree, _dependentKey + "." + nodesField, node);
        let subPath = "";
        if (_dependentKey.indexOf(".") !== -1) {
          _dependentKey.split(".").forEach(function (subKey) {
            subPath = subPath === "" ? subKey : subPath + "." + subKey;
            const nodesSubPath = subPath + "." + nodesField;
            if (!o.has(dependentKeysTree, nodesSubPath)) {
              o.set(dependentKeysTree, nodesSubPath, _getNodesField());
            }
            o.insert(dependentKeysTree, nodesSubPath, node);
          });
        }
      });
    }

    function checkKeysTree(_keysTree) {
      const keys = Object.keys(_keysTree).filter(function (subKey) {
        return subKey.length > 5 && subKey !== nodesField;
      });
      let keyCombinations = a.getCombinations(keys, 2);
      keyCombinations = keyCombinations.filter(function (combo) {
        if (combo[0] === combo[1]) {
          return false;
        }
        return Math.abs(combo[0].length - combo[1].length) <= 1;
      });
      keyCombinations.forEach(function (combo) {
        const distance = s.getDamerauLevenshteinDistance.apply(null, combo);
        if (distance === 1) {
          const nodesForFirstKey = _keysTree[combo[0]][nodesField];
          const nodesForSecondKey = _keysTree[combo[1]][nodesField];
          const key1HasMoreKeys = nodesForFirstKey.length > nodesForSecondKey.length;
          const reportedNodes = key1HasMoreKeys ? nodesForSecondKey : nodesForFirstKey;
          const reportedKey = key1HasMoreKeys ? combo[1] : combo[0];
          const validKey = key1HasMoreKeys ? combo[0] : combo[1];
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

    return {
      "CallExpression": function (node) {
        if (ember.isEmberField(node)) {
          let dependentKeys = ember.getDependentKeys(node);
          dependentKeys = ember.expandDependentKeys(dependentKeys.filter(onlyUnique));
          updateKeysTree(dependentKeys, node);
        }
      },

      "Program:exit": function () {
        return checkKeysTree(dependentKeysTree);
      }
    }
  }
};