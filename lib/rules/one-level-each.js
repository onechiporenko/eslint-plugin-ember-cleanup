/**
 * @fileoverview Check for dependent keys with invalid `@each` usage
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

  var m1 = "Dependent key should not end with `@each`, use `[]` instead.";
  var m2 = "Multiple `@each` in the one dependent key are not allowed.";
  var m3 = "Deep `@each` in the dependent key is not allowed.";

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
        var report1 = false;
        var report2 = false;
        var report3 = false;
        for (var i = 0; i < keys.length; i++) {
          if (keys[i].indexOf("@each") === -1) {
            continue;
          }
          var subKeys = keys[i].split(".");
          if (subKeys[subKeys.length - 1] === "@each") {
            report1 = true;
            continue;
          }
          var chunks = keys[i].split("@each");
          if (chunks.length > 2) {
            report2 = true;
            continue;
          }
          if (chunks[1].split(".").length > 2) {
            report3 = true;
          }
        }
        if (report1) {
          context.report(node, m1);
        }
        if (report2) {
          context.report(node, m2);
        }
        if (report3) {
          context.report(node, m3);
        }
      }
    }
  };

};

module.exports.schema = [];