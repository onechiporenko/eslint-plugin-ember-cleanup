"use strict";

const ember = require("../utils/ember.js");
const o = require("object-path");

module.exports = {
  meta: {
    docs: {
      description: "Check for loops in the dependent keys of the computed properties",
      category: "Dependent Keys",
      recommended: true
    },
    fixable: null
  },

  create: function (context) {
    let nodes = [];
    let mappedNodes = {};
    let toReport = [];

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    function mapByName(list) {
      const ret = {};
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
        const _node = mappedNodes[key];
        const _path = path.concat([_node]);
        if (path.indexOf(_node) === -1) {
          waterFall(needed, _node, _path)
        }
      });
    }

    return {
      "Program": function () {
        nodes = [];
      },
      "CallExpression": function (node) {
        if (ember.isComputedProperty(node)) {
          const dependentKeys = ember.getDependentKeys(node);
          const name = o.get(node, "parent.key.name");
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
            const _chain = self.filter(function (_c) {
              return _c.chainStr === chain.chainStr;
            });
            return _chain[0] === chain;
          }).forEach(function (chain) {
          const chainStr = chain.map(function(n){return n.name}).join(" → ");
          context.report(chain[0].node, "Dependent keys are in loop: " + chainStr);
        });
      }
    };
  }
};