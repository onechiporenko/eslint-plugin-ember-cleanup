## Check for `typeof` usage

### Rule name: `no-typeof`

Propose to use `typeOf` from `@ember/utils` instead of  built-in `typeof` for some types check

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/no-typeof": 1
  }
}
```

### Valid

```javascript
import {typeOf} from '@ember/utils';
Component.extend({
  method() {
    return typeOf(get(this, 'a')) === 'number';
  }
});
```

### Invalid

```javascript
Component.extend({
  method() {
    return typeof(get(this, 'a')) === 'number';
  }
});
```