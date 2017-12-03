"use strict";

const ember = require("../utils/ember.js");

module.exports = {
  meta: {
    docs: {
      description: "Dependent keys for CP must not contain `this.`",
      category: "Dependent Keys",
      recommended: true
    },
    fixable: null
  },
  create: function (context) {
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    return {
      "CallExpression": function (node) {
        if (ember.isEmberField(node)) {
          let dependentKeys = ember.getDependentKeys(node);
          dependentKeys = ember.expandDependentKeys(dependentKeys.filter(onlyUnique));
          for (let i = 0; i < dependentKeys.length; i++) {
            if (dependentKeys[i].indexOf("this.") === 0) {
              return context.report(node, "Dependent keys should not starts with `this.`");
            }
          }
        }
      }
    };
  }
};