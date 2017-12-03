## Check `model` hook in the Routes

### Rule name: `route-models-return`

Hook `model` must return something

### Usage

```json
{
  "plugins": [
    "ember-cleanup"
  ],
  "rules": {
    "ember-cleanup/route-models-return": 2
  }
}
```

### Valid

```javascript
Route.extend({
  model() {
    return get(this, 'store').findAll('unit');
  }
});
```

### Invalid

```javascript
Route.extend({
  model() {
    get(this, 'store').findAll('unit'); // no `return`
  }
});
```