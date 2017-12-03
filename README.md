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

## Supported Rules

| Rule | Description |
|----- | ------------|
| [max-dep-keys](./docs/rules/max-dep-keys.md)| Checks number of dependent keys |
| [no-settimeout](./docs/rules/no-settimeout.md) | Proposes to use `run`-methods instead of `setTimeout` |
| [no-throw](./docs/rules/no-throw.md) | Proposes to use `assert` from `@ember/debug` instead of throwing errors |
| [no-typeof](./docs/rules/no-typeof.md) | Proposes to use `typeOf` from `@ember/utils` instead of  built-in `typeof` for some types check |
| [cp-brace-expansion](./docs/rules/cp-brace-expansion.md) | Checks dependent keys for possibility to do brace expansion |
| [no-is-array](./docs/rules/no-is-array.md) | Checks for array detection and propose to use `isArray` from `@ember/array` |
| [no-this-in-dep-keys](./docs/rules/no-this-in-dep-keys.md) | Checks dependent keys for `this.`-prefix |
| [one-level-each](./docs/rules/one-level-each.md) | Checks `@each` usage in the dependent keys |
| [square-brackets](./docs/rules/square-brackets.md) | Checks `[]` usage in the dependent keys |
| [no-multi-dots](./docs/rules/no-multi-dots.md) | Checks dependent keys to not contain `..` |
| [no-typo-in-dep-keys](./docs/rules/no-typo-in-dep-keys.md) | Checks possible typos in the dependent keys (it doesn't check short keys) |
| [cp-macro-args-limit](./docs/rules/cp-macro-args-limit.md) | Checks dependent keys count |
| [cp-macro-not-key](./docs/rules/cp-macro-not-key.md) | Checks arguments for computed macros to not be dependent keys |
| [no-expr-in-dep-keys](./docs/rules/no-expr-in-dep-keys.md) | Checks dependent keys to not contain expressions |
| [no-empty-declaration](./docs/rules/no-empty-declaration.md) | Disallow empty `extend` for Ember Objects |
| [cp-macro-alias](./docs/rules/cp-macro-alias.md) | Looks for Computed Properties that look like `computed.alias` but are written as 'general' CP |
| [super-args](./docs/rules/super-args.md) | Checks potential invalid calls `_super` without `...` |
| [route-model-return](./docs/rules/route-model-return.md) | Checks that `model` hook returns a value |
| [no-dep-keys-loop](./docs/rules/no-dep-keys-loop.md) | Checks for loops in the dependent keys |

Deprecated and removed:

| Rule | Reason |
|------|--------|
| `no-declare-obj-components` | Use `ember/avoid-leaking-state-in-ember-objects` from [eslint-plugin-ember](https://github.com/ember-cli/eslint-plugin-ember) |
| `no-set-in-getter` | Use `no-side-effects` from [eslint-plugin-ember](https://github.com/ember-cli/eslint-plugin-ember) |
| `no-dup-keys` | Use `no-duplicate-dependent-keys` from [eslint-plugin-ember](https://github.com/ember-cli/eslint-plugin-ember) |
| `destructuring` | It's not needed for modules API |
| `no-define-property` | `defineProperty` is private, so it must not be used at all |
| `no-console` | Proposed `Ember.Logger` is private, so rule may be replaced with `no-console` from ESLint | 

## Usage

Add to your eslint config-file:

```json
{
  "plugins": [
      "ember-cleanup"
  ],
  "rules": {
      "ember-cleanup/max-dep-keys": [2, {"max": 5, "tryExpandKeys": true}],
      "ember-cleanup/no-settimeout": 2,
      "ember-cleanup/no-throw": 2,
      "ember-cleanup/no-typeof": [2, {"disallowed": ["object"]}],
      "ember-cleanup/cp-brace-expansion": 2,
      "ember-cleanup/no-is-array": 2,
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
      "ember-cleanup/no-expr-in-dep-keys": 2,
      "ember-cleanup/no-empty-declaration": [1, {
          "allowedFor": ["Model"]
      }],
      "ember-cleanup/square-brackets": 2,
      "ember-cleanup/cp-macro-alias": 2,
      "ember-cleanup/super-args": 2,
      "ember-cleanup/route-model-return": 1,
      "ember-cleanup/no-dep-keys-loop": 2
  }
}
```
