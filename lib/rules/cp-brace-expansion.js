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
        var keys = ember.getDependentKeys(node);
        var keysMatrix = keys.map(function (key) {
          return key.split(".");
        });
        var fsLine = [];
        var lsLine = [];
        for (var i = 0; i < keysMatrix.length; i++) {
          fsLine.push(keysMatrix[i][0]);
          lsLine.push(keysMatrix[i][keysMatrix[i].length - 1]);
        }
        var fsUnique = fsLine.filter(u);
        var lsUnique = lsLine.filter(u);

        if (fsLine.length !== fsUnique.length || lsLine.length !== lsUnique.length) {
          context.report(node, "Some dependent keys may be grouped with Brace Expansion.");
        }
      }
    }
  }

};

module.exports.schema = [];