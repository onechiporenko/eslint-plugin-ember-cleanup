"use strict";

const ember = require("../utils/ember.js");
const a = require("../utils/array.js");

module.exports = {
  meta: {
    docs: {
      description: "Checks dependent keys for possibility to do brace expansion",
      category: "Dependent Keys",
      recommended: true
    },
    fixable: null
  },
  create: function (context) {
    function hasCommonSequence(str1, str2) {
      const parts1 = str1.split(".");
      const parts2 = str2.split(".");
      const shortParts = parts1.length > parts2.length ? parts2 : parts1;
      let commonPart = [];
      for (let i = 0; i < shortParts.length; i++) {
        const _p1 = parts1[i];
        const _p2 = parts2[i];
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
          const dependentKeys = ember.getDependentKeys(node);
          let keyCombinations = a.getCombinations(dependentKeys, 2);
          keyCombinations = keyCombinations.filter(function (combo) {
            return combo[0] !== combo[1];
          });
          for (let i = 0; i < keyCombinations.length; i++) {
            const combo = keyCombinations[i];
            const invertedItem0 = combo[0].split(".").reverse().join(".");
            const invertedItem1 = combo[1].split(".").reverse().join(".");
            if (hasCommonSequence(combo[0], combo[1]) || hasCommonSequence(invertedItem0, invertedItem1)) {
              return context.report(node, "Some dependent keys may be grouped with Brace Expansion.");
            }
          }
        }
      }
    }
  }
};