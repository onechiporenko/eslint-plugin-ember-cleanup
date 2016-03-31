/**
 * @fileoverview Check for dependent keys that starts with `this.`
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
        var dependentKeys = ember.getDependentKeys(node);
        dependentKeys = ember.expandDependentKeys(dependentKeys.filter(onlyUnique));
        for (var i = 0; i < dependentKeys.length; i++) {
          if (dependentKeys[i].indexOf("this.") === 0) {
            return context.report(node, "Dependent keys should not starts with `this.`");
          }
        }
      }
    }
  };

};

module.exports.schema = [];