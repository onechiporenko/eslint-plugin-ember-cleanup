## Check CP dependent keys for `this.`

### Rule name: `no-this-in-dep-keys`

Dependent keys for CP must not contain `this.`

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/no-this-in-dep-keys": 2
  }
}
```

### Valid

Any CP without `this.` in the any of its dependent keys.

### Invalid

```javascript
Component.extend({
  prop: computed('this.a', function () {
    // ...
  })
});
```