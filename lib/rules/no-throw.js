"use strict";

module.exports = {
  meta: {
    docs: {
      description: "Rule proposes to use `assert` from `@ember/debug` instead of throwing errors",
      category: "Ember Specific",
      recommended: true
    },
    fixable: null
  },
  create: function (context) {
    return {
      "ThrowStatement": function(node) {
        context.report(node, "`assert` from `@ember/debug` is better.");
      }
    };
  }
};