"use strict";

const ember = require("../utils/ember.js");

module.exports = {
  meta: {
    docs: {
      description: "Dependent key can't end with `@each` (must be `[]`). `[]` can't be used in the middle of the dependent key (must be at the end). Dot must be before `[]`",
      category: "Dependent Keys",
      recommended: true
    },
    fixable: null
  },
  create: function (context) {
    const m1 = "Dependent key should not end with `@each`, use `[]` instead.";
    const m2 = "`[]` should be at the end of the dependent key.";
    const m3 = "Dot should be before `[]`.";

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    return {
      "CallExpression": function (node) {
        if (ember.isEmberField(node)) {
          let dependentKeys = ember.getDependentKeys(node);
          dependentKeys = ember.expandDependentKeys(dependentKeys.filter(onlyUnique));
          let report1 = false;
          let report2 = false;
          let report3 = false;
          for (let i = 0; i < dependentKeys.length; i++) {
            const key = dependentKeys[i];
            const subKeys = key.split(".");
            if (subKeys[subKeys.length - 1] === "@each") {
              report1 = true;
              continue;
            }
            const pos = key.indexOf("[]");
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
  }
};