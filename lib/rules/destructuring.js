/**
 * @fileoverview Looks for usage Ember.* many times and propose to replace it with `const {} = Ember;`
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";
var objectPath = require("object-path");


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var hash = {};

  return {

    "MemberExpression": function (node) {
      var object = objectPath.get(node, "object.name");
      if (object !== "Ember") {
        return;
      }
      var property = objectPath.get(node, "property.name");
      if (!property) {
        return;
      }
      var caller = object + "." + property;
      if (!hash[caller]) {
        hash[caller] = [];
      }
      hash[caller].push(node);
    },

    "Program:exit": function (node) {
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