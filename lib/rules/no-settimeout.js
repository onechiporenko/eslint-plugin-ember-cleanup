/**
 * @fileoverview Propose to use `Ember.run.later` instead of `setTimeout`
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

var n = require("../utils/node.js");
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  var reportMsg = "`{{methodName}}` from `@ember/run` should be used.";

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {

    "CallExpression": function(node) {
      var args = node.arguments;
      var time = args.length > 1 ? args[args.length - 1].value : null;
      var methodName = time === 1 ? "next" : "later";
      var callee = node.callee;
      if (callee.name === "setTimeout") {
        context.report(node, reportMsg, {methodName: methodName});
        return;
      }
      var caller = n.cleanCaller(n.getCaller(callee));
      if (["window.setTimeout", "setTimeout"].indexOf(caller) !== -1) {
        context.report(node, reportMsg, {methodName: methodName});
      }
    }

  };

};

module.exports.schema = [];