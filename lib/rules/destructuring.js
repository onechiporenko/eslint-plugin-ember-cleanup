/**
 * @fileoverview Looks for usage Ember.* many times and propose to replace it with `const {} = Ember;`
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";
var ember = require("../utils/ember.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var hash = {};

  return {

    "MemberExpression": function (node) {
      var object = node.object.name;
      if (!ember.isEmber(object)) {
        return;
      }
      var property = node.property.name || node.property.value;
      if (!property) {
        return;
      }
      var caller = "Ember." + property;
      if (!hash[caller]) {
        hash[caller] = [];
      }
      hash[caller].push(node);
    },

    "Program:exit": function () {
      Object.keys(hash).forEach(function (caller) {
        var nodesCount = hash[caller].length;
        // don't report single usage
        if (nodesCount > 1) {
          for (var i = 0; i < nodesCount; i++) {
            context.report(hash[caller][i], "`{{caller}}` is used many times. Maybe it should be destructured?", {caller: caller});
          }
        }
      });
    }

  };

};

module.exports.schema = [];