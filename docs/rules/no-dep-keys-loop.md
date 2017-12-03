## Checks for cross-links in the dependent keys

### Rule name: `no-dep-keys-loop`

Check for loops in the dependent keys of the computed properties

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/no-dep-keys-loop": 2
  }
}
```

### Valid

```javascript
Component.extend({
  prop1: computed('prop2', function () {}),
  prop2: computed('a', function () {})
});
```

### Invalid

```javascript
Component.extend({
  // prop1 -> prop2 -> prop1
  prop1: computed('prop2', function () {}),
  prop2: computed('prop1', function () {}) 
});

Component.extend({
  // prop1 -> prop2 -> prop3 -> prop1 
  prop1: computed('prop2', function () {}),
  prop2: computed('prop3', function () {}), 
  prop3: computed('prop1', function () {}) 
})
```