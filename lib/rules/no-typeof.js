"use strict";

const o = require("object-path");

module.exports = {
  meta: {
    docs: {
      description: "Propose to use `typeOf` from `@ember/utils` instead of  built-in `typeof` for some types check",
      category: "Ember Specific",
      recommended: true
    },
    schema: [
      {
        type: "object",
        properties: {
          disallowed: {
            type: "array",
            "items": {
              "type": "string"
            },
            "minItems": 1,
            "uniqueItems": true
          }
        },
        additionalProperties: false
      }
    ],
    fixable: null
  },
  create: function (context) {
    const options = context.options[0];
    const disallowedTypes = options.disallowed;

    return {
      "UnaryExpression": function (node) {
        if (node.operator === "typeof") {
          const expression = node.parent;
          const nodeWithCheckedType = o.get(expression, "left.operator") === "typeof" ? expression.right : expression.left;
          if (o.get(nodeWithCheckedType, "type") === "Literal") {
            const type = nodeWithCheckedType.value;
            if (disallowedTypes.indexOf(type) !== -1) {
              context.report(node, "`typeOf` from `@ember/utils` can give more accurate result.");
            }
          }
        }
      }
    };
  }
};