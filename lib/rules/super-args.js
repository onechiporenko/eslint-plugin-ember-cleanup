/**
 * @fileoverview Check potential invalid calls `_super` without `...`
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

module.exports = function (context) {

  var m = "`_super` should be called with `...{{propertyName}}`";


  var emberInstanceDeclaration = null;
  var restName = null;
  var currentProperty = null;

  function cleanUp() {
    restName = null;
    currentProperty = null;
  }

  return {
    "CallExpression": function (node) {
      if (ember.isEmberDeclaration(node)) {
        emberInstanceDeclaration = node;
      }
      var caller = n.getCaller(node);
      if (caller === "this._super") {
        var args = node.arguments;
        if (args.length === 1 && args[0].type === "Identifier") {
          var firstArg = args[0];
          if (!restName && firstArg.name === "arguments") {
            context.report(node, m, {propertyName: "arguments"});
          }
          if (restName && firstArg.name === restName) {
            context.report(node, m, {propertyName: restName});
          }
        }
      }
    },

    "CallExpression:exit": function (node) {
      if (ember.isEmberDeclaration(node)) {
        emberInstanceDeclaration = null;
      }
    },

    "Property": function (node) {
      if (emberInstanceDeclaration && o.get(node, "parent.parent") === emberInstanceDeclaration) {
        var valueType = node.value.type;
        if ("FunctionExpression" === valueType) {
          currentProperty = node;
          var params = node.value.params;
          if (params.length === 1 && params[0].type === "RestElement") {
            restName = params[0].argument.name;
          }
          if (!params.length) {
            restName = "arguments";
          }
          if (params.length > 1) {
            cleanUp();
          }
        }
      }
    },

    "Property:exit": function (node) {
      if (node && node === currentProperty) {
        cleanUp();
      }
    }

  }

};

module.exports.schema = [];