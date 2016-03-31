/**
 * @fileoverview Check for duplicated dependent keys for observers and computed properties
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

  var options = context.options[0] || {};
  var tryExpandKeys = options.tryExpandKeys;

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
        var uniqueDependentKeys = dependentKeys.filter(onlyUnique);
        if (tryExpandKeys) {
          dependentKeys = ember.expandDependentKeys(dependentKeys);
          uniqueDependentKeys = dependentKeys.filter(onlyUnique);
        }
        if (dependentKeys && uniqueDependentKeys && dependentKeys.length !== uniqueDependentKeys.length) {
          context.report(node, "Some dependent keys are duplicated.");
        }
      }
    }
  };

};

module.exports.schema = [
  {
    type: "object",
    properties: {
      tryExpandKeys: {
        type: "boolean"
      }
    },
    additionalProperties: false
  }
];