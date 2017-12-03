## Don't throw Errors, use `assert`

### Rule name: `no-throw`

Rule proposes to use `assert` from `@ember/debug` instead of throwing errors

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/no-throw": 2
  }
}
```

### Valid

```javascript
import {assert} from '@ember/debug';
Component.extend({
  method() {
    assert('msg', get(this, 'a'));
  }
});
```

### Invalid

```javascript
Component.extend({
  method() {
    if (!get(this, 'a')) {
      throw new Error('msg');
    }
  }
});
```