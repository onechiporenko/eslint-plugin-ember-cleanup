## Checks for array detection

### Rule name: `no-is-array`

Checks for array detection and propose to use `isArray` from `@ember/array`;

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/no-is-array": 2
  }
}
```

### Valid

```javascript
import {isArray} from '@ember/array';
Component.extend({
  method() {
    return isArray(get(this, 'prop'));
  }
});
```

### Invalid

```javascript
Component.extend({
  method() {
    return Array.isArray(get(this, 'prop'));
  }
});
```

```javascript
import {typeOf} from '@ember/utils';
Component.extend({
  method() {
    return typeOf(get(this, 'prop')) === 'array';
  }
});
```