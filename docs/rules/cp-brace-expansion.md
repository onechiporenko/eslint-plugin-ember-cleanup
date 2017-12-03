## Possible brace expansion

### Rule name: `cp-brace-expansion`

Checks dependent keys for possibility to do brace expansion

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/cp-brace-expansion": 1
  }
}
```

### Valid

```javascript
Component.extend({
  prop: computed('foo.{bar,baz}', function () {
    // ...
  })
});

Component.extend({
  prop: computed('{bar,baz}.foo', function () {
    // ...
  })
});
```

### Invalid

```javascript
Component.extend({
  prop: computed('foo.bar', 'foo.baz', function () {
    // ...
  })
});

Component.extend({
  prop: computed('bar.foo', 'baz.foo', function () {
    // ...
  })
});
```