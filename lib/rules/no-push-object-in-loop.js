
/**
 * @fileoverview Rule to disallow use `pushObject(s)` inside loops
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 */

"use strict";

var n = require("../utils/node.js");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {
  var loopStatements = ["WhileStatement", "DoWhileStatement", "ForStatement", "ForInStatement", "ForOfStatement"];
  var options = context.options[0] || {};
  var extraMemberExpression = options.hasOwnProperty("extraMemberExpression") ? options.extraMemberExpression : [];

  function detectParentLoop(node) {
    if (!node) {
      return false;
    }
    var caller = "" + n.getCaller(node);
    var isExtra = false;
    extraMemberExpression.forEach(function (str) {
      if (caller.indexOf(str, caller.length - str.length) !== -1) {
        isExtra = true;
      }
    });
    if (isExtra || loopStatements.indexOf(node.type) !== -1) {
      return true;
    }
    return detectParentLoop(node.parent);
  }

  return {
    "MemberExpression": function (node) {
      var name = node.property.name || node.property.value;
      if ((name === "pushObject" || name === "pushObjects") && node.object.type !== "Identifier") {
        if (detectParentLoop(node.parent)) {
          context.report(node, "`pushObject(s)` should not be used in the loop. Use `pushObjects` outside loop");
        }
      }
    }

  };
};

module.exports.schema = [
  {
    type: "object",
    properties: {
      extraMemberExpression: {
        type: "array",
        items: {
          type: "string"
        }
      }
    },
    additionalProperties: false
  }
];