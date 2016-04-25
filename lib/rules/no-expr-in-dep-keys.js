/**
 * @fileoverview Checks for expressions in the dependent keys
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

var o = require("object-path");
var n = require("../utils/node.js");
var ember = require("../utils/ember.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  var m = "Expression should not be used for dependent key.";

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {
    "CallExpression": function (node) {
      if (n.isPropertyValueDeclaration(node) && (ember.isComputedProperty(node) || ember.isObserver(node))) {
        var dependentKeys = node.arguments;
        if (ember.isCpWithExtProto(node) || ember.isObserverWithExtProto(node)) {
          var notLiteralKeys = dependentKeys.filter(function (k) {
            return k.type !== "Literal";
          });
          if (notLiteralKeys.length) {
            return context.report(node, m);
          }
        }
        else {
          var dependentKeysTypes = {};
          dependentKeys.forEach(function (dependentKey) {
            if (!dependentKeysTypes.hasOwnProperty(dependentKey.type)) {
              dependentKeysTypes[dependentKey.type] = 0;
            }
            dependentKeysTypes[dependentKey.type]++;
          });
          var functionsAndObjectsCount = o.get(dependentKeysTypes, "FunctionExpression", 0) + o.get(dependentKeysTypes, "ObjectExpression", 0);
          if (functionsAndObjectsCount > 1) { // more that one obj or function
            return context.report(node, m);
          }
          if (functionsAndObjectsCount + o.get(dependentKeysTypes, "Literal", 0) !== dependentKeys.length) {
            return context.report(node, m);
          }
        }
      }
    }
  }

};

module.exports.schema = [];