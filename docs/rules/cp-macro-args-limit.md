## CP dependent keys limit

### Rule name: `cp-macro-args-limit`

Checks number of the dependent keys for computed macros

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/cp-macro-args-limit": [2, {"check": {
      "and": {"min": 2},
      "or": {"min": 2},
      "max": {"eq": 1},
      "min": {"eq": 1}
    }}]
  }
}
```

### Valid

```javascript
Component.extend({
  prop1: or('a', 'b'),
  prop2: and('a', 'b', 'c'),
  prop3: max('list'),
  prop4: min('list')
});
```

### Invalid

```javascript
Component.extend({
  prop1: or('a'),
  prop2: and('a'),
  prop3: max('a', 'b'),
  prop4: min('a', 'b')
});
```