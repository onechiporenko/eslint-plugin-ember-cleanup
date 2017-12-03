"use strict";

const o = require("object-path");
const n = require("../utils/node.js");

module.exports = {
  meta: {
    docs: {
      description: "For internal use only",
      category: "",
      recommended: false
    },
    schema: [
      {
        type: "object",
        properties: {
          callersToCheck: {
            "type": "object",
            "minProperties": 1,
            "patternProperties": {
              ".*": {
                "type": "array",
                "items": {
                  "type": "string"
                },
                "minItems": 1,
                "uniqueItems": true
              }
            }
          }
        },
        additionalProperties: false
      }
    ],
    fixable: null
  },

  create: function (context) {
    const options = context.options[0] || {};
    const callersToCheck = options.callersToCheck;
    const callerNames = Object.keys(callersToCheck);
    const m = "`{{property}}` should not be declared in the 1st argument for `{{callee}}`-call.";

    return {
      "Property": function (node) {
        if (node.parent.type === "ObjectExpression" && o.get(node, "parent.parent.type") === "CallExpression") {
          if (node.parent !== o.get(node, "parent.parent.arguments.0")) {
            return;
          }
          const propertyName = node.key.name;
          const caller = n.getCaller(node.parent.parent);
          if (callerNames.indexOf(caller) !== -1) {
            if (callersToCheck[caller].indexOf(propertyName) !== -1) {
              context.report(node, m, {property: propertyName, callee: caller});
            }
          }
        }
      }
    }
  }
};