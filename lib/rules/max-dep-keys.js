/**
 * @fileoverview Check number of dependent keys for observers and computed properties
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
  var allowedKeysCount = options.max || 3;
  var tryExpandKeys = options.tryExpandKeys;

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {
    "CallExpression": function (node) {
      if (ember.isComputedProperty(node) || ember.isObserver(node)) {
        var dependentKeys = ember.getDependentKeys(node);
        if (tryExpandKeys) {
          dependentKeys = ember.expandDependentKeys(dependentKeys);
        }
        if (Array.isArray(dependentKeys) && dependentKeys.length > allowedKeysCount) {
          context.report(node, "Too many dependent keys {{keys}}. Maximum allowed is {{max}}.", {keys: dependentKeys.length, max: allowedKeysCount});
        }
      }
    }
  };

};

module.exports.schema = [
  {
    type: "object",
    properties: {
      max: {
        type: "number",
        minimum: 0
      },
      tryExpandKeys: {
        type: "boolean"
      }
    },
    additionalProperties: false
  }
];