/**
 * @fileoverview Check for dependent keys that contains `..`
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";
var ember = require("../utils/ember.js");
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {
    "CallExpression": function (node) {
      if (ember.isEmberField(node)) {
        var keys = ember.getDependentKeys(node);
        keys = ember.expandDependentKeys(keys.filter(onlyUnique));
        for (var i = 0; i < keys.length; i++) {
          if (keys[i].indexOf("..") !== -1) {
            return context.report(node, "`..` should not be in the dependent keys.");
          }
        }
      }
    }
  };

};

module.exports.schema = [];