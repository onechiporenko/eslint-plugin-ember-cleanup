/**
 * @fileoverview Disallow `Ember.set`, `this.set` inside computed properties getters
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

module.exports = function(context) {

  var insideCpGetter = false;

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {
    "FunctionExpression": function (node) {
      if (ember.isCpGetter(node)) {
        insideCpGetter = true;
      }
    },
    "FunctionExpression:exit": function (node) {
      if (ember.isCpGetter(node)) {
        insideCpGetter = false;
      }
    },
    "CallExpression": function (node) {
      if (insideCpGetter) {
        var caller = n.cleanCaller(n.getCaller(node));
        if (["set", "Ember.set", "this.set"].indexOf(caller) !== -1) {
          context.report(node, "Ember-setter should not be used inside getter.");
        }
      }
    }
  };

};