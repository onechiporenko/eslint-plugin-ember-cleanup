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
* `max-dep-keys` Check number of dependent keys for observers and computed properties. May be customized with `max` - maximum number of dependent keys (default `3`), `tryExpandKeys` - should keys like `a.{b,c}` be 1 key or it should be expanded to two keys - `a.b, a.c`. Default - `false`

```
{
    "rules": [
        "ember-cleanup/max-dep-keys": [2, {"max": 5, "tryExpandKeys": true}]
    ]
}
```

* `no-console` Propose to use `Ember.Logger` instead of `console`
* `no-dup-keys` Check for duplicated dependent keys for observers and computed properties. May be customized with `tryExpandKeys` - should keys like `a.{b,c}` be 1 key or it should be expanded to two keys - `a.b, a.c`. Default - `false`

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
    "ember-cleanup/cp-brace-expansion": 2
}
```