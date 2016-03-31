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

function parseCount(test) {
  Object.keys(test.options[0].check).forEach(function (k) {
    ["min", "max", "eq"].forEach(function (p) {
      if (test.options[0].check[k].hasOwnProperty(p)) {
        test.options[0].check[k][p] = parseInt(test.options[0].check[k][p], 10);
      }
    });
  });
  return test;
}

var mAtLeast = "`computed.{{MACRO}}` is called with {{NUM}} dependent key(s). Must be at least {{MIN}} dependent key(s)";
var mAtMost = "`computed.{{MACRO}}` is called with {{NUM}} dependent key(s). Must be at most {{MAX}} dependent key(s)";
var mEq = "`computed.{{MACRO}}` is called with {{NUM}} dependent key(s). Must be only {{EQ}} dependent key(s)";

var macrosForMin = [
  {MACRO: "and"},
  {MACRO: "or"}
];

var customMacro = [{MACRO: "customMacro"}];

var codes = require("./keys.js").macro.map(function (c) {
  var _c = JSON.parse(JSON.stringify(c));
  _c.CODE = _c.CODE.replace(";", "");
  return _c;
});

var validKeysForMin = [
  {KEYS: "'a', 'b', 'c'", MIN: 2},
  {KEYS: "'a', 'b', 'c', 'd'", MIN: 3},
  {KEYS: "'a', 'b', 'c', 'd', 'e'", MIN: 4}
];

var invalidKeysForMin = [
  {KEYS: "'a'", NUM: 1, MIN: 2},
  {KEYS: "'a' + val", NUM: 1, MIN: 2},
  {KEYS: "'a', 'b'", NUM: 2, MIN: 3},
  {KEYS: "'a', 'b', 'c'", NUM: 3, MIN: 4}
];

var validTestTemplatesForMin = [
  {
    code: "Em.Object.extend({ key : {{CODE}} });",
    options: [{
      namespaces: ["myNamespace", "space.subSpace"],
      check: {
        customMacro: {min: "{{MIN}}"},
        and: {min: "{{MIN}}"},
        or: {min: "{{MIN}}"}
      }
    }]
  }
];

var invalidTestTemplatesForMin = [
  {
    code: "Em.Object.extend({ key : {{CODE}} });",
    options: [{
      namespaces: ["myNamespace", "space.subSpace"],
      check: {
        customMacro: {min: "{{MIN}}"},
        and: {min: "{{MIN}}"},
        or: {min: "{{MIN}}"}
      }
    }],
    errors: [
      {message: mAtLeast, type: "CallExpression"}
    ]
  }
];

var validTests = j
  .setTemplates(validTestTemplatesForMin)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code"], macrosForMin)
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.check.{and,or}.min"], validKeysForMin)
  .uniqueCombos()
  .getCombos();

var customValidTests = j
  .setTemplates(validTestTemplatesForMin)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code"], customMacro)
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.check.{and,or,customMacro}.min"], validKeysForMin)
  .uniqueCombos()
  .getCombos();

var allValidTests = validTests.concat(customValidTests).map(parseCount);

var invalidTests = j
  .setTemplates(invalidTestTemplatesForMin)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code", "errors.0.message"], macrosForMin)
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.check.{and,or}.min", "errors.0.message"], invalidKeysForMin)
  .uniqueCombos()
  .getCombos();

var customInvalidTests = j
  .setTemplates(invalidTestTemplatesForMin)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code", "errors.0.message"], customMacro)
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.check.{and,or,customMacro}.min", "errors.0.message"], invalidKeysForMin)
  .uniqueCombos()
  .getCombos();

var allInvalidTests = invalidTests.concat(customInvalidTests).map(parseCount);

var ruleTester = new RuleTester({env: {es6: true}});
ruleTester.run("cp-macro-args-limit", rule, {
  valid: allValidTests,
  invalid: allInvalidTests
});

/* EQ */

var macrosForEq = [
  {MACRO: "max"},
  {MACRO: "min"}
];

var validTestTemplatesForEq = [
  {
    code: "Em.Object.extend({ key : {{CODE}} });",
    options: [{
      namespaces: ["myNamespace", "space.subSpace"],
      check: {
        customMacro: {eq: "{{EQ}}"},
        min: {eq: "{{EQ}}"},
        max: {eq: "{{EQ}}"}
      }
    }]
  }
];

var invalidTestTemplatesForEq = [
  {
    code: "Em.Object.extend({ key : {{CODE}} });",
    options: [{
      namespaces: ["myNamespace", "space.subSpace"],
      check: {
        customMacro: {eq: "{{EQ}}"},
        min: {eq: "{{EQ}}"},
        max: {eq: "{{EQ}}"}
      }
    }],
    errors: [
      {message: mEq, type: "CallExpression"}
    ]
  }
];

