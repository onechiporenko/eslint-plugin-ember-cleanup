"use strict";

const ember = require("../utils/ember.js");
const n = require("../utils/node.js");
const m = "May be simplified to `alias` from `@ember/object/computed`";

module.exports = {
  meta: {
    docs: {
      description: "Looks for Computed Properties that look like `computed.alias` but written as 'general' CP",
      category: "Ember Specific",
      recommended: false
    },
    fixable: null
  },

  create: function (context) {
    return {
      "CallExpression": function (node) {
        if (ember.isComputedProperty(node)) {
          const cpBody = ember.getCpBody(node);
          if (cpBody && cpBody.type === "FunctionExpression") {
            const body = cpBody.body.body;
            if (body.length === 1) {
              const statement = body[0];
              if (statement.type === "ReturnStatement") {
                const ret = statement.argument;
                if (ret.type === "CallExpression") {
                  const callee = n.getCaller(ret);
                  const args = ret.arguments;
                  if ("this.get" === callee && args.length === 1 && args[0].type === "Literal") {
                    return context.report(node, m);
                  }
                  const calleeIsGet = ["Em.get", "Ember.get", "get"].indexOf(callee) !== -1;
                  const isGetArgs = args.length === 2 && args[0].type === "ThisExpression" && args[1].type === "Literal";
                  if (calleeIsGet && isGetArgs) {
                    return context.report(node, m);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};