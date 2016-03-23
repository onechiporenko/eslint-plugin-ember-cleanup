/**
 * @fileoverview Propose to use `Ember.run.later` instead of `setTimeout`
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

var o = require("object-path");
var n = require("../utils/node.js");
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  var reportMsg = "`Ember.run.{{methodName}}` should be used.";

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {

    "CallExpression": function(node) {
      var args = o.get(node, "arguments");
      var time = args.length > 1 ? args.pop().value : null;
      var methodName = time === 1 ? "next" : "later";
      var callee = o.get(node, "callee");
      if (o.get(callee, "name") === "setTimeout") {
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