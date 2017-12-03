## Check possible typos in the dependent keys

### Rule name: `no-typo-in-dep-keys`

Rule uses [Damerau–Levenshtein distance](https://en.wikipedia.org/wiki/Damerau–Levenshtein_distance) to check if some keys look similar but not same.

Rule may give false positives for pairs like `key1`, `key2` and `service`, `services`.

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/no-typo-in-dep-keys": 1
  }
}
```

### Valid

Any dependent keys has diff more than 1 symbol

### Invalid

```javascript
Component.extend({
  firstProp: computed('count', function () {
    // ...
  }),
  // 'count' and not 'coint' expected here
  secondProp: computed('coint', function () {
    // ...
  })
});
```