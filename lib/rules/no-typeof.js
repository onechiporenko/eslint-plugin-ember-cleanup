/**
 * @fileoverview Propose to use `Ember.typeOf` instead of  built-in `typeof`
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {

    "UnaryExpression": function(node) {
      if (node.operator === "typeof") {
        context.report(node, "`Ember.typeOf` can give more accurate result.");
      }
    }

  };

};

module.exports.schema = [];