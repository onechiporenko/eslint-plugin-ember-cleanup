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

  var reportMsg = "`Ember.run.later` should be used.";

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {

    "CallExpression": function(node) {
      var callee = o.get(node, "callee");
      if (o.get(callee, "name") === "setTimeout") {
        context.report(node, reportMsg);
        return;
      }
      var caller = n.cleanCaller(n.getCaller(callee));
      if (["window.setTimeout", "setTimeout"].indexOf(caller) !== -1) {
        context.report(node, reportMsg);
      }
    }

  };

};

module.exports.schema = [];