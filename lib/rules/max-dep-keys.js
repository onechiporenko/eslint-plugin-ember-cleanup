"use strict";

const ember = require("../utils/ember.js");

module.exports = {
  meta: {
    docs: {
      description: "Checks number of dependent keys",
      category: "Dependent Keys",
      recommended: true
    },
    schema: [
      {
        type: "object",
        properties: {
          max: {
            type: "number",
            minimum: 0
          },
          tryExpandKeys: {
            type: "boolean"
          }
        },
        additionalProperties: false
      }
    ],
    fixable: null
  },

  create: function (context) {
    const options = context.options[0] || {};
    const allowedKeysCount = options.max || 3;
    const tryExpandKeys = options.hasOwnProperty("tryExpandKeys") ? options.tryExpandKeys : true;

    return {
      "CallExpression": function (node) {
        if (ember.isComputedProperty(node) || ember.isObserver(node)) {
          let dependentKeys = ember.getDependentKeys(node);
          if (tryExpandKeys) {
            dependentKeys = ember.expandDependentKeys(dependentKeys);
          }
          if (Array.isArray(dependentKeys) && dependentKeys.length > allowedKeysCount) {
            context.report(node, "Too many dependent keys {{keys}}. Maximum allowed is {{max}}.", {keys: dependentKeys.length, max: allowedKeysCount});
          }
        }
      }
    };
  }
};