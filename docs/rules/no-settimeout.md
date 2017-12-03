## Check for `setTimeout` usage

### Rule name: `no-settimeout`

`setTimeout` must not be used inside Ember app. `later` or `next` from `@ember/run` must be used.

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/no-settimeout": 1
  }
}
```

### Valid

```javascript
import {later} from '@ember/run';
Component.extend({
  method() {
    later(() => {}, 1000);
  }
});
```

```javascript
import {next} from '@ember/run';
Component.extend({
  method() {
    next(() => {});
  }
});
```

### Invalid

```javascript
Component.extend({
  method() {
    setTimeout(() => {}, 1000);
  }
});
```

```javascript
Component.extend({
  method() {
    setTimeout(() => {}, 1);
  }
});
```