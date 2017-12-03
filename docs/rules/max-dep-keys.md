## Checks CP dependent keys count

### Rule name: `max-dep-keys`

Checks number of dependent keys for observers and computed properties. Rule may be customized with: 

* `max` - maximum number of dependent keys (default `3`)
* `tryExpandKeys` - should keys like `a.{b,c}` be 1 key or it should be expanded to two keys - `a.b, a.c`. Default - `true`

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/max-dep-keys": [2, {"max": 4}]
  }
}
```

### Valid

```javascript
Component.extend({
  prop: computed('a', 'b', 'c', function () {
    // ...
  })
})
```

### Invalid

```javascript
Component.extend({
  // here `max` is 4
  prop: computed('a', 'b', 'c', 'd', 'e', 'f', function () {
    // ...
  })
});
```