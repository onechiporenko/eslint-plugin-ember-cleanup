/**
 * @fileoverview Disallow for declarations arrays and objects in the components
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

var o = require("object-path");
var ember = require("../utils/ember.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var m = "Don't declare arrays or objects directly on Components. Instead, add them on `init`";


  var componentDeclaration = null;

  return {
    "CallExpression": function (node) {
      if (ember.isComponentDeclaration(node)) {
        componentDeclaration = node;
      }
    },

    "CallExpression:exit": function (node) {
      if (ember.isComponentDeclaration(node)) {
        componentDeclaration = null;
      }
    },

    "Property": function (node) {
      if (componentDeclaration && o.get(node, "parent.parent") === componentDeclaration) {
        var valueType = node.value.type;
        if (["ArrayExpression", "NewExpression"].indexOf(valueType) !== -1) {
          context.report(node, m);
        }
        // `actions` is allowed
        if (valueType === "ObjectExpression" && node.key.name !== "actions") {
          context.report(node, m);
        }
      }
    }

  }

};

module.exports.schema = [];