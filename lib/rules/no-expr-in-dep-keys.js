"use strict";

const o = require("object-path");
const n = require("../utils/node.js");
const ember = require("../utils/ember.js");

module.exports = {
  meta: {
    docs: {
      description: "Don't use expression as a dependent keys.",
      category: "Dependent Keys",
      recommended: true
    },
    fixable: null
  },
  create: function (context) {
    const m = "Expression should not be used for dependent key.";
    return {
      "CallExpression": function (node) {
        if (n.isPropertyValueDeclaration(node) && (ember.isComputedProperty(node) || ember.isObserver(node))) {
          const dependentKeys = node.arguments;
          if (ember.isCpWithExtProto(node) || ember.isObserverWithExtProto(node)) {
            const notLiteralKeys = dependentKeys.filter(function (k) {
              return k.type !== "Literal";
            });
            if (notLiteralKeys.length) {
              return context.report(node, m);
            }
          }
          else {
            const dependentKeysTypes = {};
            dependentKeys.forEach(function (dependentKey) {
              if (!dependentKeysTypes.hasOwnProperty(dependentKey.type)) {
                dependentKeysTypes[dependentKey.type] = 0;
              }
              dependentKeysTypes[dependentKey.type]++;
            });
            const functionsAndObjectsCount = o.get(dependentKeysTypes, "FunctionExpression", 0) + o.get(dependentKeysTypes, "ObjectExpression", 0);
            if (functionsAndObjectsCount > 1) { // more that one obj or function
              return context.report(node, m);
            }
            if (functionsAndObjectsCount + o.get(dependentKeysTypes, "Literal", 0) !== dependentKeys.length) {
              return context.report(node, m);
            }
          }
        }
      }
    }
  }
};