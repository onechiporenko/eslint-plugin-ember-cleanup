/**
 * @fileoverview Disallow usage `Ember.defineProperty`. Propose to use `Ember.mixin()`
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

var n = require("../utils/node.js");
var ember = require("../utils/ember.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var m = "`Ember.defineProperty` should not be used. Use `Ember.mixin()` to define new properties.";

  var definePropertyFromEmber = false;

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {

    "VariableDeclarator": function (node) {
      var id = node.id;
      if (!id) {
        return;
      }
      var init = node.init;
      if (id.type === "Identifier" && id.name === "defineProperty" && init) {
        if (init.type === "MemberExpression") {
          var caller = n.getCaller(init);
          if (caller === "Ember.defineProperty" || caller === "Em.defineProperty") {
            definePropertyFromEmber = true;
          }
        }
      }
      if (id.type === "ObjectPattern" && ember.isEmber(init.name)) {
        var properties = id.properties;
        var pLength = properties.length;
        for (var i = 0; i < pLength; i++) {
          var prop = properties[i];
          if (prop.key.name === "defineProperty" && prop.value.name === "defineProperty") {
            definePropertyFromEmber = true;
            break;
          }
        }
      }
    },

    "CallExpression": function (node) {
      var caller = n.cleanCaller(n.getCaller(node));
      if (caller === "Ember.defineProperty" || caller === "Em.defineProperty") {
        context.report(node, m);
      }
      else {
        if (caller === "defineProperty" && definePropertyFromEmber) {
          context.report(node, m);
        }
      }
    }

  }

};

module.exports.schema = [];