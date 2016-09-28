/**
 * @fileoverview Check that route's `model` return value
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

  var m = "`model` should return something";

  var emberRouteDeclaration = null;
  var modelFunction = null;

  return {
    "CallExpression": function (node) {
      if (ember.isRouteDeclaration(node)) {
        emberRouteDeclaration = node;
      }
    },

    "CallExpression:exit": function (node) {
      if (ember.isRouteDeclaration(node)) {
        emberRouteDeclaration = null;
      }
    },

    "Property": function (node) {
      var isRouteProperty = emberRouteDeclaration && o.get(node, "parent.parent") === emberRouteDeclaration;
      var propertyIsModel = node.key.name === "model";
      var valueIsFunction = node.value.type === "FunctionExpression";
      if (isRouteProperty && propertyIsModel && valueIsFunction) {
        modelFunction = node.value;
      }
    },

    "FunctionExpression": function (node) {
      if (node === modelFunction) {
        var body = o.get(node, "body.body");
        if (Array.isArray(body)) {
          var lastStatement = body[body.length - 1];
          var validReturnStatement = lastStatement.type === "ReturnStatement" && !!lastStatement.argument;
          var ifStatement = lastStatement.type === "IfStatement";
          if (!(validReturnStatement || ifStatement)) {
            context.report(node, m);
          }
        }
      }
    },

    "FunctionExpression:exit": function (node) {
      if (node === modelFunction) {
        modelFunction = null;
      }
    }

  }

};

module.exports.schema = [];