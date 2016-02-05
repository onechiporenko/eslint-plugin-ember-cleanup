/**
 * @fileoverview Propose to use `Ember.assert` instead of throwing errors
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

    "ThrowStatement": function(node) {
      context.report(node, "`Ember.assert` is better.");
    }

  };

};

module.exports.schema = [];