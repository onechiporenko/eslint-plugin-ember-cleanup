## Checks for expressions in the dependent keys

### Rule name: `no-expr-in-dep-keys`

Don't use expression as a dependent keys

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/no-expr-in-dep-keys": 2
  }
}
```

### Valid

```javascript
Component.extend({
  prop: computed('a', function () {
    // ...
  })
});
```

### Invalid

```javascript
Component.extend({
  prop: computed(extraFuncCall(), function () {
    // ...
  })
});
```