/**
 * @fileoverview Looks for Computed Properties that look like `computed.alias` but written as 'general' CP
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";
var ember = require("../utils/ember.js");
var n = require("../utils/node.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var m = "May be simplified to `computed.alias`";

module.exports = function (context) {

  return {

    "CallExpression": function (node) {
      if (ember.isComputedProperty(node)) {
        var cpBody = ember.getCpBody(node);
        if (cpBody && cpBody.type === "FunctionExpression") {
          var body = cpBody.body.body;
          if (body.length === 1) {
            var statement = body[0];
            if (statement.type === "ReturnStatement") {
              var ret = statement.argument;
              if (ret.type === "CallExpression") {
                var callee = n.getCaller(ret);
                var args = ret.arguments;
                if ("this.get" === callee && args.length === 1 && args[0].type === "Literal") {
                  return context.report(node, m);
                }
                if (["Em.get", "Ember.get", "get"].indexOf(callee) !== -1 && args.length === 2  && args[0].type === "ThisExpression" &&  args[1].type === "Literal") {
                  return context.report(node, m);
                }
              }
            }
          }
        }
      }
    }

  };

};

module.exports.schema = [];