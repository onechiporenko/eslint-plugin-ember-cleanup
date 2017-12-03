## Checks dependent keys

### Rule name: `no-multi-dots`

Check if some of dependent keys contains `..`.

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/no-multi-dots": 2
  }
}
```

### Valid

```javascript
Component.extend({
  prop: computed('a.b', function () {
    // ...
  })
});
```

### Invalid

```javascript
Component.extend({
  prop: computed('a...b', function () {
    // ...
  })
});
```