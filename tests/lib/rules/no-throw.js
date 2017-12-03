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

var rule = require("../../../lib/rules/no-throw"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
var m = "`assert` from `@ember/debug` is better.";

var validTests = [
  {
    code: "Ember.assert('throw me', true);"
  }
];

var invalidTests = [
  {code: "throw new Error();", errors: [{message: m}]},
  {code: "throw new Error('error');", errors: [{message: m}]},
  {code: "throw Error('error');", errors: [{message: m}]},
  {code: "var e = new Error(); throw e;", errors: [{message: m}]},
  {code: "try {throw new Error();} catch (e) {throw e;};", errors: [{message: m},{message: m}]},
  {code: "throw a;", errors: [{message: m}]}, // Identifier
  {code: "throw foo();", errors: [{message: m}]}, // CallExpression
  {code: "throw new foo();", errors: [{message: m}]}, // NewExpression
  {code: "throw foo.bar;", errors: [{message: m}]}, // MemberExpression
  {code: "throw foo[bar];", errors: [{message: m}]}, // MemberExpression
  {code: "throw foo = new Error();", errors: [{message: m}]}, // AssignmentExpression
  {code: "throw 1, 2, new Error();", errors: [{message: m}]}, // SequenceExpression
  {code: "throw 'literal' && new Error();", errors: [{message: m}]}, // LogicalExpression (right)
  {code: "throw new Error() || 'literal';", errors: [{message: m}]}, // LogicalExpression (left)
  {code: "throw foo ? new Error() : 'literal';", errors: [{message: m}]}, // ConditionalExpression (consequent)
  {code: "throw foo ? 'literal' : new Error();", errors: [{message: m}]}, // ConditionalExpression (alternate)
  {
    code: "throw 'error';",
    errors: [{
      message: m
    }]
  },
  {
    code: "throw 0;",
    errors: [{
      message: m
    }]
  },
  {
    code: "throw false;",
    errors: [{
      message: m
    }]
  },
  {
    code: "throw null;",
    errors: [{
      message: m
    }]
  },
  {
    code: "throw undefined;",
    errors: [{
      message: m
    }]
  },
  // String concatenation
  {
    code: "throw 'a' + 'b';",
    errors: [{
      message: m
    }]
  },
  {
    code: "var b = new Error(); throw 'a' + b;",
    errors: [{
      message: m
    }]
  },
  // AssignmentExpression
  {
    code: "throw foo = 'error';",
    errors: [{
      message: m
    }]
  },
  // SequenceExpression
  {
    code: "throw new Error(), 1, 2, 3;",
    errors: [{
      message: m
    }]
  },
  // LogicalExpression
  {
    code: "throw 'literal' && 'not an Error';",
    errors: [{
      message: m
    }]
  },
  // ConditionalExpression
  {
    code: "throw foo ? 'not an Error' : 'literal';",
    errors: [{
      message: m
    }]
  }
];

var ruleTester = new RuleTester();
ruleTester.run("no-throw", rule, {
  valid: validTests,
  invalid: invalidTests
});