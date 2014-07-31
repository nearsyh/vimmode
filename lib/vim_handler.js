'use strict';

var common = require('./common.js');
var breach = require('breach_module');
var async = require('async');

var vim_handler = function(spec, my) {
  var _super = {};
  my = my || {};
  spec = spec || {};

  // #### public
  var init;
  var kill;

  // #### private
  var vim_shortcut_new; 
  var vim_shortcut_close; 
  var vim_shortcut_reload;
  var vim_shortcut_nexttab;
  var vim_shortcut_prevtab;

  var vim_shortcut_upscroll;
  var vim_shortcut_downscroll;

  // #### that
  var that = {};

  // #### private functions impl
  vim_shortcut_new = function() {
    console.log('[vimmode] new tab');
    breach.module('core').call('tabs_new', {
      visible: true,
      focus: false,
    }, function(err) {
      if(err) return console.log('Unexpected Error : %s', err);
      else return console.log("[vimmode] new tab created");
    });
  }

  var vim_shortcut_operation = function(op) {
    return function() {
      console.log('[vimmode] ' + op + ' tab');
      breach.module('core').call('tabs_current', {}, function(err, res) {
        return breach.module('core').call('tabs_' + op, {
          id: res.id,
        }, function(err) {
          if(err) return console.log('Unexpected Error : %s', err);
          else return console.log('[vimmode] tab %id ' + op, res);
        });
      });
    }
  }

  vim_shortcut_close = vim_shortcut_operation('close');
  vim_shortcut_reload = vim_shortcut_operation('reload');

  vim_shortcut_nexttab = function() {
  }

  vim_shortcut_upscroll = function() {
    console.log('[vimmode] up scroll');
  }

  vim_shortcut_downscroll = function() {
    console.log('[vimmode] down scroll');
  }

  // ## init function
  init = function(cb_) {
    async.series([
      function(cb_) {
        my.vim_keyboard = require('./vim_keyboard.js').vim_keyboard({});

        my.vim_keyboard.on('new', vim_shortcut_new);
        my.vim_keyboard.on('close', vim_shortcut_close);
        my.vim_keyboard.on('reload', vim_shortcut_reload);
        my.vim_keyboard.on('up', vim_shortcut_upscroll);
        my.vim_keyboard.on('down', vim_shortcut_downscroll);

        my.tabs = require('./tabs.js').tabs({});
        return cb_();
      },
      function(cb_) {
        async.parallel([
          my.vim_keyboard.init,
          my.tabs.init
        ], cb_);
      },
    ], cb_);
  }

  // ## kill function
  kill = function(cb_) {
    async.parallel([
      my.vim_keyboard.init,
      my.tabs.init
    ], cb_);
    return cb_();
  }

  common.method(that, 'init', init, _super);
  common.method(that, 'kill', kill, _super);

  return that;
}

exports.vim_handler = vim_handler;
