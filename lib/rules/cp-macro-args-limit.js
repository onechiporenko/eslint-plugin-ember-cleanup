"use strict";

const o = require("object-path");
const n = require("../utils/node.js");
const a = require("../utils/array.js");
const ember = require("../utils/ember.js");
const mAtLeast = "`{{name}}` is called with {{num}} dependent key(s). Must be at least {{min}} dependent key(s)";
const mAtMost = "`{{name}}` is called with {{num}} dependent key(s). Must be at most {{max}} dependent key(s)";
const mEq = "`{{name}}` is called with {{num}} dependent key(s). Must be only {{eq}} dependent key(s)";

module.exports = {
  meta: {
    docs: {
      description: "Checks number of the dependent keys for computed macros",
      category: "Dependent Keys",
      recommended: true
    },
    schema: [
      {
        "type": "object",
        "properties": {
          "check": {
            "type": "object",
            "minProperties": 1,
            "patternProperties": {
              ".*": {
                "type": "object",
                "properties": {
                  "min": {
                    "type": "number"
                  },
                  "max": {
                    "type": "number",
                    "minimum": 1
                  },
                  "eq": {
                    "type": "number"
                  }
                }
              }
            }
          },
          "namespaces": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "minItems": 1,
            "uniqueItems": true
          }
        }
      }
    ],
    fixable: null
  },

  create: function (context) {
    const options = context.options[0] || {
        check: {
          and: {min: 2},
          or: {min: 2}
        }
      };
    const namespaces = Array.isArray(options.namespaces) ? options.namespaces : [];
    const macrosMap = options.hasOwnProperty("check") ? options.check : {};
    const macroNames = a.combine(namespaces, Object.keys(macrosMap));
    return {
      "CallExpression": function (node) {
        const fullMacroName = o.get(node, "callee.name") || n.getCaller(node);
        if ((ember.isComputedMacro(node) || macroNames.indexOf(fullMacroName) !== -1) && n.isPropertyValueDeclaration(node)) {
          const dependentKeys = node.arguments;
          const shortMacroName = n.getFunctionName(node);
          if (macrosMap.hasOwnProperty(shortMacroName)) {
            const opts = macrosMap[shortMacroName];
            const reportArgs = {name: shortMacroName, num: dependentKeys.length};

            if (opts.hasOwnProperty("eq") && dependentKeys.length !== opts.eq) {
              reportArgs.eq = opts.eq;
              return context.report(node, mEq, reportArgs);
            }

            if (opts.hasOwnProperty("min") && dependentKeys.length < opts.min) {
              reportArgs.min = opts.min;
              return context.report(node, mAtLeast, reportArgs);
            }

            if (opts.hasOwnProperty("max") && dependentKeys.length > opts.max) {
              reportArgs.max = opts.max;
              return context.report(node, mAtMost, reportArgs);
            }

          }
        }
      }
    }
  }
};