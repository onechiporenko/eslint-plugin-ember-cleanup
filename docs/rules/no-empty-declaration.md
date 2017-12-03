## Disallow empty `extend` for Ember Objects

### Rule name: `no-empty-declaration`

No sense to create empty Controllers, Components, Routes etc. Ember will do this itself.

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/no-empty-declaration": [1, {
      "allowedFor": ["Model"]
    }]
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
Component.extend({});
```