module.exports = {
  extends: require.resolve("./base.js"),
  rules: {
    "ember-cleanup/max-dep-keys": [2, {"max": 5}],
    "ember-cleanup/no-settimeout": 2,
    "ember-cleanup/no-throw": 2,
    "ember-cleanup/no-typeof": [2, {"disallowed": ["object"]}],
    "ember-cleanup/cp-brace-expansion": 2,
    "ember-cleanup/no-is-array": 2,
    "ember-cleanup/no-this-in-dep-keys": 2,
    "ember-cleanup/one-level-each": 2,
    "ember-cleanup/no-multi-dots": 2,
    "ember-cleanup/no-typo-in-dep-keys": [2],
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
    "ember-cleanup/no-empty-declaration": 0,
    "ember-cleanup/square-brackets": 2,
    "ember-cleanup/cp-macro-alias": 0,
    "ember-cleanup/super-args": 2,
    "ember-cleanup/route-model-return": 2,
    "ember-cleanup/no-dep-keys-loop": 2
  }
};