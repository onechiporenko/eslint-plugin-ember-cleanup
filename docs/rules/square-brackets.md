## Check for `[]` usage in the dependent keys

### Rule name: `square-brackets`

Dependent key can't end with `@each` (must be `[]`). `[]` can't be used in the middle of the dependent key (must be at the end). Dot must be before `[]`.

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/square-brackets": 2
  }
}
```

### Valid

```javascript
Component.extend({
  prop: computed('a.[]', function () {
    // ...
  })    
});
```

### Invalid

```javascript
Component.extend({
  prop1: computed('a.@each', function () {}),
  prop2: computed('a.[].b', function () {}),
  prop3: computed('a[]', function () {})
});
```