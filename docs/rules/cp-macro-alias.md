## Check for CP that look like `computed.alias`

### Rule name: `cp-macro-alias`

Looks for Computed Properties that look like `computed.alias` but written as 'general' CP

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/cp-macro-alias": 1
  }
}
```

### Valid

```javascript
Component.extend({
  prop: computed.alias('val')
});
```

### Invalid

```javascript
Component.extend({
  prop: computed('val', function () {
    return get(this, 'val');
  })
});
```