## Check calls of `_super`

### Rule name: `super-args`

Check potential invalid calls `_super` without `...`

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/super-args": 2
  }
}
```

### Valid

```javascript
SomeClass.extend({
  method() {
    return this._super(...arguments);
  }
});
```

### Invalid

```javascript
SomeClass.extend({
  method() {
    return this._super(arguments);
  }
});
```