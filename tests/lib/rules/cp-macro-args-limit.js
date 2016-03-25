/**
 * @fileoverview
 * @author onechiporenko
 * @copyright 2016 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/cp-macro-args-limit"),
  RuleTester = require("eslint").RuleTester;

var Jsonium = require("jsonium");
var j = new Jsonium();
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var m = "`computed.{{MACRO}}` is called with {{NUM}} dependent key(s). Minimum number should be {{MIN}}";

var macros = [
  {MACRO: "and"},
  {MACRO: "or"}
];

var customMacro = [{MACRO: "customMacro"}];

var codes = require("./keys.js").macro;

var validKeys = [
  {KEYS: "'a', 'b', 'c'", MIN: 2},
  {KEYS: "'a', 'b', 'c', 'd'", MIN: 3},
  {KEYS: "'a', 'b', 'c', 'd', 'e'", MIN: 4}
];

var invalidKeys = [
  {KEYS: "'a'", NUM: 1, MIN: 2},
  {KEYS: "'a' + val", NUM: 1, MIN: 2},
  {KEYS: "'a', 'b'", NUM: 2, MIN: 3},
  {KEYS: "'a', 'b', 'c'", NUM: 3, MIN: 4}
];

var validTestTemplates = [
  {
    code:
      "{{CODE}}",
    options: [{
      min: "{{MIN}}"
    }]
  }
];

var invalidTestTemplates = [
  {
    code:
      "{{CODE}}",
    options: [{
      min: "{{MIN}}"
    }],
    errors: [
      {message: m, type: "CallExpression"}
    ]
  }
];


function parseMin(test) {
  if (test.options[0].hasOwnProperty("min")) {
    test.options[0].min = parseInt(test.options[0].min, 10);
  }
  return test;
}

function addCustomMacro(test) {
  test.options[0].check = [customMacro[0].MACRO];
  return test;
}

var validTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code"], macros)
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.min"], validKeys)
  .uniqueCombos()
  .getCombos();

var customValidTests = j
  .setTemplates(validTestTemplates)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code"], customMacro)
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.min"], validKeys)
  .uniqueCombos()
  .getCombos()
  .map(addCustomMacro);

var allValidTests = validTests.concat(customValidTests).map(parseMin);

var invalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code", "errors.0.message"], macros)
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.min", "errors.0.message"], invalidKeys)
  .uniqueCombos()
  .getCombos();

var customInvalidTests = j
  .setTemplates(invalidTestTemplates)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code", "errors.0.message"], customMacro)
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.min", "errors.0.message"], invalidKeys)
  .uniqueCombos()
  .getCombos()
  .map(addCustomMacro);

var allInvalidTests = invalidTests.concat(customInvalidTests).map(parseMin);

var ruleTester = new RuleTester({env: {es6: true}});
ruleTester.run("cp-macro-args-limit", rule, {
  valid: allValidTests,
  invalid: allInvalidTests
});
