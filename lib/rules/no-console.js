/**
 * @fileoverview Propose to use `Ember.Logger` instead of `console`
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var consoleMethods = ["info", "debug", "warn", "error", "log"];

module.exports = function(context) {

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {

    "MemberExpression": function(node) {
      var object = node.object.name;
      if (object !== "console") {
        return;
      }
      var method = node.property.name || node.property.value;
      if (!method) {
        return;
      }
      if (consoleMethods.indexOf(method) !== -1) {
        context.report(node, "`Ember.Logger.{{method}}` should be used.", {method: method});
      }
    }

  };

};

module.exports.schema = [];