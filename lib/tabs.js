'use strict';

var breach = require('breach_module');
var common = require('./common.js');

var tabs = function(spec, my) {
  var _super = {};
  my = my || {};
  spec = spec || {};

  var that = {};

  // #### public
  var init;
  var kill;

  var tabs_visible;

  // ## init function
  init = function(cb_) {
    return cb_();
  }

  // ## kill function
  kill = function(cb_) {
    return cb_();
  }

  // ## tabs_visible function
  tabs_visible = function(cb_) {
    return breach.module('core').call('tabs_get', {}, function(err, res) {
      if(err) return console.log("Unexpected Error : %s", err);
      var ret = null
      res.forEach(function(tab) {
        if(tab.state.visible) ret = tab.id;
      });
      if(ret) return cb_(null, ret);
      else return cb_('Visible tab not found', null);
    });
  }

  common.method(that, 'init', init, _super);
  common.method(that, 'kill', kill, _super);
  common.method(that, 'tabs_visible', tabs_visible, _super);

  return that;
};

exports.tabs = tabs;
