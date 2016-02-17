/**
 * @fileoverview Checks for array detection and propose to use `Ember.isArray`
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

  var m = "`Ember.isArray` is better to detect arrays and array-like variables.";

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {
    "CallExpression": function (node) {
      var callee = o.get(node, "callee");
      if (o.get(callee, "type") === "MemberExpression") {
        var caller = n.cleanCaller(n.getCaller(node));
        if (caller === "Array.isArray") {
          context.report(node, m);
        }
        else {
          if (caller === "Ember.typeOf") {
            var parent = o.get(node, "parent");
            if (parent) {
              var type = o.get(parent, "left.type") === "Literal" ? o.get(parent, "left.value") : o.get(parent, "right.value");
              if (type === "array") {
                context.report(node, m);
              }
            }
          }
        }
      }
    },

    "UnaryExpression": function(node) {
      if (node.operator === "typeof") {
        var expression = node.parent;
        var needed = o.get(expression, "left.operator") === "typeof" ? o.get(expression, "right") : o.get(expression, "left");
        if (o.get(needed, "type") === "Literal") {
          var type = o.get(needed, "value");
          if (type === "array") {
            context.report(node, m);
          }
        }
      }
    }

  }

};

module.exports.schema = [];