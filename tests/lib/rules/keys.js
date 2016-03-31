module.exports = {
  code: [
    {CODE: "Ember.computed({{KEYS}}, function () {});"},
    {CODE: "Em.computed({{KEYS}}, function () {});"},
    {CODE: "Ember.computed.someMacro({{KEYS}}, function () {});"},
    {CODE: "Em.computed.someMacro({{KEYS}}, function () {});"},
    {CODE: "Ember.computed({{KEYS}}, {get() {}, set() {}});"},
    {CODE: "Em.computed({{KEYS}}, {get() {}, set() {}});"},
    {CODE: "Ember['computed']({{KEYS}}, function () {});"},
    {CODE: "Em['computed']({{KEYS}}, function () {});"},
    {CODE: "Ember['computed'].someMacro({{KEYS}}, function () {});"},
    {CODE: "Em['computed'].someMacro({{KEYS}}, function () {});"},
    {CODE: "Ember['computed']({{KEYS}}, {get() {}, set() {}});"},
    {CODE: "Em['computed']({{KEYS}}, {get() {}, set() {}});"},
    {CODE: "Ember.observes({{KEYS}}, function () {});"},
    {CODE: "Em.observes({{KEYS}}, function () {});"},
    {CODE: "Ember['observes']({{KEYS}}, function () {});"},
    {CODE: "Em['observes']({{KEYS}}, function () {});"},
    {CODE: "computed({{KEYS}}, function () {});"},
    {CODE: "computed.someMacro({{KEYS}}, function () {});"},
    {CODE: "computed({{KEYS}}, {get() {}, set() {}});"},
    {CODE: "observes({{KEYS}}, function () {});"},
    {CODE: "var a = {b: function() {}.property({{KEYS}})};"},
    {CODE: "var a = {b: function() {}.observes({{KEYS}})};"}
  ],

  macro: [
    {CODE: "{{MACRO}}({{KEYS}});"},
    {CODE: "computed.{{MACRO}}({{KEYS}});"},
    {CODE: "myNamespace.{{MACRO}}({{KEYS}});"},
    {CODE: "space.subSpace.{{MACRO}}({{KEYS}});"},
    {CODE: "Em.computed.{{MACRO}}({{KEYS}});"},
    {CODE: "Em['computed'].{{MACRO}}({{KEYS}});"},
    {CODE: "Em['computed']['{{MACRO}}']({{KEYS}});"},
    {CODE: "Ember['computed'].{{MACRO}}({{KEYS}});"},
    {CODE: "Ember['computed']['{{MACRO}}']({{KEYS}});"}
  ]
};