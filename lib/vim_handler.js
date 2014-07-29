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
  // ## mode switch
  var vim_shortcut_new; 
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
      else console.log("[vimmode] new tab created");
    });
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
        my.vim_keyboard.on('up', vim_shortcut_upscroll);
        my.vim_keyboard.on('down', vim_shortcut_downscroll);
        return cb_();
      },
      function(cb_) {
        async.parallel([
          my.vim_keyboard.init
        ], cb_);
      },
    ], cb_);
  }

  // ## kill function
  kill = function(cb_) {
    return cb_();
  }

  common.method(that, 'init', init, _super);
  common.method(that, 'kill', kill, _super);

  return that;
}

exports.vim_handler = vim_handler;
