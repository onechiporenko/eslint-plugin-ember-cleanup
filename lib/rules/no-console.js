/**
 * @fileoverview Propose to use `Ember.Logger` instead of `console`
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";
var objectPath = require("object-path");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var consoleMethods = ['info', 'debug', 'warn', 'error', 'log'];

module.exports = function(context) {

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {

    "MemberExpression": function(node) {
      var object = objectPath.get(node, "object.name");
      if (object !== "console") {
        return;
      }
      var method = objectPath.get(node, "property.name") || objectPath.get(node, "property.value");
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