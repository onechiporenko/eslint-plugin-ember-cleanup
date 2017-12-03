"use strict";

const o = require("object-path");
const n = require("../utils/node.js");
const ember = require("../utils/ember.js");

module.exports = {
  meta: {
    docs: {
      description: "Check potential invalid calls `_super` without `...`",
      category: "Ember Specific",
      recommended: true
    },
    fixable: null
  },
  create: function (context) {
    const m = "`_super` should be called with `...{{propertyName}}`";


    let emberInstanceDeclaration = null;
    let restName = null;
    let currentProperty = null;

    function cleanUp() {
      restName = null;
      currentProperty = null;
    }

    return {
      "CallExpression": function (node) {
        if (ember.isEmberDeclaration(node)) {
          emberInstanceDeclaration = node;
        }
        const caller = n.getCaller(node);
        if (caller === "this._super") {
          const args = node.arguments;
          if (args.length === 1 && args[0].type === "Identifier") {
            const firstArg = args[0];
            if (!restName && firstArg.name === "arguments") {
              context.report(node, m, {propertyName: "arguments"});
            }
            if (restName && firstArg.name === restName) {
              context.report(node, m, {propertyName: restName});
            }
          }
        }
      },

      "CallExpression:exit": function (node) {
        if (ember.isEmberDeclaration(node)) {
          emberInstanceDeclaration = null;
        }
      },

      "Property": function (node) {
        if (emberInstanceDeclaration && o.get(node, "parent.parent") === emberInstanceDeclaration) {
          const valueType = node.value.type;
          if ("FunctionExpression" === valueType) {
            currentProperty = node;
            const params = node.value.params;
            if (params.length === 1 && params[0].type === "RestElement") {
              restName = params[0].argument.name;
            }
            if (!params.length) {
              restName = "arguments";
            }
            if (params.length > 1) {
              cleanUp();
            }
          }
        }
      },

      "Property:exit": function (node) {
        if (node && node === currentProperty) {
          cleanUp();
        }
      }

    }
  }
};