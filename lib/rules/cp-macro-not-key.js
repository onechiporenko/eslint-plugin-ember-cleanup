"use strict";

const a = require("../utils/array.js");
const n = require("../utils/node.js");
const ember = require("../utils/ember.js");
const m = "{{position}} argument for `{{macro}}` should be raw-value and not a dependent key";

function num(n) {
  const map = {
    1: "1st",
    2: "2nd",
    3: "3rd"
  };
  return map[n] || n + "th";
}

module.exports = {
  meta: {
    docs: {
      description: "Checks arguments for computed macros to not be dependent keys. Several CP macros don't expect that some of their arguments will be dependent keys and not values.",
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
                "type": "array",
                "items": {
                  "type": "number",
                  "minimum": 0
                },
                "minItems": 1,
                "uniqueItems": true
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
    const options = context.options[0] || {};
    const namespaces = Array.isArray(options.namespaces) ? options.namespaces : [];
    const macrosMap = options.hasOwnProperty("check") ? options.check : {};
    const macroNames = a.combine(namespaces, Object.keys(macrosMap));

    /**
     * Checks if node is Literal with string value
     *
     * @param {ASTNode} node
     * @returns {*|boolean}
     */
    function nodeIsString(node) {
      return node && node.type === "Literal" && typeof node.value === "string";
    }

    /**
     *
     * @param {ASTNode} node
     * @param {string} macroName
     */
    function checkMacroName(node, macroName) {
      if (macrosMap.hasOwnProperty(macroName)) {
        const dependentKeys = node.arguments;
        const objectProperties = n.getPropertyNamesInParentObjectExpression(node);
        const positionsToCheck = macrosMap[macroName];
        for (let i = 0; i < dependentKeys.length; i++) {
          if (positionsToCheck.indexOf(i) !== -1) {
            const dependentKey = dependentKeys[i];
            if (!nodeIsString(dependentKey)) {
              continue;
            }
            const possiblePropertyName = dependentKey.value.split(".").shift(); // take "a" from strings like "a.b.c"
            if (objectProperties.indexOf(possiblePropertyName) !== -1) {
              context.report(node, m, {macro: macroName, position: num(i + 1)});
            }
          }
        }
      }
    }

    return {
      "CallExpression": function (node) {
        const fullMacroName = node.callee.name || n.getCaller(node);
        if ((ember.isComputedMacro(node) || macroNames.indexOf(fullMacroName) !== -1) && n.isPropertyValueDeclaration(node)) {
          const shortMacroName = n.getFunctionName(node);
          if (shortMacroName === fullMacroName) {
            checkMacroName(node, shortMacroName);
          }
          else {
            checkMacroName(node, shortMacroName);
            checkMacroName(node, fullMacroName);
          }
        }
      }
    }
  }
};