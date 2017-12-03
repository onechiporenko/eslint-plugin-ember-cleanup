"use strict";

const n = require("../utils/node.js");
const message = "Empty `extend` is redundant.";

module.exports = {
  meta: {
    docs: {
      description: "No sense to create empty Controllers, Components, Routes etc. Ember will do this itself.",
      category: "General",
      recommended: true
    },
    schema: [
      {
        type: "object",
        properties: {
          allowedFor: {
            type: "array",
            items: {
              type: "string"
            },
            minItems: 1,
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ],
    fixable: null
  },
  create: function (context) {
    const options = context.options[0] || {};
    const allowedFor = options.allowedFor || [];
    const allowedForL = allowedFor.length;

    return {

      "CallExpression": function (node) {
        const caller = n.getCaller(node);
        if (n.getFunctionName(node) !== "extend") {
          return;
        }
        for (let i = 0; i < allowedForL; i++) {
          if (caller.indexOf(allowedFor[i]) !== -1) {
            return;
          }
        }
        const args = node.arguments;
        if (args.length) {
          if (args[0].type !== "ObjectExpression") {
            return;
          }
          if (!args[0].properties.length) {
            context.report(node, message);
          }
        }
        else {
          context.report(node, message);
        }
      }

    };
  }
};