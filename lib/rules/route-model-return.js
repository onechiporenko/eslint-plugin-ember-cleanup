"use strict";

const o = require("object-path");
const ember = require("../utils/ember.js");

module.exports = {
  meta: {
    docs: {
      description: "Hook `model` must return something",
      category: "Ember Specific",
      recommended: true
    },
    fixable: null
  },
  create: function (context) {
    const m = "`model` should return something";

    let emberRouteDeclaration = null;
    let modelFunction = null;

    return {
      "CallExpression": function (node) {
        if (ember.isRouteDeclaration(node)) {
          emberRouteDeclaration = node;
        }
      },

      "CallExpression:exit": function (node) {
        if (ember.isRouteDeclaration(node)) {
          emberRouteDeclaration = null;
        }
      },

      "Property": function (node) {
        const isRouteProperty = emberRouteDeclaration && o.get(node, "parent.parent") === emberRouteDeclaration;
        const propertyIsModel = node.key.name === "model";
        const valueIsFunction = node.value.type === "FunctionExpression";
        if (isRouteProperty && propertyIsModel && valueIsFunction) {
          modelFunction = node.value;
        }
      },

      "FunctionExpression": function (node) {
        if (node === modelFunction) {
          const body = o.get(node, "body.body");
          if (Array.isArray(body)) {
            const lastStatement = body[body.length - 1];
            const validReturnStatement = lastStatement.type === "ReturnStatement" && !!lastStatement.argument;
            const ifStatement = lastStatement.type === "IfStatement";
            if (!(validReturnStatement || ifStatement)) {
              context.report(node, m);
            }
          }
        }
      },

      "FunctionExpression:exit": function (node) {
        if (node === modelFunction) {
          modelFunction = null;
        }
      }

    }
  }
};