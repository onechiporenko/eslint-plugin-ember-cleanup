# eslint-plugin-ember-cleanup

[![Build Status](https://travis-ci.org/onechiporenko/eslint-plugin-ember-cleanup.svg)](https://travis-ci.org/onechiporenko/eslint-plugin-ember-cleanup)
[![npm version](https://badge.fury.io/js/eslint-plugin-ember-cleanup.png)](http://badge.fury.io/js/eslint-plugin-ember-cleanup)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)
[![Downloads](http://img.shields.io/npm/dm/eslint-plugin-ember-cleanup.svg)](https://www.npmjs.com/package/eslint-plugin-ember-cleanup)

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-ember-cleanup`:

```
$ npm install eslint-plugin-ember-cleanup --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-ember-cleanup` globally.

## Usage

Add `ember-cleanup` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "ember-cleanup"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "ember-cleanup/rule-name": 2
    }
}
```

## Supported Rules

* `destructuring` Looks for usage `Ember.*` many times and propose to replace it with `const {} = Ember;` 
* `max-dep-keys` Checks number of dependent keys for observers and computed properties. Rule may be customized with `max` - maximum number of dependent keys (default `3`), `tryExpandKeys` - should keys like `a.{b,c}` be 1 key or it should be expanded to two keys - `a.b, a.c`. Default - `false`

```
{
    "rules": [
        "ember-cleanup/max-dep-keys": [2, {"max": 5, "tryExpandKeys": true}]
    ]
}
```

* `no-console` Propose to use `Ember.Logger` instead of `console`
* `no-dup-keys` Checks for duplicated dependent keys for observers and computed properties. Rule may be customized with `tryExpandKeys` - should keys like `a.{b,c}` be 1 key or it should be expanded to two keys - `a.b, a.c`. Default - `false`

```
{
    "rules": [
        "ember-cleanup/no-dup-keys": [2, {"tryExpandKeys": true}]
    ]
}
```

* `no-settimeout` Propose to use `Ember.run.later` instead of `setTimeout`
* `no-throw` Propose to use `Ember.assert` instead of throwing errors
* `no-typeof` Propose to use `Ember.typeOf` instead of  built-in `typeof` for some types check

```
{
    "rules: [
        "ember-cleanup/no-typeof": [2, {disallowed: ["object"]}]
    ]
}
```

* `cp-brace-expansion` Checks dependent keys for possibility to do brace expansion
* `no-is-array` Checks for array detection and propose to use `Ember.isArray`
* `no-set-in-getter` Disallow `Ember.set`, `this.set` inside computed properties getters
* `no-this-in-dep-keys` Check for dependent keys that starts with `this.`
* `one-level-each` Checks for dependent keys with invalid `@each` usage
* `no-multi-dots` Checks for dependent keys that contains `..`
* `no-typo-in-dep-keys` Rule to check possible typos in the dependent keys (it doesn't check short keys). Rule may be customized with `ignoreExclamationMark` - should keys like `!abc` and `abc` be processed as equal (`false` by default). **IMPORTANT** This rule is experimental and may do false alarms
* `cp-macro-args-limit` Checks number of the dependent keys for computed macros
* `cp-macro-not-key` Checks arguments for computed macros to not be dependent keys
* `no-expr-in-dep-keys` Checks for expressions in the dependent keys

## Usage

Add to your eslint config-file:

```javascript
"plugins": [
    "ember-cleanup"
],
"rules": {
    "ember-cleanup/destructuring": 1,
    "ember-cleanup/max-dep-keys": [2, {"max": 5, "tryExpandKeys": true}],
    "ember-cleanup/no-console": 1,
    "ember-cleanup/no-dup-keys": [2, {"tryExpandKeys": true}],
    "ember-cleanup/no-settimeout": 2,
    "ember-cleanup/no-throw": 2,
    "ember-cleanup/no-typeof": [2, {"disallowed": ["object"]}],
    "ember-cleanup/cp-brace-expansion": 2,
    "ember-cleanup/no-is-array": 2,
    "ember-cleanup/no-set-in-getter": 2,
    "ember-cleanup/no-this-in-dep-keys": 2,
    "ember-cleanup/one-level-each": 2,
    "ember-cleanup/no-multi-dots": 1,
    "ember-cleanup/no-typo-in-dep-keys": [1, {
      "ignoreExclamationMark": true
    }],
    "ember-cleanup/cp-macro-args-limit": [2, {"check": {
      "and": {"min": 2},
      "or": {"min": 2},
      "max": {"eq": 1},
      "min": {"eq": 1}
    }}],
    "ember-cleanup/cp-macro-not-key": [2, {"check": {
      "equal": [1],
      "filterBy": [2],
      "gt": [1],
      "gte": [1],
      "lt": [1],
      "lte": [1]
    }}],
    "ember-cleanup/no-expr-in-dep-keys": 2
}
```