"use strict";

const ember = require("../utils/ember.js");

module.exports = {
  meta: {
    docs: {
      description: "Multiple `@each` are not allowed in the same dependent key. Also `@each` can't have a deep suffix",
      category: "Dependent Keys",
      recommended: true
    },
    fixable: null
  },
  create: function (context) {
    const m2 = "Multiple `@each` in the one dependent key are not allowed.";
    const m3 = "Deep `@each` in the dependent key is not allowed.";

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    return {
      "CallExpression": function (node) {
        if (ember.isEmberField(node)) {
          let dependentKeys = ember.getDependentKeys(node);
          dependentKeys = ember.expandDependentKeys(dependentKeys.filter(onlyUnique));
          let report2 = false;
          let report3 = false;
          for (let i = 0; i < dependentKeys.length; i++) {
            if (dependentKeys[i].indexOf("@each") === -1) {
              continue;
            }
            const chunks = dependentKeys[i].split("@each");
            if (chunks.length > 2) {
              report2 = true;
              continue;
            }
            if (chunks[1].split(".").length > 2) {
              report3 = true;
            }
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
  }
};