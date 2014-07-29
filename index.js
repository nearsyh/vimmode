'use strict';

var breach = require('breach_module');
var common = require('./lib/common.js');
var async = require('async');

common._ = {
  vim_handler: require('./lib/vim_handler.js').vim_handler({})
}

breach.init(function() {
  breach.register('core', 'inst:.*');
  breach.register('core', 'tabs:keyboard');
  breach.register('core', 'controls:keyboard');

  breach.expose('init', function(src, args, cb_) {
    console.log('Vimmode Init');
    async.parallel([
      common._.vim_handler.init
    ], cb_);
  });

  breach.expose('kill', function(args, cb_) {
    console.log('Vimmode Exit');
    async.parallel([
      common._.vim_handler.kill
    ], function(err) {
      common.exit(0);
    });
  });
});

process.on('uncaughtException', function(err) {
  common.fatal(err);
});
