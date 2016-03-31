/**
 * @fileoverview Checks dependent keys for possibility to do brace expansion
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

  function u(value, index, self) {
    return self.indexOf(value) === index;
  }

  return {

    "CallExpression": function (node) {
      if (ember.isEmberField(node)) {
        var dependentKeys = ember.getDependentKeys(node);
        var dependentKeysMatrix = dependentKeys.map(function (depedentKey) {
          return depedentKey.split(".");
        });
        var firstLine = [];
        var lastLine = [];
        for (var i = 0; i < dependentKeysMatrix.length; i++) {
          firstLine.push(dependentKeysMatrix[i][0]);
          lastLine.push(dependentKeysMatrix[i][dependentKeysMatrix[i].length - 1]);
        }
        var firstLineUnique = firstLine.filter(u);
        var lastLineUnique = lastLine.filter(u);

        if (firstLine.length !== firstLineUnique.length || lastLine.length !== lastLineUnique.length) {
          context.report(node, "Some dependent keys may be grouped with Brace Expansion.");
        }
      }
    }
  }

};

module.exports.schema = [];