module.exports = {
  code: [
    {CODE: "Ember.computed({{KEYS}}, function () {});"},
    {CODE: "Ember.computed({{KEYS}}, {get() {}, set() {}});"},
    {CODE: "Ember['computed']({{KEYS}}, function () {});"},
    {CODE: "Ember['computed']({{KEYS}}, {get() {}, set() {}});"},
    {CODE: "Ember.observes({{KEYS}}, function () {});"},
    {CODE: "Ember['observes']({{KEYS}}, function () {});"},
    {CODE: "computed({{KEYS}}, function () {});"},
    {CODE: "computed({{KEYS}}, {get() {}, set() {}});"},
    {CODE: "observes({{KEYS}}, function () {});"},
    {CODE: "var a = {b: function() {}.property({{KEYS}})};"},
    {CODE: "var a = {b: function() {}.observes({{KEYS}})};"}
  ]
};