"use strict";

const o = require("object-path");
const n = require("../utils/node.js");

module.exports = {
  meta: {
    docs: {
      description: "Checks for array detection and propose to use `isArray` from `@ember/array`",
      category: "Type Check",
      recommended: true
    },
    fixable: null
  },
  create: function (context) {
    const m = "`isArray` from `@ember/array` is better to detect arrays and array-like variables.";

    return {
      "CallExpression": function (node) {
        const caller = n.cleanCaller(n.getCaller(node));
        if (caller === "Array.isArray") {
          context.report(node, m);
        }
        else {
          if (["Ember.typeOf", "Em.typeOf", "typeOf"].indexOf(caller) !== -1) {
            const parent = node.parent;
            if (parent) {
              const type = o.get(parent, "left.type") === "Literal" ? o.get(parent, "left.value") : o.get(parent, "right.value");
              if (type === "array") {
                context.report(node, m);
              }
            }
          }
        }
      }
    }
  }
};