var validKeysForEq = [
  {KEYS: "'a', 'b'", EQ: 2},
  {KEYS: "'a', 'b', 'c'", EQ: 3},
  {KEYS: "'a', 'b', 'c', 'd'", EQ: 4}
];

var invalidKeysForEq = [
  {KEYS: "'a'", NUM: 1, EQ: 2},
  {KEYS: "'a', 'b', 'c'", NUM: 3, EQ: 2},
  {KEYS: "'a' + val", NUM: 1, EQ: 2},
  {KEYS: "'a', 'b'", NUM: 2, EQ: 3},
  {KEYS: "'a', 'b', 'c', 'd'", NUM: 4, EQ: 3},
  {KEYS: "'a', 'b', 'c'", NUM: 3, EQ: 4}
];

validTests = j
  .setTemplates(validTestTemplatesForEq)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code"], macrosForEq)
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.check.{max,min}.eq"], validKeysForEq)
  .uniqueCombos()
  .getCombos();

customValidTests = j
  .setTemplates(validTestTemplatesForEq)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code"], customMacro)
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.check.{max,min,customMacro}.eq"], validKeysForEq)
  .uniqueCombos()
  .getCombos();

allValidTests = validTests.concat(customValidTests).map(parseCount);

invalidTests = j
  .setTemplates(invalidTestTemplatesForEq)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code", "errors.0.message"], macrosForEq)
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.check.{max,min}.eq", "errors.0.message"], invalidKeysForEq)
  .uniqueCombos()
  .getCombos();

customInvalidTests = j
  .setTemplates(invalidTestTemplatesForEq)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code", "errors.0.message"], customMacro)
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.check.{max,min,customMacro}.eq", "errors.0.message"], invalidKeysForEq)
  .uniqueCombos()
  .getCombos();

allInvalidTests = invalidTests.concat(customInvalidTests).map(parseCount);

ruleTester.run("cp-macro-args-limit", rule, {
  valid: allValidTests,
  invalid: allInvalidTests
});

/* MAX */

var macrosForMax = [
  {MACRO: "superMacro1"},
  {MACRO: "superMacro2"}
];

var validTestTemplatesForMax = [
  {
    code: "Em.Object.extend({ key : {{CODE}} });",
    options: [{
      namespaces: ["myNamespace", "space.subSpace"],
      check: {
        superMacro1: {max: "{{MAX}}"},
        superMacro2: {max: "{{MAX}}"}
      }
    }]
  }
];

var invalidTestTemplatesForMax = [
  {
    code: "Em.Object.extend({ key : {{CODE}} });",
    options: [{
      namespaces: ["myNamespace", "space.subSpace"],
      check: {
        superMacro1: {max: "{{MAX}}"},
        superMacro2: {max: "{{MAX}}"}
      }
    }],
    errors: [
      {message: mAtMost, type: "CallExpression"}
    ]
  }
];

var validKeysForMax = [
  {KEYS: "'a'", MAX: 2},
  {KEYS: "'a', 'b'", MAX: 2},
  {KEYS: "'a', 'b'", MAX: 3},
  {KEYS: "'a', 'b', 'c'", MAX: 3},
  {KEYS: "'a', 'b', 'c'", MAX: 4},
  {KEYS: "'a', 'b', 'c', 'd'", MAX: 4}
];

var invalidKeysForMax = [
  {KEYS: "'a', 'b', 'c'", NUM: 3, MAX: 2},
  {KEYS: "'a', 'b'", NUM: 2, MAX: 1},
  {KEYS: "'a', 'b', 'c', 'd'", NUM: 4, MAX: 3}
];

validTests = j
  .setTemplates(validTestTemplatesForMax)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code"], macrosForEq)
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.check.{superMacro1,superMacro2}.max"], validKeysForMax)
  .uniqueCombos()
  .getCombos();

allValidTests = validTests.map(parseCount);

invalidTests = j
  .setTemplates(invalidTestTemplatesForMax)
  .createCombos(["code"], codes)
  .useCombosAsTemplates()
  .createCombos(["code", "errors.0.message"], macrosForMax)
  .useCombosAsTemplates()
  .createCombos(["code", "options.0.check.{superMacro1,superMacro2}.max", "errors.0.message"], invalidKeysForMax)
  .uniqueCombos()
  .getCombos();

allInvalidTests = invalidTests.map(parseCount);

ruleTester.run("cp-macro-args-limit", rule, {
  valid: allValidTests,
  invalid: allInvalidTests
});