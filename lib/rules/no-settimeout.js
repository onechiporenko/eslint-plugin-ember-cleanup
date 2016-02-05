/**
 * @fileoverview Propose to use `Ember.run.later` instead of `setTimeout`
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

var o = require("object-path");

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
      }
      var obj = o.get(callee, "object.name");
      var property = o.get(callee, "property.name");
      var caller = obj + "." + property;
      if (caller === "window.setTimeout") {
        context.report(node, reportMsg);
      }
    }

  };

};

module.exports.schema = [];