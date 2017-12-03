"use strict";

const n = require("../utils/node.js");

module.exports = {
  meta: {
    docs: {
      description: "`setTimeout` must not be used inside Ember app. `later` or `next` from `@ember/run` must be used",
      category: "Ember Specific",
      recommended: true
    },
    fixable: null
  },
  create: function (context) {
    const reportMsg = "`{{methodName}}` from `@ember/run` should be used.";
    return {
      "CallExpression": function(node) {
        const args = node.arguments;
        const time = args.length > 1 ? args[args.length - 1].value : null;
        const methodName = time === 1 ? "next" : "later";
        const callee = node.callee;
        if (callee.name === "setTimeout") {
          context.report(node, reportMsg, {methodName: methodName});
          return;
        }
        const caller = n.cleanCaller(n.getCaller(callee));
        if (["window.setTimeout", "setTimeout"].indexOf(caller) !== -1) {
          context.report(node, reportMsg, {methodName: methodName});
        }
      }
    };
  }
};