## CP arguments types

Checks arguments for computed macros to not be dependent keys. Several CP macros don't expect that some of their arguments will be dependent keys and not values.
 
_This rule may be false positive_

### Rule name: `cp-macro-not-key`

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/cp-macro-not-key": [2, {"check": {
      "equal": [1],
      "filterBy": [2],
      "gt": [1],
      "gte": [1],
      "lt": [1],
      "lte": [1]
    }}]
  }
}
```

### Valid

```javascript
Component.extend({
  prop1: equal('a', 1),
  prop2: filterBy('a', 'b', 1),
  prop3: gt('a', 1),
  prop4: gte('a', 1),
  prop5: lt('a', 1),
  prop6: lte('a', 1)
});
```

### Invalid

```javascript
Component.extend({
  b: 'some val',
  prop1: equal('a', 'b'),
  prop2: filterBy('a', 'prop', 'b'),
  prop3: gt('a', 'b'),
  prop4: gte('a', 'b'),
  prop5: lt('a', 'b'),
  prop6: lte('a', 'b')
});
```