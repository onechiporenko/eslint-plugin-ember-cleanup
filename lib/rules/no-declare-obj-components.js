/**
 * @fileoverview Disallow for declarations arrays and objects in the components
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

var o = require("object-path");
var n = require("../utils/node.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

  var m = "Don't declare arrays or objects directly on Components. Instead, add them on `init`";


  var componentDeclaration = null;

  function isComponentDeclaration(node) {
    var caller = n.getCaller(node);
    return caller.indexOf("Component.extend") !== -1;
  }

  return {
    "CallExpression": function (node) {
      if (isComponentDeclaration(node)) {
        componentDeclaration = node;
      }
    },

    "CallExpression:exit": function (node) {
      if (isComponentDeclaration(node)) {
        componentDeclaration = null;
      }
    },

    "Property": function (node) {
      if (componentDeclaration && o.get(node, "parent.parent") === componentDeclaration) {
        var valueType = node.value.type;
        if (["ArrayExpression", "ObjectExpression", "NewExpression"].indexOf(valueType) !== -1) {
          context.report(node, m);
        }
      }
    }

  }

};

module.exports.schema = [];