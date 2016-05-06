/**
 * @fileoverview Check for dependent keys with invalid `[]` usage
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
  var m2 = "`[]` should be at the end of the dependent key.";
  var m3 = "Dot should be before `[]`.";

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
        var report1 = false;
        var report2 = false;
        var report3 = false;
        for (var i = 0; i < dependentKeys.length; i++) {
          var key = dependentKeys[i];
          var subKeys = key.split(".");
          if (subKeys[subKeys.length - 1] === "@each") {
            report1 = true;
            continue;
          }
          var pos = key.indexOf("[]");
          if (pos === -1) {
            continue;
          }
          if (key.length !== pos + 2) {
            report2 = true;
            continue;
          }
          if (key[pos - 1] !== ".") {
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