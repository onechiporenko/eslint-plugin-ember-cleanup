## Check for `@each` usage in the dependent keys

### Rule name: `one-level-each`

Multiple `@each` are not allowed in the same dependent key. Also `@each` can't have a deep suffix

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/one-level-each": 2
  }
}
```

### Valid

```javascript
Component.extend({
  prop: computed('a.@each.b', function () {
    // ...
  })
});
```

### Invalid

```javascript
Component.extend({
  prop1: computed('a.@each.b.@each.c', function () {
    // ...
  }),
  prop2: computed('a.@each.b.c', function () {
    // ...
  })
});
```